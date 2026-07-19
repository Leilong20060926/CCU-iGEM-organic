const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const {
  CATEGORIES,
  TOKEN_LABELS_EN,
  categoryOf,
  matchesCategory,
  countyOf,
  splitCrops,
  buildCropIndex,
  cropsForCategory,
  normalizeCrop,
} = require("./taxonomy");
const { geocodeAddress } = require("./geocode");
const { getFriendlyCache, friendlyIdsForCrop, getFriendlyDetail } = require("./friendly");

const app = express();
const PORT = process.env.PORT || 3000;

const SOURCE_URL =
  "https://data.moa.gov.tw/Service/OpenData/Traceability/TraceabilityOrganic.aspx";

const SORTABLE_FIELDS = [
  "Name", "Address", "Tel", "Products", "ContainCrops", "BehaviorType",
  "CompanyName", "CertOrganicSn", "EffectiveDate", "Status", "MailingAddress", "OldCertOrganicSN",
];

const STATUSES = ["通過", "結束", "終止", "暫終"];

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache = { rows: null, byId: null, cropIndex: null, fetchedAt: 0 };

function makeId(row) {
  const hash = crypto
    .createHash("sha1")
    .update(`${row.Name}|${row.CertOrganicSn}|${row.Address}`)
    .digest("hex");
  return hash.slice(0, 12);
}

async function getCache() {
  const isFresh = cache.rows && Date.now() - cache.fetchedAt < CACHE_TTL_MS;
  if (isFresh) return cache;

  const res = await fetch(SOURCE_URL);
  if (!res.ok) {
    throw new Error(`Upstream request failed with status ${res.status}`);
  }
  const raw = await res.json();

  const byId = new Map();
  const rows = raw.map((row) => {
    const id = makeId(row);
    const enriched = { ...row, id, certType: "organic", county: countyOf(row.Address) };
    byId.set(id, enriched);
    return enriched;
  });

  const cropIndex = buildCropIndex(rows);

  cache = { rows, byId, cropIndex, fetchedAt: Date.now() };
  return cache;
}

// Friendly data comes from a separate government site (epv.afa.gov.tw); if it
// is down the organic data must keep working, so failures degrade to "none".
async function getFriendlyRowsSafe() {
  try {
    const { rows } = await getFriendlyCache();
    return rows;
  } catch (err) {
    console.error("Friendly list unavailable:", err.message);
    return [];
  }
}

app.use(cors());

// GET /api/organic/meta - aggregate counts, no full rows
app.get("/api/organic/meta", async (req, res) => {
  try {
    const { rows } = await getCache();
    const friendlyRows = await getFriendlyRowsSafe();
    const allRows = rows.concat(friendlyRows);

    const categories = CATEGORIES.map((cat) => {
      const count = allRows.filter((r) => matchesCategory(r, cat.id, null)).length;
      const subs = cat.subs
        ? cat.subs.map((sub) => ({
            id: sub.id,
            zh: sub.zh,
            en: sub.en,
            count: allRows.filter((r) => matchesCategory(r, cat.id, sub.id)).length,
          }))
        : null;
      return { id: cat.id, zh: cat.zh, en: cat.en, icon: cat.icon, count, subs };
    });

    // County counts stay organic-only: friendly list rows carry no address.
    const countyCounts = new Map();
    const statusCounts = new Map();
    for (const row of rows) {
      if (row.county) countyCounts.set(row.county, (countyCounts.get(row.county) || 0) + 1);
      statusCounts.set(row.Status, (statusCounts.get(row.Status) || 0) + 1);
    }
    for (const row of friendlyRows) {
      statusCounts.set(row.Status, (statusCounts.get(row.Status) || 0) + 1);
    }

    res.json({
      total: allRows.length,
      certTypes: [
        { value: "organic", count: rows.length },
        { value: "friendly", count: friendlyRows.length },
      ],
      categories,
      counties: [...countyCounts.entries()].map(([name, count]) => ({ name, count })),
      statuses: [...statusCounts.entries()].map(([value, count]) => ({ value, count })),
      tokenLabelsEn: TOKEN_LABELS_EN,
      fetchedAt: cache.fetchedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to retrieve organic traceability data" });
  }
});

// GET /api/organic/crops?category=&sub= - crop tiles for a category/sub, data-driven from ContainCrops
app.get("/api/organic/crops", async (req, res) => {
  try {
    const { category, sub } = req.query;
    if (!category || !categoryOf(category)) {
      return res.status(400).json({ error: `Unknown category: ${category}` });
    }
    const { cropIndex } = await getCache();
    res.json({ crops: cropsForCategory(cropIndex, category, sub) });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to retrieve organic traceability data" });
  }
});

// Friendly operators are enriched with their scraped detail page (cert
// number, expiry, farm address, actual status, specific crops).
async function getFriendlyOperator(id) {
  const { byId } = await getFriendlyCache();
  const row = byId.get(id);
  if (!row) return null;
  const detail = await getFriendlyDetail(row.tillageId);
  return {
    ...row,
    CertOrganicSn: detail.certNo,
    EffectiveDate: detail.effectiveDate,
    Address: detail.address,
    Status: detail.status,
    ContainCrops: detail.containCrops,
    county: countyOf(detail.address),
  };
}

// GET /api/organic/:id - single operator detail (organic or friendly)
app.get("/api/organic/:id", async (req, res) => {
  try {
    if (req.params.id.startsWith("f")) {
      const row = await getFriendlyOperator(req.params.id);
      if (!row) return res.status(404).json({ error: "Not found" });
      return res.json(row);
    }
    const { byId } = await getCache();
    const row = byId.get(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to retrieve organic traceability data" });
  }
});

// GET /api/organic/:id/geocode - best-effort lat/lng for the operator's actual address
app.get("/api/organic/:id/geocode", async (req, res) => {
  try {
    let row;
    if (req.params.id.startsWith("f")) {
      row = await getFriendlyOperator(req.params.id);
    } else {
      const { byId } = await getCache();
      row = byId.get(req.params.id);
    }
    if (!row) return res.status(404).json({ error: "Not found" });

    let point = row.Address ? await geocodeAddress(row.Address) : null;
    if (!point && row.MailingAddress && row.MailingAddress !== row.Address) {
      point = await geocodeAddress(row.MailingAddress);
    }
    if (!point) return res.status(404).json({ error: "Could not geocode address" });
    res.json(point);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Geocoding failed" });
  }
});

// GET /api/organic?page=&pageSize=&sortBy=&order=&search=&category=&sub=&county=&status=&crop=&certType=
app.get("/api/organic", async (req, res) => {
  try {
    const {
      sortBy = "Name",
      order = "asc",
      search,
      category,
      sub,
      county,
      status,
      crop,
      certType,
    } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));

    if (!SORTABLE_FIELDS.includes(sortBy)) {
      return res.status(400).json({
        error: `Invalid sortBy field. Must be one of: ${SORTABLE_FIELDS.join(", ")}`,
      });
    }
    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({ error: "order must be 'asc' or 'desc'" });
    }
    if (category && !categoryOf(category)) {
      return res.status(400).json({ error: `Unknown category: ${category}` });
    }
    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(", ")}` });
    }
    if (certType && !["organic", "friendly"].includes(certType)) {
      return res.status(400).json({ error: "certType must be 'organic' or 'friendly'" });
    }

    const { rows } = await getCache();
    let filtered = certType === "friendly" ? [] : rows;

    if (category) filtered = filtered.filter((r) => matchesCategory(r, category, sub));
    if (county) filtered = filtered.filter((r) => r.county === county);
    if (status) filtered = filtered.filter((r) => r.Status === status);
    if (crop) filtered = filtered.filter((r) => splitCrops(r.ContainCrops).map(normalizeCrop).includes(crop));
    if (search) {
      const needle = String(search).toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(needle))
      );
    }

    // Merge in friendly-farming operators under the same filters. Their list
    // rows have no county or crop detail, so: county filters exclude them, and
    // crop filters go through the upstream 產品範圍 search instead.
    if (certType !== "organic" && !county) {
      let friendly = await getFriendlyRowsSafe();
      if (category) friendly = friendly.filter((r) => matchesCategory(r, category, sub));
      if (status) friendly = friendly.filter((r) => r.Status === status);
      if (crop) {
        try {
          const ids = await friendlyIdsForCrop(crop);
          friendly = friendly.filter((r) => ids.has(r.id));
        } catch (err) {
          console.error("Friendly crop search unavailable:", err.message);
          friendly = [];
        }
      }
      if (search) {
        const needle = String(search).toLowerCase();
        friendly = friendly.filter((row) =>
          Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(needle))
        );
      }
      filtered = filtered.concat(friendly);
    }

    const direction = order === "desc" ? -1 : 1;
    const sorted = [...filtered].sort((a, b) => {
      const valA = String(a[sortBy] ?? "");
      const valB = String(b[sortBy] ?? "");
      return valA.localeCompare(valB, "zh-Hant") * direction;
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = sorted.slice(start, start + pageSize);

    res.json({ total, page, pageSize, totalPages, sortBy, order, data });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to retrieve organic traceability data" });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});