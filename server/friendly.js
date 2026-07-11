// Friendly-farming (友善耕作) operator data, scraped from the AFA e-portal at
// https://epv.afa.gov.tw/Home/FriendlyIndustryQuery - unlike the organic data
// there is no open-data JSON endpoint, so this speaks to the same
// CSRF-protected form endpoint the site's own frontend uses.

const BASE = "https://epv.afa.gov.tw";
const QUERY_PAGE = `${BASE}/Home/FriendlyIndustryQuery`;
const QUERY_API = `${BASE}/Home/FriendlyIndustry`;
const DETAIL_PAGE = `${BASE}/Home/IndustryInfo?TillageID=`;

const CACHE_TTL_MS = 10 * 60 * 1000; // matches the organic list cache

// --- CSRF session (anti-forgery cookie + form token pair) ---

let session = null; // { cookie, token }

async function newSession() {
  const res = await fetch(QUERY_PAGE, { headers: { "Accept-Language": "zh-TW" } });
  if (!res.ok) throw new Error(`Friendly query page returned ${res.status}`);
  const cookies = res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .filter((c) => !c.startsWith("epv_lang="));
  // Force Traditional Chinese - the API localizes CropCategory names by this
  // cookie, and our taxonomy matching needs the zh tokens.
  cookies.push("epv_lang=zh");
  const html = await res.text();
  const match = html.match(/__RequestVerificationToken[^>]*value="([^"]+)"/);
  if (!match) throw new Error("Could not extract anti-forgery token");
  return { cookie: cookies.join("; "), token: match[1] };
}

async function postQuery(params, retried = false) {
  if (!session) session = await newSession();

  const body = new URLSearchParams({
    NowPage: "1",
    PageSize: "10000",
    SortField: "",
    SortAction: "",
    ...params,
    __RequestVerificationToken: session.token,
  });

  const res = await fetch(QUERY_API, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
      cookie: session.cookie,
    },
    body,
  });

  if (!res.ok) {
    session = null;
    if (!retried) return postQuery(params, true);
    throw new Error(`Friendly query failed with status ${res.status}`);
  }
  return res.json();
}

// --- full operator list ---

function normalizeRow(raw) {
  return {
    id: `f${raw.ID}`,
    tillageId: raw.ID,
    certType: "friendly",
    Name: raw.Name,
    CompanyName: raw.Group, // 友善團體 plays the certifying-body role
    Products: raw.CropCategory || "",
    // The public query only lists currently-approved operators; detail pages
    // confirm per-operator status and override this when viewed.
    Status: "通過",
    Address: "",
    MailingAddress: "",
    Tel: "",
    ContainCrops: "",
    BehaviorType: "",
    CertOrganicSn: "",
    EffectiveDate: "",
    OldCertOrganicSN: "",
    county: null,
  };
}

let listCache = { rows: null, byId: null, fetchedAt: 0 };

async function getFriendlyCache() {
  const isFresh = listCache.rows && Date.now() - listCache.fetchedAt < CACHE_TTL_MS;
  if (isFresh) return listCache;

  const data = await postQuery({});
  const byId = new Map();
  const rows = (data.rows || []).map((raw) => {
    const row = normalizeRow(raw);
    byId.set(row.id, row);
    return row;
  });

  listCache = { rows, byId, fetchedAt: Date.now() };
  return listCache;
}

// --- per-crop upstream search (SearchByField=2 searches 產品範圍) ---

const cropSearchCache = new Map(); // crop -> { ids: Set, fetchedAt }

async function friendlyIdsForCrop(crop) {
  const cached = cropSearchCache.get(crop);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.ids;

  const data = await postQuery({ SearchByField: "2", SearchByKeyWords: crop });
  const ids = new Set((data.rows || []).map((r) => `f${r.ID}`));
  cropSearchCache.set(crop, { ids, fetchedAt: Date.now() });
  return ids;
}

// --- detail page scrape ---

const detailCache = new Map(); // tillageId -> parsed detail

function fieldValue(html, label) {
  const re = new RegExp(
    `${label}</div>\\s*<div class="col-md-4">\\s*<div class="text-color">([\\s\\S]*?)</div>`
  );
  const match = html.match(re);
  if (!match) return "";
  return match[1].replace(/<[^>]+>/g, "").trim();
}

function parseRocDate(text) {
  // "2027年06月29日" -> "2027/06/29"
  const m = text.match(/(\d{4})年(\d{2})月(\d{2})日/);
  return m ? `${m[1]}/${m[2]}/${m[3]}` : text;
}

async function getFriendlyDetail(tillageId) {
  if (detailCache.has(tillageId)) return detailCache.get(tillageId);

  const res = await fetch(`${DETAIL_PAGE}${tillageId}`, {
    headers: { "Accept-Language": "zh-TW", cookie: "epv_lang=zh" },
  });
  if (!res.ok) throw new Error(`Friendly detail page returned ${res.status}`);
  const html = await res.text();

  const crops = [];
  const cropRe = /data-title="品項">([^<]*)<\/div>\s*<div class="cell" data-title="產品範圍">([^<]*)</g;
  let m;
  while ((m = cropRe.exec(html))) {
    const items = m[2].trim();
    if (items) crops.push(items);
  }

  const detail = {
    certNo: fieldValue(html, "友善字號"),
    effectiveDate: parseRocDate(fieldValue(html, "友善效期")),
    address: fieldValue(html, "耕作場所地址"),
    status: fieldValue(html, "友善狀態") || "通過",
    containCrops: crops.join("、"),
  };

  detailCache.set(tillageId, detail);
  return detail;
}

module.exports = { getFriendlyCache, friendlyIdsForCrop, getFriendlyDetail };
