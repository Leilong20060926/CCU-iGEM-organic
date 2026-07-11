// Real-world category taxonomy derived from the MOA "Products" field (44 distinct tokens).
// Each top-level category maps to one or more real tokens, optionally grouped into subs.

const CATEGORIES = [
  {
    id: "rice",
    zh: "米類",
    en: "Rice",
    icon: "🌾",
    subs: null,
    tokens: ["米"],
  },
  {
    id: "staple",
    zh: "雜糧",
    en: "Staple Grains",
    icon: "🌽",
    subs: null,
    tokens: ["雜糧", "種子(苗)"],
  },
  {
    id: "special",
    zh: "特用作物",
    en: "Special Crops",
    icon: "🍵",
    subs: null,
    tokens: ["茶", "咖啡", "甘蔗", "堅果", "芻料作物", "非供食用之作物"],
  },
  {
    id: "veg",
    zh: "蔬菜類",
    en: "Vegetables",
    icon: "🥬",
    subs: [
      { id: "leafwrap", zh: "包葉菜", en: "Head vegetables", tokens: ["包葉菜"] },
      { id: "leaf", zh: "短期葉菜", en: "Leafy greens", tokens: ["短期葉菜"] },
      { id: "root", zh: "根莖菜", en: "Root vegetables", tokens: ["根莖菜"] },
      {
        id: "flowerfruit",
        zh: "花菜／果菜／豆菜／瓜菜",
        en: "Flower / fruit / bean / melon veg",
        tokens: ["花菜", "果菜", "瓜菜", "豆菜", "瓜果"],
      },
      { id: "fungisprout", zh: "蕈菜／芽菜", en: "Mushrooms & sprouts", tokens: ["蕈菜", "芽(苗)菜"] },
    ],
  },
  {
    id: "fruit",
    zh: "水果類",
    en: "Fruits",
    icon: "🍊",
    subs: [
      { id: "berry", zh: "大／小漿果", en: "Berries", tokens: ["大漿果", "小漿果"] },
      { id: "citrus", zh: "柑桔類", en: "Citrus", tokens: ["柑桔"] },
      { id: "stonepome", zh: "核果與梨果類", en: "Stone & pome fruit", tokens: ["核果", "梨果"] },
    ],
  },
  {
    id: "processed",
    zh: "農糧加工品類",
    en: "Processed Products",
    icon: "🫙",
    subs: null,
    tokens: [
      "自產農產加工品", "穀物加工品", "冷藏或冷凍食品", "植物粉狀加工品", "乾燥蔬果調製加工品",
      "天然植物茶", "醃漬食品", "經炮製或乾燥處理之植物", "糖類及其製品", "醱酵食品",
      "罐頭食品", "油脂", "香辛植物調味料及其製品", "藻類製品", "乳製品",
      "水產動物製品", "肉製品", "蛋製品", "飲品",
    ],
  },
  {
    id: "other",
    zh: "其他",
    en: "Other",
    icon: "🌿",
    subs: null,
    tokens: ["其他"],
  },
];

// English labels for every real token, used by both the meta endpoint and the client.
const TOKEN_LABELS_EN = {
  "根莖菜": "Root vegetables", "其他": "Other", "大漿果": "Large berries", "短期葉菜": "Leafy greens",
  "果菜": "Fruit vegetables", "瓜菜": "Melon vegetables", "包葉菜": "Head vegetables", "柑桔": "Citrus",
  "雜糧": "Staple grains", "小漿果": "Small berries", "梨果": "Pome fruit", "豆菜": "Bean vegetables",
  "自產農產加工品": "Self-processed farm products", "花菜": "Flower vegetables", "核果": "Stone fruit",
  "米": "Rice", "瓜果": "Melon fruit", "咖啡": "Coffee", "茶": "Tea", "蕈菜": "Mushroom vegetables",
  "穀物加工品": "Processed grain products", "甘蔗": "Sugarcane", "芽(苗)菜": "Sprouts",
  "堅果": "Nuts", "芻料作物": "Forage crops", "非供食用之作物": "Non-food crops",
  "飲品": "Beverages", "冷藏或冷凍食品": "Chilled/frozen food", "植物粉狀加工品": "Plant powder products",
  "乾燥蔬果調製加工品": "Dried fruit/veg preparations", "天然植物茶": "Natural herbal tea",
  "醃漬食品": "Pickled food", "經炮製或乾燥處理之植物": "Processed/dried plants",
  "糖類及其製品": "Sugar products", "醱酵食品": "Fermented food", "罐頭食品": "Canned food",
  "油脂": "Oils & fats", "香辛植物調味料及其製品": "Spice & seasoning products",
  "種子(苗)": "Seeds/seedlings", "藻類製品": "Algae products", "乳製品": "Dairy products",
  "水產動物製品": "Aquatic animal products", "肉製品": "Meat products", "蛋製品": "Egg products",
};

const TOKEN_TO_CATEGORY = new Map();
for (const cat of CATEGORIES) {
  const allTokens = cat.subs ? cat.subs.flatMap((s) => s.tokens) : cat.tokens;
  for (const token of allTokens) {
    TOKEN_TO_CATEGORY.set(token, cat.id);
  }
}

function splitProducts(productsField) {
  return String(productsField || "")
    .split("、")
    .map((s) => s.trim())
    .filter(Boolean);
}

function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function tokensForCategory(catId, subId) {
  const cat = categoryOf(catId);
  if (!cat) return [];
  if (!subId) return cat.subs ? cat.subs.flatMap((s) => s.tokens) : cat.tokens;
  const sub = (cat.subs || []).find((s) => s.id === subId);
  return sub ? sub.tokens : [];
}

function matchesCategory(row, categoryId, subId) {
  if (!categoryId) return true;
  const tokens = tokensForCategory(categoryId, subId);
  if (!tokens.length) return false;
  const rowTokens = splitProducts(row.Products);
  return tokens.some((t) => rowTokens.includes(t));
}

function splitCrops(containCropsField) {
  return String(containCropsField || "")
    .split("、")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Every leaf navigation unit: a category with no subs, or each of its subs.
function leafUnits() {
  const leaves = [];
  for (const cat of CATEGORIES) {
    if (cat.subs) {
      for (const sub of cat.subs) leaves.push({ key: `${cat.id}:${sub.id}`, catId: cat.id, subId: sub.id });
    } else {
      leaves.push({ key: cat.id, catId: cat.id, subId: null });
    }
  }
  return leaves;
}

const KNOWN_TOKENS = new Set(TOKEN_TO_CATEGORY.keys());
const MIN_CROP_COUNT = 5;
const MAX_CROPS_PER_LEAF = 40;

// A handful of non-rice grain species are, in this dataset, grown almost
// exclusively by operators who also grow rice (every "小麥" grower here also
// lists 米) - so the majority-vote below is a genuine statistical tie with no
// signal to break it, and defaults to whichever leaf happens to be listed
// first. These are botanically unambiguous, so they're forced to "staple"
// rather than left to the tie-break.
const FORCED_STAPLE_MATCH = /小麥|蕎麥|薏苡|薏仁|大麥|燕麥|高粱|黃豆|大豆/;

// Data-driven crop -> leaf-category attribution: since ContainCrops is each
// operator's *entire* crop list (not scoped to one category) and a farm can
// grow rice AND wheat AND vegetables, we can't just dump ContainCrops for
// "rice" operators - that would wrongly include their wheat and vegetables
// too. For every distinct crop name we tally which leaf categories its
// growers belong to, across the WHOLE dataset, and assign the crop to
// whichever leaf wins.
//
// A naive full-credit-per-leaf tally is skewed by diversified farms: if most
// wheat growers happen to also grow rice, wheat gets fully credited to BOTH
// "rice" and "staple" for every one of those farms, and can wrongly outrank
// rice's genuine (but rarer) varieties. Each operator's vote is instead split
// evenly across every leaf it matches, so a rice+wheat farm contributes only
// half a vote to each - wheat still correctly loses to "staple" once actual
// staple-only wheat growers are counted, since they aren't diluted.
function buildCropIndex(rows) {
  const leaves = leafUnits();
  const scores = new Map(); // crop -> Map<leafKey, fractional score>
  const totalMentions = new Map(); // crop -> raw operator count, for display/threshold

  const rowLeavesCache = rows.map((row) => leaves.filter((l) => matchesCategory(row, l.catId, l.subId)).map((l) => l.key));

  rows.forEach((row, i) => {
    const rowLeaves = rowLeavesCache[i];
    if (!rowLeaves.length) return;
    const share = 1 / rowLeaves.length;

    for (const crop of splitCrops(row.ContainCrops)) {
      if (KNOWN_TOKENS.has(crop)) continue; // category label, not a specific crop
      if (crop.length > 10 || crop.includes(",")) continue; // malformed/noisy entries
      if (!scores.has(crop)) scores.set(crop, new Map());
      const perLeaf = scores.get(crop);
      for (const leafKey of rowLeaves) {
        perLeaf.set(leafKey, (perLeaf.get(leafKey) || 0) + share);
      }
      totalMentions.set(crop, (totalMentions.get(crop) || 0) + 1);
    }
  });

  // Determine each crop's winning leaf from the fractional scores.
  const winningLeaf = new Map(); // crop -> leafKey
  for (const [crop, perLeaf] of scores) {
    if (FORCED_STAPLE_MATCH.test(crop) && perLeaf.has("staple")) {
      winningLeaf.set(crop, "staple");
      continue;
    }
    let bestLeaf = null;
    let bestScore = 0;
    for (const [leafKey, score] of perLeaf) {
      if (score > bestScore) {
        bestScore = score;
        bestLeaf = leafKey;
      }
    }
    if (bestLeaf) winningLeaf.set(crop, bestLeaf);
  }

  // Recount plainly: for each crop, how many operators that actually match its
  // winning leaf also list it - a real, whole, interpretable number to display.
  const realCounts = new Map(); // crop -> count
  rows.forEach((row, i) => {
    const rowLeaves = new Set(rowLeavesCache[i]);
    for (const crop of splitCrops(row.ContainCrops)) {
      const leafKey = winningLeaf.get(crop);
      if (leafKey && rowLeaves.has(leafKey)) {
        realCounts.set(crop, (realCounts.get(crop) || 0) + 1);
      }
    }
  });

  const byLeaf = new Map(leaves.map((l) => [l.key, []]));
  for (const [crop, leafKey] of winningLeaf) {
    const count = realCounts.get(crop) || 0;
    if (totalMentions.get(crop) >= MIN_CROP_COUNT && count >= MIN_CROP_COUNT) {
      byLeaf.get(leafKey).push({ name: crop, count });
    }
  }

  for (const [leafKey, list] of byLeaf) {
    list.sort((a, b) => b.count - a.count);
    byLeaf.set(leafKey, list.slice(0, MAX_CROPS_PER_LEAF));
  }

  return byLeaf;
}

function cropsForCategory(cropIndex, catId, subId) {
  const key = subId ? `${catId}:${subId}` : catId;
  return cropIndex.get(key) || [];
}

const COUNTIES = [
  "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市",
  "基隆市", "新竹市", "嘉義市",
  "新竹縣", "苗栗縣", "彰化縣", "南投縣", "雲林縣", "嘉義縣",
  "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣",
];
const COUNTY_SET = new Set(COUNTIES);

function countyOf(address) {
  const prefix = String(address || "").slice(0, 3);
  return COUNTY_SET.has(prefix) ? prefix : null;
}

module.exports = {
  CATEGORIES,
  TOKEN_LABELS_EN,
  COUNTIES,
  splitProducts,
  splitCrops,
  categoryOf,
  tokensForCategory,
  matchesCategory,
  countyOf,
  TOKEN_TO_CATEGORY,
  buildCropIndex,
  cropsForCategory,
};
