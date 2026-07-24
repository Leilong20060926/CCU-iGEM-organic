const fs = require("fs");

// Small helper for persisting a JSON-serializable snapshot to disk, so a
// server restart can load the last-known-good data instantly instead of
// blocking on a fresh upstream fetch. Save is fire-and-forget (write errors
// are logged, not thrown - losing the persisted snapshot isn't fatal, the
// in-memory cache still works until the next restart).
function makeDiskCache(filePath) {
  function load() {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      return null;
    }
  }
  function save(data) {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) console.error(`Failed to persist cache to ${filePath}:`, err.message);
    });
  }
  return { load, save };
}

module.exports = { makeDiskCache };
