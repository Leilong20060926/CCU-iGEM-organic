const fs = require("fs");
const path = require("path");

// Nominatim (OpenStreetMap) usage policy requires: max 1 request/sec, a
// descriptive User-Agent, and caching results rather than re-requesting them.
// https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "TrueHarvest-CCU-iGEM-organic-lookup/1.0 (educational project)";
const MIN_INTERVAL_MS = 1100;

// Two on-disk caches: one keyed by the full original address (short-circuits
// the whole fallback chain for repeat views of the same operator), one keyed
// by each individual query variant tried (shared across operators on the same
// street/district, since Taiwan OSM housenumber coverage is sparse and most
// full addresses fail down to street- or district-level anyway).
// Configurable so a Docker volume can be mounted here to persist the cache
// across container restarts/recreates instead of losing it every time.
const CACHE_DIR = process.env.GEOCODE_CACHE_DIR || __dirname;
const ADDRESS_CACHE_FILE = path.join(CACHE_DIR, ".geocode-cache.json");
const QUERY_CACHE_FILE = path.join(CACHE_DIR, ".geocode-query-cache.json");

function loadCache(file) {
  try {
    return new Map(Object.entries(JSON.parse(fs.readFileSync(file, "utf8"))));
  } catch {
    return new Map();
  }
}

const addressCache = loadCache(ADDRESS_CACHE_FILE);
const queryCache = loadCache(QUERY_CACHE_FILE);

const saveTimers = {};
function scheduleSave(file, map) {
  if (saveTimers[file]) return;
  saveTimers[file] = setTimeout(() => {
    saveTimers[file] = null;
    fs.writeFile(file, JSON.stringify(Object.fromEntries(map)), () => {});
  }, 2000);
}

let lastRequestAt = 0;
let queue = Promise.resolve();

function throttledFetch(url) {
  const run = async () => {
    const wait = MIN_INTERVAL_MS - (Date.now() - lastRequestAt);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastRequestAt = Date.now();
    return fetch(url, { headers: { "User-Agent": USER_AGENT } });
  };
  const result = queue.then(run, run);
  queue = result.catch(() => {});
  return result;
}

async function queryNominatim(query) {
  if (queryCache.has(query)) return queryCache.get(query);

  const url = `${NOMINATIM_URL}?format=json&limit=1&countrycodes=tw&q=${encodeURIComponent(query)}`;
  let result = null;
  try {
    const res = await throttledFetch(url);
    if (res.ok) {
      const body = await res.json();
      if (body[0]) result = { lat: Number(body[0].lat), lng: Number(body[0].lon) };
    }
  } catch {
    result = null;
  }

  queryCache.set(query, result);
  scheduleSave(QUERY_CACHE_FILE, queryCache);
  return result;
}

const COUNTY_RE = /^(.{2,3}(市|縣))/;
const DISTRICT_RE = /^.{2,3}(?:市|縣)(.{1,3}(?:市|區|鄉|鎮))/;

// Builds progressively coarser variants of a Taiwan address, most specific first,
// each labeled with the precision it would represent if Nominatim resolves it.
function buildCandidates(address) {
  const candidates = [];
  const seen = new Set();
  const push = (query, precision) => {
    const q = query.trim();
    if (q && !seen.has(q)) {
      seen.add(q);
      candidates.push({ query: q, precision });
    }
  };

  // 1. Full address as given.
  push(address, "address");

  // 2. Strip floor/unit suffix ("6樓之4", "3F" style trailing detail).
  const noFloor = address.replace(/\d+樓.*$/, "").replace(/之\d+$/, "");
  push(noFloor, "address");

  // 3. Strip the house number too, keeping road/lane/alley + district + city.
  const noNumber = noFloor.replace(/\d+號$/, "");
  push(noNumber, "street");

  // 4. Strip lane/alley/neighborhood detail, keeping just the base road name.
  const roadOnly = noNumber
    .replace(/\d+鄰/, "")
    .replace(/\d+(巷|弄|之\d+)$/, "")
    .replace(/第?\d+(段)$/, "");
  push(roadOnly, "street");

  // 5. Traditional/informal county-name variant (臺 <-> 台), tried at street level.
  const swapped = roadOnly.includes("臺") ? roadOnly.replace(/臺/g, "台") : roadOnly.replace(/台/g, "臺");
  push(swapped, "street");

  // 6. District + city only.
  const districtMatch = address.match(DISTRICT_RE);
  const countyMatch = address.match(COUNTY_RE);
  if (districtMatch && countyMatch) {
    push(`${countyMatch[1]}${districtMatch[1]}`, "district");
  } else if (countyMatch) {
    push(countyMatch[1], "county");
  }

  return candidates;
}

async function geocodeAddress(address) {
  if (!address) return null;
  if (addressCache.has(address)) return addressCache.get(address);

  let result = null;
  for (const { query, precision } of buildCandidates(address)) {
    const point = await queryNominatim(query);
    if (point) {
      result = { ...point, precision };
      break;
    }
  }

  addressCache.set(address, result);
  scheduleSave(ADDRESS_CACHE_FILE, addressCache);
  return result;
}

module.exports = { geocodeAddress };
