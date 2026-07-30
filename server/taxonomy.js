// Real-world category taxonomy derived from the MOA "Products" field (44 distinct tokens).
// Each top-level category maps to one or more real tokens, optionally grouped into subs.

const CATEGORIES = [
  {
    id: "rice",
    zh: "米類",
    en: "Rice",
    icon: "🌱🌾🍚",
    subs: null,
    tokens: ["米", "白米", "糙米", "胚芽米", "黑糙米"],
  },
  {
    id: "staple",
    zh: "雜糧",
    en: "Staple Grains",
    icon: "🍠🫘🥜",
    subs: null,
    tokens: ["雜糧", "種子(苗)"],
  },
  {
    id: "special",
    zh: "特用作物",
    en: "Special Crops",
    icon: "🌰☕🥥",
    subs: null,
    tokens: ["咖啡", "甘蔗", "堅果", "芻料作物", "非供食用之作物"],
  },
  {
    id: "veg",
    zh: "蔬菜類",
    en: "Vegetables",
    icon: "🫑🥬🥦",
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
    icon: "🍎🍊🍇",
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
    icon: "🥖🍵🍜",
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
    icon: "🍃🌼🌿",
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

const CATEGORY_LABEL_TOKENS = new Set(
  [...TOKEN_TO_CATEGORY.keys()].filter((token) => !["白米", "糙米", "胚芽米", "黑糙米"].includes(token))
);
const MIN_CROP_COUNT = 5;
const MAX_CROPS_PER_LEAF = 40;

// Raw ContainCrops entries that aren't crop names at all - just a
// modifier/packaging/processing-state word ("國產" = domestic-origin,
// "鹽燒" = salt-grilled, "截切"/"乾燥" = cut/dried with no crop attached,
// "脫殼" = dehulled/shelled with no crop attached, "盒裝"/"袋裝"/"罐裝" =
// boxed/bagged/canned). Removing them from CROP_CATEGORY_MAP alone isn't
// enough - buildCropIndex() below still falls back to live-voting any crop
// it doesn't recognize, which would otherwise resurrect these as tiles.
// Filtered out here so they never reach the vote tally at all.
const CROP_NAME_BLOCKLIST = new Set([
  "國產", "鹽燒", "截切", "乾燥", "脫殼", "盒裝", "袋裝", "罐裝",
  // "種子(苗)" is a real-world category label token (see TOKEN_TO_CATEGORY),
  // not a crop name - but stripBracketedContent reduces it to bare "種子"
  // before this list is checked, so it must be blocked in its stripped form
  // too or it resurfaces as a fake generic "seeds" tile.
  "種子",
  // Coffee bean origin/roast-style descriptors ("咖啡豆(耶加雪夫)",
  // "咖啡豆(義式)"...) - not crop names. stripBracketedContent strips the
  // "咖啡豆" wrapper in some source rows but leaves these bare in others,
  // so they leak through as fake single-country/style "crop" tiles.
  "耶加雪夫", "哥倫比亞", "多明尼加", "墨西哥", "秘魯", "瓜地馬拉",
  "宏都拉斯", "藍山", "曼巴", "義大利", "義式", "玻利維亞", "法式",
  "曼特寧", "巴布亞紐幾內亞", "尼加拉瓜", "厄瓜多",
  "酸漿果","海梨橙",
]);

// --- Manual crop corrections --------------------------------------------
// The majority-vote in buildCropIndex() below gets some crops wrong, usually
// because most growers of that crop in this dataset happen to also grow
// something in a different leaf category (e.g. most 綠豆 growers here also
// grow 米, so 綠豆 loses the vote to "rice" or gets diluted elsewhere instead
// of landing on "staple"). Rather than tuning the voting algorithm, wrong
// crops are corrected here by name - add an entry any time a crop shows up
// under the wrong category or subcategory tile.

// Certification-status prefixes the source data prepends to ~half of all
// crop names ("有機黃豆", "有機轉型期紅豆", "轉型期有機紅豆" ...). These say
// nothing about the crop itself - just whether that particular operator is
// certified or still in conversion - so they're stripped before anything
// else. Longest / combined forms first so "有機轉型期紅豆" and
// "轉型期有機紅豆" both collapse to "紅豆", not "轉型期紅豆".
const CERT_STATUS_PREFIX = /^(有機轉型期|轉型期有機|有機|轉型期)/;
// Same certification-status marker, but appended as a suffix after a dash
// instead of prefixed - e.g. "高麗菜-有機", "山東大白菜-有機" (half- and
// full-width dash both occur in the data).
const CERT_STATUS_SUFFIX = /[-－](有機轉型期|轉型期有機|有機|轉型期)$/;

// raw crop name (as written in ContainCrops, after stripping the cert-status
// prefix above and trailing punctuation) -> canonical display name. Use this
// to merge spelling variants / synonyms into a single crop tile.
const CROP_ALIASES = {
  "白雪菇": "雪白菇",
  "黑蠔菇": "黑美人菇",
  "小黃瓜": "花胡瓜",
  "洛神花乾": "洛神葵乾",
  "印度棗": "棗",
  "苦茶": "油茶",
  "紅石榴": "石榴",
  "芭樂芯": "番石榴",
  "星蘋果": "牛奶果",
  "甜豆": "豌豆",
  "山苦瓜": "苦瓜",
  "甜玉米": "玉米",
  "大黃瓜": "胡瓜",
  "哈密瓜": "洋香瓜",
  "茭白筍": "筊白筍",
  "金時地瓜": "栗子地瓜",
  "米碾製品": "碾製米",
  "蜜棗": "棗",
  "甜桃": "桃",
  "甜柿": "柿",
  "蜜李": "李",
  "紅文旦": "文旦",
  "佛利檬": "佛利蒙柑",
  "黃金包心白菜": "黃金白菜",
  "葉菜甘藷": "地瓜葉",
  "澳洲胡桃": "胡桃",
  "白毫烏龍": "烏龍茶",
  "薑粉": "薑黃粉",
  "大白柚": "白柚",
  "四季柑": "金桔",
  "葵瓜子": "葵花子",
  "大豆": "黃豆",
  "白薏仁": "薏仁",
  "截切地瓜": "甘藷",
  "截切包心白菜": "結球菜",
  "包心萵苣": "結球萵苣",
  "味美白菜": "味美菜",
  "截切高麗菜": "甘藍",
  "甘藍分切": "甘藍",
  "山東白菜": "山東大白菜",
  "鴻禧菇": "鴻喜菇",
  "胡麻": "芝麻",
  // Same thing ("rice, milled") written four different ways in the source
  // data - some fragments even missing the leading "米" entirely, likely
  // from the field being split on "、" mid-phrase upstream.
  "米[碾製品]": "碾製米",
  "米(碾製品)": "碾製米",
  "其碾製品": "碾製米",
  "碾製品": "碾製米",
  // Confirmed synonyms / character variants found by auditing the real
  // dataset - same crop, different spelling, not wrapped in a bracket so
  // stripBracketedContent doesn't catch them.
  "蕃茄": "番茄",
  "靑花菜": "青花菜",
  "高麗菜": "甘藍",
  "美生菜": "結球萵苣",
  "白花椰菜": "花椰菜",
  "紫洋蔥": "洋蔥",
  "紅蘿蔔": "胡蘿蔔",
  "白蘿蔔": "蘿蔔",
  // Source data also contains a CJK compatibility-ideograph lookalike of
  // "蘿" (U+F910, visually identical) for these 3 crops - normalize it to
  // the real character so they merge with the correct 根莖菜 (root) entries
  // instead of sitting as separate, wrongly-categorized ghost crops.
  "蘿蔔": "蘿蔔",
  "胡蘿蔔": "胡蘿蔔",
  "櫻桃蘿蔔": "櫻桃蘿蔔",
  "轎篙筍": "茭白筍",
  "紅藜麥": "紅藜",
  "波蘿蜜": "波羅蜜",
  "乾洛神葵": "洛神葵乾",
  "高麗菜苗": "甘藍菜苗",
  // 短期葉菜 (leafy greens) audit: pure spelling/character variants of the
  // same vegetable, previously sitting as separate un-merged tiles.
  "芥藍": "芥蘭",       // same crop as 芥蘭/芥蘭菜/格藍菜 above (Chinese kale)
  "芥藍菜": "芥蘭",
  "葉蘿蔔": "蘿蔔葉",   // "leaf-use radish" - same product, 3 spellings
  "葉用蘿蔔": "蘿蔔葉",
  "紅藜菜": "紅藜葉",   // red quinoa leaves - alternate name
  "巴西里": "巴西利",   // parsley - character variant
  "荷蘭芹": "巴西利",   // parsley - alternate common name
  "土人蔘": "土人參",   // 蔘/參 character variant
  "巴蔘": "巴蔘菜",     // 蔘/參 character variant
  "巴參菜": "巴蔘菜",
  "靑江菜": "青江菜",   // 靑 is a variant form of 青
  "羅蔓萵苣": "蘿蔓萵苣", // romaine - transliteration variant (蘿/羅)
  "羅美心": "蘿美心",   // romaine heart - transliteration variant (蘿/羅)
  "蒜苗": "青蒜",       // garlic shoot - same crop as 青蒜 above (root/stem veg)
  // 根莖菜 (root vegetables) audit: pure spelling/naming variants of the
  // same crop, previously sitting as separate un-merged tiles.
  "竹荀": "竹筍",         // 荀 is a typo for 筍
  "石篙筍": "石篙竹筍",
  "竹筍(石篙竹筍": "石篙竹筍", // malformed/unclosed bracket variant
  "紅蔥": "紅蔥頭",       // shallot - short form of the name above
  "火蔥": "紅蔥頭",       // shallot - Hokkien alternate name
  "大蒜": "蒜頭",         // garlic - standard-Mandarin vs Taiwan-usage name
  "蒜": "蒜頭",           // garlic - bare single-character form
  "葱": "蔥",             // 葱 is a character variant of 蔥 (green onion)
  "生薑": "薑",           // fresh ginger - same crop, longer form of the name
  "紅根甜菜": "甜菜根",   // beetroot - alternate descriptive name
  "木薯": "樹薯",         // cassava - alternate name
  "竹芋": "葛鬱金",       // arrowroot (Maranta arundinacea) - alternate name
  "芋莖": "芋頭梗",       // taro stalk - already merges with 芋梗 above
  "芋頭莖": "芋頭梗",
  "茴香頭": "球莖茴香",   // fennel bulb - alternate name
  "香茅草": "檸檬草",     // lemongrass - alternate name (currently misfiled - see below)
  "棗子": "棗",           // jujube - alternate name (currently misfiled - see below)
  "菜瓜": "絲瓜",         // luffa/loofah - Taiwanese Hokkien alternate name (currently misfiled - see below)
  // Confirmed duplicate tiles per MOA "有機農業商品化資材及農產品品項" audit:
  // same crop, different name used by different operators in the source data.
  "地瓜": "甘藷",
  "番薯": "甘藷",
  "薏苡": "薏仁",
  "高梁": "高粱",
  "栗米": "小米",
  "粟米": "小米",
  "甜根菜": "甜菜根",
  "落花生": "花生",
  "花生仁": "花生",
  "乾燥黃豆": "黃豆",
  "乾紅藜": "紅藜",
  "乾燥紅藜": "紅藜",
  "脫殼紅藜": "紅藜",
  // Same category ("paddy's milled products"), one written with the
  // literary particle "之" and one without - different operators, same
  // real-world crop.
  "稻穀碾製品": "稻穀之碾製品",
  // 包葉菜 audit: descriptive generic terms for the same heading vegetable,
  // not distinct varieties - merge into the canonical name.
  "包心白菜": "大白菜",
  "結球白菜": "大白菜",
  "紫高麗菜": "紫甘藍",
  "白花椰": "花椰菜",
  // Synonyms found while auditing the veg:leafwrap bucket - same crop,
  // different name, merged into one canonical tile.
  "結球甘藍": "甘藍",
  "孢子甘藍": "抱子甘藍",
  "馬約蘭": "馬鬱蘭",
  "芋梗": "芋頭梗",
  "芥蘭菜": "芥蘭",
  "格藍菜": "芥蘭", // "格藍菜" is a documented alt-name for 芥藍/芥蘭 (Chinese kale)
  "雪蓮": "菊薯", // "雪蓮果" is the common name for yacon, whose proper crop name is 菊薯
  // 花菜／果菜／豆菜／瓜菜 (veg:flowerfruit) audit: same crop, different
  // spelling/writing, or a processing-note suffix left un-bracketed so
  // stripBracketedContent doesn't catch it - merged into one canonical tile.
  "小蕃茄": "小番茄",             // 蕃/番 character variant, same cherry tomato
  "玉女小蕃茄": "玉女小番茄",     // same cultivar ("Yunu" cherry tomato), 3 spellings
  "玉女番茄": "玉女小番茄",
  "黑柿蕃茄": "黑柿番茄",         // 蕃/番 character variant, same tomato cultivar
  "牛蕃茄": "牛番茄",             // 蕃/番 character variant, same beefsteak tomato
  "哈蜜瓜": "哈密瓜",             // 蜜/密 character variant, same melon
  "青花椰": "青花菜",             // alternate names for the same vegetable (broccoli)
  "青花椰菜": "青花菜",
  "青花菜筍": "青花筍",           // same product (broccolini-type flower stem), 2 names
  "紫花椰": "紫花椰菜",           // short form of the same purple-cauliflower name
  "澎湖絲瓜": "絲瓜",             // a loofah grown in Penghu, not a distinct crop
  "食用玉米筍": "玉米筍",         // descriptive "edible" prefix, same crop
  "其他：玉米筍": "玉米筍",       // stray category-prefixed variant of the same crop
  "紅鬚帶殼玉米筍": "紅鬚玉米筍", // "帶殼" (in-husk) is a packaging note, not a different crop
  "甜豌豆": "甜豆",               // same crop (sugar snap pea), alternate name
  "碗豆": "豌豆",                 // common miswrite of 豌豆 (pea)
  "敏豆": "四季豆",               // MOA-documented alt-name for the same bean (Phaseolus vulgaris)
  "醜豆": "粉豆",                 // same flat-pod bean variety, alternate name
  // Pre-cut/sliced variants with no dedicated crop entry - the processing
  // note isn't bracketed in the source data so stripBracketedContent can't
  // catch it. Merge into the base vegetable rather than keep as a separate
  // tile.
  "冬瓜分切": "冬瓜",
  "冬瓜切片": "冬瓜",
  "截切冬瓜": "冬瓜",
  "南瓜分切": "南瓜",
  "截切南瓜": "南瓜",
  "南瓜塊": "南瓜",
  "鮮切有機南瓜": "南瓜",
  "截切大黃瓜": "大黃瓜",
  "截切小黃瓜": "小黃瓜",
  "截切扁蒲": "扁蒲",
  "截切花胡瓜": "花胡瓜",
  // 大／小漿果 (fruit:berry) audit (2026-07): same fruit, different name or
  // character variant, previously sitting as separate un-merged tiles.
  // Canonical form picked to match the root name already used by this
  // fruit's own cultivar entries elsewhere in CROP_CATEGORY_MAP.
  "芭樂": "番石榴",       // common Taiwan name for the same fruit as 番石榴, which is the official MOA item-list term (cultivars 水晶芭樂/紅心芭樂/芭樂芯 stay separate as named cultivars)
  "紅龍果": "火龍果",     // MOA-formal name for the same fruit as 火龍果 (cultivars 紅肉/白肉火龍果 use "火龍果")
  "釋迦": "番荔枝",       // common Taiwan name for the same fruit as 番荔枝, which is the official MOA item-list term (cultivar 鳳梨釋迦, an atemoya hybrid, stays separate)
  "毛荔枝": "紅毛丹",     // alternate name ("hairy lychee") for the same fruit as 紅毛丹
  "鳯梨釋迦": "鳳梨釋迦", // 鳯/鳳 character variant, same atemoya cultivar
  "菠蘿蜜": "波羅蜜",     // 菠/波 character variant, same jackfruit
  "桑葚": "桑椹",         // 葚/椹 character variant, same mulberry
  "獼猴桃": "奇異果",     // mainland-Chinese name for the same fruit as 奇異果 (cultivar 綠奇異果 uses "奇異果")
  "鰐梨": "酪梨",         // alternate name ("crocodile pear") for the same fruit as 酪梨
  // fruit:citrus audit: same fruit, different name/abbreviation/character
  // variant, previously sitting as separate un-merged tiles. Canonical form
  // picked to match the more common Taiwan market name.
  "金柑": "金棗",         // Japanese-derived alternate name for the same kumquat
  // NOTE: 金桔 is deliberately NOT merged here. Although 橘/桔 are usually
  // interchangeable, in everyday Taiwan usage "金桔" (as in 金桔檸檬) commonly
  // refers to 四季桔 (calamondin), a different citrus hybrid from 金棗/金柑
  // (kumquat) - not just a spelling variant of the same fruit.
  "柳橙": "柳丁",         // formal/mainland name for the same fruit as 柳丁 (sweet orange)
  "砂糖桔": "砂糖橘",     // 橘/桔 character variant, same sugar tangerine
  "文旦柚": "文旦",       // full name for the same fruit as 文旦 (pomelo)
  "茂谷": "茂谷柑",       // short form of the same Murcott mandarin cultivar
  "肚臍橙": "臍橙",       // descriptive alternate name for the same navel orange
  "晚崙西亞": "晚崙西亞橙", // short form of the same Valencia orange cultivar
  "台灣香檬": "香檬",     // origin-qualified name for the same fruit as 香檬
  // Per MOA agricultural guidance, Taiwan-grown "無籽檸檬" ("seedless lemon")
  // is market slang for Tahiti lime (大溪地萊姆) - the same fruit sold as
  // 萊姆, not actually a lemon cultivar (true lemons are seeded).
  "無籽檸檬": "萊姆",
  "桔子": "柑橘", // 橘/桔 character variant, same generic mandarin/tangerine name
  // fruit:stonepome audit: "X子" is just the everyday diminutive form of
  // the same fruit name already used by the plain form elsewhere in this
  // category (桃/梅/柿/李), not a distinct cultivar - merge into one tile.
  "桃子": "桃",
  "梅子": "梅",
  "柿子": "柿",
  "李子": "李",
  "沙梨": "梨", // "sand pear" is the historical/regional name for pear generally
  "橘子": "柑橘",
  "甜桔": "柑橘",
  "酸桔": "柑橘",
  "甜橙": "柳丁",
  "香橙": "柳丁",
  "扁實檸檬": "香檬",
  "四季檸檬": "檸檬",
  "海梨": "海梨橙",
};

// The source data very often appends a parenthetical to a crop name that
// doesn't denote a different crop at all - a regional synonym ("花胡瓜(小黃
// 瓜)", "甘藍(高麗菜)", "敏豆(四季豆)"), a processing note ("南瓜(分切)",
// "竹筍(乾燥)"), a variety list, or a retailer name ("茄子(家樂福)"). Left
// alone these fragment one real crop into dozens of near-duplicate tiles.
// Bracket content is stripped entirely (half- and full-width, () and []/【】)
// rather than hand-listing every synonym, since the pattern - not any
// specific phrase - is what's noisy.
function stripBracketedContent(crop) {
  return crop
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[[【][^\]】]*[\]】]/g, "")
    .trim();
}

// The source data sometimes leaves a stray trailing punctuation mark on a
// crop name - e.g. "水稻及其碾製品。" (sentence-final period) or "糙米)" (an
// unmatched closing bracket, from the field getting split on "、" in the
// middle of a parenthetical upstream, or from stripBracketedContent above
// removing a matched pair but leaving a stray leftover mark). Stripped
// generically rather than listed per-crop, since new stray-punctuation
// variants keep showing up.
function stripStrayPunctuation(crop) {
  let s = crop.replace(/[。，,、]+$/, "");
  s = s.replace(/等$/, ""); // trailing "etc." left over from a truncated variety list
  // Trailing unmatched closing bracket (any style: () [] （）【】) with no
  // opening counterpart - leftover from stripBracketedContent removing a
  // matched pair and leaving a stray mark, or from the field being split on
  // "、" mid-phrase upstream so only the tail of a parenthetical survived
  // (e.g. "乾燥]" from "咖啡生豆[經脫皮、乾燥]").
  if (/[)）\]】]$/.test(s) && !/[(（[【]/.test(s)) s = s.slice(0, -1);
  // Leading unmatched opening bracket (any style) with no closing counterpart.
  if (/^[(（[【]/.test(s) && !/[)）\]】]/.test(s)) s = s.slice(1);
  // Unmatched opening bracket mid-string with no closing counterpart anywhere -
  // the head half of the same upstream split (e.g. "咖啡生豆[經脫皮" and
  // "咖啡生豆(經脫皮" from the same truncated "咖啡生豆[經脫皮、乾燥]" field).
  // Everything from the stray bracket onward is a truncated parenthetical,
  // not part of the crop name, so it's cut off.
  const openIdx = s.search(/[(（[【]/);
  if (openIdx !== -1 && !/[)）\]】]/.test(s)) s = s.slice(0, openIdx);
  return s.trim();
}

function normalizeCrop(crop) {
  const certStripped = String(crop || "")
    .replace(CERT_STATUS_PREFIX, "")
    .replace(CERT_STATUS_SUFFIX, "");
  let s = stripStrayPunctuation(stripBracketedContent(certStripped));
  if (!s) s = stripStrayPunctuation(certStripped); // malformed entry with no content outside brackets
  return CROP_ALIASES[s] || s;
}

// canonical crop name (after alias normalization) -> forced leaf key.
// Leaf key is "catId" for categories with no subs, or "catId:subId" for ones
// with subs (e.g. "veg:root"). Once a crop is listed here it always lands on
// that leaf, taking priority even over CROP_CATEGORY_MAP below - this is the
// list to edit for manual corrections that should always win.
const CROP_FORCED_LEAF = {
  // 雜糧 Staple grains
  "綠豆": "staple",
  "黑豆": "staple",
  "小麥": "staple",
  "蕎麥": "staple",
  "薏苡": "staple",
  "薏仁": "staple",
  "大麥": "staple",
  "燕麥": "staple",
  "高粱": "staple",
  "黃豆": "staple",
  "大豆": "staple",
  // 米類 - these are already-milled rice, but most operators who list them
  // are processors whose Products field also carries genuine processed-food
  // tokens, which pulls the vote toward 農糧加工品類. They belong with rice.
  "白米": "rice",
  "糙米": "rice",
  "胚芽米": "rice",
  "黑糙米": "rice",
  "米碾製品": "rice",
  "黑米": "rice", // a rice variety, not a processed product
  // The following genuinely voted into the wrong top-level category (not a
  // naming duplicate - the crop itself just isn't what its growers' other
  // products suggest). Found by auditing the real dataset by hand.
  "苦瓜乾": "processed", // dried, not a raw staple grain
  "矢車菊": "other", // cornflower - an ornamental/herbal flower
  "綠橡萵苣": "veg:leaf", // a lettuce variety, not a grain
  "紅藜葉": "veg:leaf", // the plant's edible leaves, not the grain
  "節瓜": "veg:flowerfruit", // fuzzy melon - a melon, not a head vegetable
  "紅辣椒": "veg:flowerfruit", // a chili pepper variety
  "青龍辣椒": "veg:flowerfruit", // a chili pepper variety
  "糯玉米": "veg:flowerfruit", // glutinous corn - a corn variety, not a root
  "蓮花": "other", // lotus flower, not a root vegetable (蓮藕 lotus root stays veg:root)
  "蒔蘿": "other", // dill - an herb, not a root vegetable
  "貢菊": "other", // a chrysanthemum grown for tea, not a citrus fruit
  "茉莉": "other", // jasmine - a flower, not a berry fruit
  "肉桂葉乾": "other", // dried cinnamon leaf, an herb/spice product like 肉桂
  "青辣椒": "veg:flowerfruit", // a chili pepper variety
  "黃花椰菜": "veg:flowerfruit", // a cauliflower color variety, same as 花椰菜/白花椰菜
  "碗豆苗": "veg:fungisprout", // pea shoots - a sprout, not a head vegetable
  "野山菊": "veg:leaf", // wild chrysanthemum greens, eaten as a leafy green
  "水白菜": "veg:leaf",
  "冰菜": "veg:leaf", // ice plant (Mesembryanthemum crystallinum), a leafy green
  "甜芥菜": "veg:leaf", // a mustard-green variety
  "野莧菜": "veg:leaf", // wild amaranth greens
  "長梗青江菜": "veg:leaf", // a bok choy variety
  "鹿角A菜": "veg:leaf", // oak-leaf lettuce - loose-leaf, not head-forming
  "白肉火龍果": "fruit:berry", // a dragon fruit variety, not a staple grain
  "糙米米粉": "processed", // rice noodles/vermicelli, a processed product
  "榛果": "special", // hazelnut, alongside 核桃/腰果

  // --- MOA "有機農業商品化資材及農產品品項" audit corrections -------------
  // 特用作物 raw crop vs. its finished product: the raw bud (茶菁) and raw
  // bean (咖啡鮮果) stay "special", but every finished tea/coffee product is
  // 加工品 in the MOA schema, not a special crop.
  "茶葉": "processed",
  "茶乾": "processed",
  "紅茶": "processed",
  "白茶": "processed",
  "烏龍茶": "processed",
  "綠茶": "processed",
  "包種茶": "processed",
  "東方美人茶": "processed",
  "蜜香紅茶": "processed",
  "紅玉紅茶": "processed",
  "咖啡豆": "processed",
  "咖啡粉": "processed",
  "咖啡茶葉": "processed",
  // 食用甘蔗 (eating sugarcane) is a root/stem vegetable, distinct from the
  // 特用作物 sugarcane grown for sugar production.
  "食用甘蔗": "veg:root",
  // 椰子 (coconut) is officially classified under 堅果 (nuts) in MOA's
  // 有機農產品類別及品項一覽表, alongside 杏仁/核桃/腰果/栗子/榛果 below -
  // corrected from "fruit:berry" (2026-07 audit).
  "椰子": "special",
  // 杏仁 (almond) is a nut, alongside 核桃/腰果/栗子 - was voting into
  // "processed" instead.
  "杏仁": "special",
  // 包葉菜 (head-vegetable) audit: these were voting into leafwrap but are
  // not actual head-forming vegetables per MOA's item list.
  "紅杏菜": "veg:leaf", // red amaranth - a loose leafy green
  "綠杏菜": "veg:leaf", // green amaranth - a loose leafy green
  "白葉菜": "veg:leaf", // non-heading Chinese cabbage
  "甜菜根葉": "veg:leaf", // beet greens, not the head vegetable
  "芹菜管": "veg:root", // stem vegetable, grouped with 球莖甘藍 under root/stem
  "高麗菜芽": "veg:fungisprout", // axillary shoot re-grown from a harvested cabbage stump, not a head vegetable
  // 根莖菜類 audit: these were voting into leafy greens but MOA classifies
  // them as root/stem vegetables.
  "蔥": "veg:root",
  "韭菜": "veg:root",
  "青蒜": "veg:root",
  "西洋芹菜": "veg:root",
  // 九層塔 (basil) is a culinary herb with no dedicated leaf in this app's
  // taxonomy - grouped with the other herbs (薄荷/迷迭香/百里香...) under "other".
  "九層塔": "other",
  // --- Full-audit corrections (2026-07) -------------------------------
  // Added after cross-checking every CROP_CATEGORY_MAP entry against every
  // other category the same crop name (or an alias/variant of it) also
  // appears under. Groups of fixes below, in order:
  //  1. Fruit/veg items that were wrongly bucketed into "staple".
  //  2. "截切/分切/切片" (pre-cut) variants that had all been dumped into
  //     veg:leafwrap regardless of the vegetable's real category.
  //  3. Pumpkin/squash variety names scattered outside veg:flowerfruit.
  //  4. Dried herb/spice/flower/fruit/mushroom "products" scattered across
  //     the fresh crop's category (or "special"/"other") instead of
  //     "processed" - the same rule already used above for 茶葉/咖啡豆.
  //  5. Finished tea-product names (cultivar + 茶/茶包) that were sitting
  //     under "special" even though 紅茶/白茶/烏龍茶/... above already
  //     establish that finished tea products belong in "processed".
  "甜美人西瓜": "veg:flowerfruit",
  "黑美人西瓜": "veg:flowerfruit",
  "橙蜜香番茄": "veg:flowerfruit",
  "水晶芭樂": "fruit:berry",
  "香橙": "fruit:citrus",
  "桔子": "fruit:citrus",
  "黃香瓜": "veg:flowerfruit",
  "水果彩椒": "veg:flowerfruit",
  "南瓜塊": "veg:flowerfruit",
  "南瓜鬚": "veg:flowerfruit",
  "苦苣": "veg:leaf",
  "紅冠萵苣": "veg:leaf",
  "美麗紅菜苔": "veg:leaf",
  "水田芥": "veg:leaf",
  "紅皮馬鈴薯": "veg:root",
  "香蔥": "veg:leaf",
  "A菜心": "veg:leaf",
  "高麗菜嬰": "veg:leaf",
  "甘藍菜芽": "veg:leaf",
  "五鮮菇": "veg:fungisprout",
  "白雪耳": "veg:fungisprout",
  "黃玉米": "veg:flowerfruit",
  "黑糯玉米": "veg:flowerfruit",
  "油菜(青松菜": "veg:leaf",
  "茶樹": "special",
  "乾艾草": "processed",
  "艾草乾": "processed",
  "乾鼠尾草": "processed",
  "鼠尾草乾": "processed",
  "百里香乾": "processed",
  "檸檬馬鞭草乾": "processed",
  "乾燥檸檬馬鞭草": "processed",
  "接骨木乾": "processed",
  "乾金盞花": "processed",
  "果醬": "processed",
  "米脆": "processed",
  "玉米脆片": "processed",
  "米香": "processed",
  "太白粉": "processed",
  "黑麥粉": "processed",
  "低筋麵粉": "processed",
  "梅乾菜": "processed",
  "馬鈴薯乾": "processed",
  "豇豆乾": "processed",
  "長豆乾": "processed",
  "蕃茄乾": "processed",
  "小麥茶": "processed",
  "截切A菜": "veg:leaf",
  "截切千寶菜": "veg:leaf",
  "截切味美菜": "veg:leaf",
  "截切地瓜葉": "veg:leaf",
  "截切小松菜": "veg:leaf",
  "截切小白菜": "veg:leaf",
  "截切山茼蒿": "veg:leaf",
  "截切油江菜": "veg:leaf",
  "截切油菜": "veg:leaf",
  "截切白菜": "veg:leaf",
  "截切空心菜": "veg:leaf",
  "截切茼蒿": "veg:leaf",
  "截切莧菜": "veg:leaf",
  "截切菠菜": "veg:leaf",
  "截切萵苣": "veg:leaf",
  "截切葉菜甘藷": "veg:leaf",
  "截切蕹菜": "veg:leaf",
  "截切青松菜": "veg:leaf",
  "截切青江菜": "veg:leaf",
  "截切青油菜": "veg:leaf",
  "青莧菜": "veg:leaf",
  "莧菜(白莧菜": "veg:leaf",
  "莧菜(紅莧": "veg:leaf",
  "截切紅蘿蔔": "veg:root",
  "截切胡蘿蔔": "veg:root",
  "截切韭菜": "veg:root",
  "截切馬鈴薯": "veg:root",
  // 冬瓜/南瓜/大黃瓜/小黃瓜/扁蒲/花胡瓜 pre-cut variants used to be forced
  // here one by one; now merged into their base crop via CROP_ALIASES
  // above, so they never reach this lookup as separate names any more.
  "奶油南瓜": "veg:flowerfruit",
  "栗南瓜": "veg:flowerfruit",
  "車輪南瓜": "veg:flowerfruit",
  "魚腥草乾": "processed",
  "乾杭菊": "processed",
  "乾紫蘇": "processed",
  "乾魚腥草": "processed",
  "乾燥魚腥草": "processed",
  "甜菜根乾": "processed",
  "乾茴香": "processed",
  "乾薑": "processed",
  "薄荷乾": "processed",
  "香蜂草乾": "processed",
  "乾燥香蜂草": "processed",
  "乾薑黃": "processed",
  "乾迷迭香": "processed",
  "迷迭香乾": "processed",
  "乾燥杭菊葉": "processed",
  "乾山苦瓜": "processed",
  "奧勒岡乾": "processed",
  "乾香椿": "processed",
  "小油菊乾": "processed",
  "桂圓乾": "processed",
  "乾燥小油菊": "processed",
  "薑黃乾": "processed",
  "乾燥山苦瓜片": "processed",
  "菊花乾": "processed",
  "玫瑰乾": "processed",
  "番石榴乾": "processed",
  "乾蝶豆花": "processed",
  "乾燥蝶豆花": "processed",
  "乾檸檬香茅": "processed",
  "乾燥當歸": "processed",
  "竹筍乾": "processed",
  "乾燥薑黃": "processed",
  "乾燥仙草": "processed",
  "乾紅薑黃片": "processed",
  "乾薄荷": "processed",
  "乾燥玫瑰花": "processed",
  "乾燥桂花": "processed",
  "乾香茅": "processed",
  "乾辣椒": "processed",
  "乾洛神": "processed",
  "乾甜菊": "processed",
  "乾菊花": "processed",
  "乾月桂葉": "processed",
  "乾燥咖啡葉": "processed",
  "乾燥菊花": "processed",
  "乾燥野薑花": "processed",
  "乾金銀花": "processed",
  "奇異果乾": "processed",
  "黃金奇異果乾": "processed",
  "乾靈芝": "processed",
  "香菇乾": "processed",
  "乾黑木耳": "processed",
  "木耳乾": "processed",
  "椴木乾香菇": "processed",
  "靈芝乾": "processed",
  "乾燥木耳": "processed",
  "乾燥靈芝": "processed",
  "段木乾香菇": "processed",
  "段木木耳": "veg:fungisprout",
  "段木香菇": "veg:fungisprout",
  "椴木香菇": "veg:fungisprout",
  "GABA茶": "processed",
  "佳葉龍茶": "processed",
  "凍頂烏龍茶": "processed",
  "土肉桂茶": "processed",
  "極品包種茶": "processed",
  "極品綠茶": "processed",
  "清香烏龍茶": "processed",
  "玫瑰紅茶": "processed",
  "紅烏龍茶": "processed",
  "紅玉白茶": "processed",
  "紅茶茶包": "processed",
  "綠茶粉": "processed",
  "綠茶茶包": "processed",
  "老欉山茶": "processed",
  "金萱茶": "processed",
  "金萱綠茶": "processed",
  "阿薩姆紅茶": "processed",
  "黃茶": "processed",
  "咖啡葉茶": "processed",
  "高山烏龍茶": "processed",
  "高山紅茶": "processed",
  "茶粉": "processed",
  "蜜香紅茶包": "processed",
  "蜜香紅茶茶包": "processed",
  "瀞‧有機茶": "processed",
  "野放紅茶": "processed",
  "茶包": "processed",
  // --- 花菜／果菜／豆菜／瓜菜 (veg:flowerfruit) audit (2026-07) ---------
  // Items below were voting/baked into the wrong leaf; corrected by name
  // after auditing every entry in the flowerfruit bucket by hand.
  // 1. Genuine flower/fruit/bean/melon vegetables sitting under the wrong
  //    leaf (mostly veg:leaf) - moved in.
  "甜豆": "veg:flowerfruit",       // sugar snap pea pod, not a leafy green
  "蛇瓜": "veg:flowerfruit",       // snake gourd - a melon, not a leafy green
  "角椒": "veg:flowerfruit",       // a chili pepper variety
  "角瓜": "veg:flowerfruit",       // a ridged luffa/gourd variety
  "雞心辣椒": "veg:flowerfruit",   // a chili pepper variety
  "虎豆": "veg:flowerfruit",       // a pod-bean variety, like 皇帝豆
  "櫛瓜花": "veg:flowerfruit",     // zucchini blossom - an edible flower, like 金針花
  // 2. Non-vegetables that had drifted into veg:flowerfruit - moved out to
  //    their real category.
  "明尼桔柚": "fruit:citrus",      // Minneola tangelo - a citrus fruit
  "晶圓梨": "fruit:stonepome",     // a pear cultivar
  "印度棗": "fruit:stonepome",     // Indian jujube (ber) - same family as 棗
  "蜜棗": "fruit:stonepome",       // a jujube cultivar, same family as 棗
  "人心果": "fruit:berry",         // sapodilla - a soft tree fruit
  "夏威夷豆": "special",           // macadamia nut, alongside 核桃/腰果/杏仁
  "珠蔥": "veg:root",              // a bunching shallot, like 蔥/紅蔥頭
  "碧玉筍": "veg:root",            // the tender stem of the 金針 (daylily) plant, not its flower
  "牛膝": "other",                 // an herbal medicine root
  "甜羅勒": "other",               // basil - a culinary herb, like 九層塔
  "神香草": "other",               // hyssop - a culinary/medicinal herb
  "風茹草": "other",               // an herb
  "香草": "other",                 // herb (generic term)
  "龍眼花": "other",               // longan blossom, used for tea/honey, like other edible flowers
};

// Fallback for crops CROP_FORCED_LEAF doesn't exact-match because the source
// data appends a processing-state suffix to the species name (e.g. this
// dataset has raw ContainCrops entries like "小麥(乾燥)", "小麥(乾燥脫粒)",
// "薏苡(乾燥脫粒)", "黃豆(脫殼)" alongside plain "小麥"/"薏苡"/"黃豆" - same
// crop, different processing stage). Checked only when no exact match is
// found, so it never overrides a more specific CROP_FORCED_LEAF entry.
const FORCED_LEAF_PATTERNS = [
  [/^(小麥|蕎麥|薏苡|薏仁|大麥|燕麥|高粱|高梁|黃豆|大豆)[(（]/, "staple"],
];

function patternForcedLeaf(crop) {
  for (const [pattern, leaf] of FORCED_LEAF_PATTERNS) {
    if (pattern.test(crop)) return leaf;
  }
  return null;
}

// Data-driven crop -> leaf-category mapping, generated once from a live
// snapshot of the MOA dataset by tallying (per buildCropIndex below) which
// leaf category each crop's growers actually belong to. Baked in as a
// static table instead of recomputed on every fetch: a crop's real-world
// category does not change from one data refresh to the next, so there is
// no reason to keep re-voting on it - this also makes the tiles immune to
// any future data glitch skewing the vote. Manual corrections
// (CROP_FORCED_LEAF above) always take priority over this table. Regenerate
// by running scripts/generate-crop-category-map.js against a fresh snapshot
// if the dataset's crop vocabulary changes substantially.
//
// Entries are grouped by leaf category with a "// <leaf> (<count>)" header -
// keep it that way. When correcting a crop's category, MOVE the line into
// its new section (and update both counts) rather than just changing the
// value in place; a correct value sitting under the wrong header is exactly
// the kind of drift a full audit had to clean up once already.
const CROP_CATEGORY_MAP = {
  // rice (11)
  "稻穀": "rice",
  "稻穀之碾製品": "rice",
  "水稻": "rice",
  "水稻及其碾製品": "rice",
  "乾穀": "rice",
  "碾製米": "rice",
  "米麵條": "rice",
  "紅糯糙米": "rice",
  "紅糯米": "rice",
  "糯米": "rice",
  "紫米": "rice", // a rice variety, like 紅糯米/糯米
  // staple (49)
  "甘藷": "staple",
  "花生": "staple",
  "紅藜": "staple",
  "紅豆": "staple",
  "小米": "staple",
  "樹豆": "staple",
  "芝麻": "staple",
  "硬質玉米": "staple",
  "地瓜": "staple",
  "白薏仁": "staple",
  "葵花子": "staple",
  "黑芝麻": "staple",
  "高梁": "staple",
  "栗子地瓜": "staple",
  "種子": "staple",
  "雞豆": "staple",
  "斑豆": "staple",
  "藜麥": "staple",
  "赤小豆": "staple",
  "白豆": "staple",
  "金時地瓜": "staple",
  "黑小麥": "staple",
  "野米": "staple",
  "青皮豆": "staple",
  "栗米": "staple",
  "番薯": "staple",
  "紫心地瓜": "staple",
  "白芝麻": "staple",
  "珍珠豆": "staple",
  "黑麥": "staple",
  "粟米": "staple",
  "截切地瓜": "staple",
  "米豆": "staple",
  "珍珠大麥": "staple",
  "乾燥紅藜": "staple",
  "落花生": "staple",
  "黃仁黑豆": "staple",
  "棕色亞麻子": "staple",
  "脫殼紅藜": "staple",
  "花生仁": "staple",
  "白鳳豆": "staple",
  "乾燥黃豆": "staple",
  "甜高粱": "staple",
  "黃肉地瓜": "staple",
  "紅肉地瓜": "staple",
  "乾紅藜": "staple",
  "黃地瓜": "staple",
  "紅地瓜": "staple",
  "關刀豆": "stable",
  "花豆": "staple", // a bean/legume, like other 雜糧 beans
  // special (46)
  "薄荷": "special",
  "咖啡鮮果": "special",
  "茶菁": "special",
  "澳洲茶樹": "special",
  "咖啡生豆": "special",
  "狼尾草": "other",   // forage grass, not a specialty crop
  "牧草": "other",     // pasture/forage grass, not a specialty crop
  "核桃": "special",
  "腰果": "special",
  "青割玉米": "other", // silage/forage corn, not a specialty crop
  "栗子": "special",
  "咖啡生豆(經脫皮": "special",
  "製糖甘蔗": "special",
  "茶花": "special",
  "盤固草": "other",   // forage grass, not a specialty crop
  "咖啡葉": "special",
  "濾掛式咖啡": "special",
  "葵瓜子": "special",
  "胡椒": "special",
  "胡桃": "special",
  "鐵觀音": "special",
  "紅玉": "special",
  "板栗": "special",
  "紅烏龍": "special",
  "葵瓜子仁": "special",
  "咖啡生豆[經脫皮": "special",
  "桑樹": "special",
  "香草植物": "special",
  "烘焙咖啡豆": "special",
  "牛膝草": "special",
  "青荷": "special",
  "東方美人": "special",
  "白毫烏龍": "special",
  "杏核": "special",
  "尼羅草": "other",   // forage grass, not a specialty crop
  "燕麥草": "other",   // forage grass, not a specialty crop
  "酸漿果": "special",
  "綠薄荷": "special",
  "胡椒薄荷": "special",
  "芡實": "special",
  "澳洲胡桃": "special",      // macadamia nut, alongside 核桃/腰果/杏仁/夏威夷豆
  "可可果": "special",        // cacao pod, alongside 茶/咖啡 as a beverage/special crop
  "松子": "special", // pine nut - a tree nut, consistent with 核桃/腰果/榛果
  "南瓜子": "special", // pumpkin seed - a seed/nut, alongside 葵瓜子
  "棉花": "special", // cotton - a non-food fiber crop ("非供食用之作物")
  "苧麻": "special", // ramie - a non-food fiber crop ("非供食用之作物")
  // veg:leafwrap (35)
  "甘藍": "veg:leafwrap",
  "結球萵苣": "veg:leafwrap",
  "半結球萵苣": "veg:leafwrap",
  "包心芥菜": "veg:leafwrap",
  "山東大白菜": "veg:leafwrap",
  "半結球白菜": "veg:leafwrap",
  "大白菜": "veg:leafwrap",
  "翡翠娃娃菜": "veg:leafwrap",
  "紫甘藍": "veg:leafwrap",
  "結球菜": "veg:leafwrap",
  "雪翠高麗菜": "veg:leafwrap",
  "黃金白菜": "veg:leafwrap",
  "天津白菜": "veg:leafwrap",
  "抱子甘藍": "veg:leafwrap",
  "蘿蔓心": "veg:leafwrap",
  "山東白菜": "veg:leafwrap",
  "翠玉白菜": "veg:leafwrap",
  "抱子芥菜": "veg:leafwrap",
  "翠玉娃娃白菜": "veg:leafwrap",
  "葉菜甘藷": "veg:leafwrap",
  "高山高麗菜": "veg:leafwrap",
  "包心萵苣": "veg:leafwrap",
  "截切包心白菜": "veg:leafwrap",
  "鋸齒白菜": "veg:leafwrap",
  "甘藍(高麗菜": "veg:leafwrap",
  "黃金包心白菜": "veg:leafwrap",
  "半結球萵苣(福山萵苣": "veg:leafwrap",
  "甘藍分切": "veg:leafwrap",
  "波士頓奶油萵苣": "veg:leafwrap",
  "千寶白菜": "veg:leafwrap",
  "味美白菜": "veg:leafwrap",
  "半結球萵苣(蘿蔓": "veg:leafwrap",
  "包心芥菜(大芥菜": "veg:leafwrap",
  "截切高麗菜": "veg:leafwrap",
  "優愛白菜": "veg:leafwrap",
  // veg:leaf (281)
  "瑞士甜菜": "veg:leaf",
  "山葵葉": "veg:leaf",
  "茼萵": "veg:leaf",
  "青龍油菜": "veg:leaf",
  "青江白菜": "veg:leaf",
  "雪裡紅": "veg:leaf",
  "黑芥藍菜": "veg:leaf",
  "菾菜(含莙蓬菜": "veg:leaf",
  "中國A菜": "veg:leaf",
  "葉用黃麻": "veg:leaf",
  "芥蘭": "veg:leaf",
  "綠寶石": "veg:leaf",
  "紅翠A菜": "veg:leaf",
  "錦絲菜": "veg:leaf",
  "綠寶石A菜": "veg:leaf",
  "甜菜葉": "veg:leaf",
  "羽衣芥藍": "veg:leaf",
  "秀珍菜": "veg:leaf",
  "莙薘菜": "veg:leaf",
  "日本水菜": "veg:leaf",
  "甜麻": "veg:leaf",
  "韓國芝麻葉": "veg:leaf",
  "金寶菜": "veg:leaf",
  "塔姑菜": "veg:leaf",
  "本島A菜": "veg:leaf",
  "奶油A菜": "veg:leaf",
  "半包A菜": "veg:leaf",
  "皺葉A菜": "veg:leaf",
  "大阪青松菜": "veg:leaf",
  "木耳菜": "veg:leaf",
  "綠珍菜": "veg:leaf",
  "橡木萵苣": "veg:leaf",
  "萵苣菜": "veg:leaf",
  "彩色菾菜": "veg:leaf",
  "綠火焰萵苣": "veg:leaf",
  "菠菱菜": "veg:leaf",
  "杏菜": "veg:leaf",
  "日本山菠菜": "veg:leaf",
  "紅芥菜": "veg:leaf",
  "油菜(小松菜": "veg:leaf",
  "青茄茉菜": "veg:leaf",
  "過貓": "veg:leaf",
  "山甜菜": "veg:leaf",
  "茄茉菜": "veg:leaf",
  "大芥菜": "veg:leaf",
  "格蘭菜": "veg:leaf",
  "甜萵苣": "veg:leaf",
  "長年菜": "veg:leaf",
  "扁葉芥菜": "veg:leaf",
  "皺葉萵苣": "veg:leaf",
  "廣島野菜": "veg:leaf",
  "刈菜": "veg:leaf",
  "牛皮菜": "veg:leaf",
  "紅橡萵苣": "veg:leaf",
  "美松菜": "veg:leaf",
  "萵苣": "veg:leaf",
  "葉菜甘藷": "veg:leaf",
  "菠菜": "veg:leaf",
  "白菜": "veg:leaf",
  "蕹菜": "veg:leaf",
  "茼蒿": "veg:leaf",
  "莧菜": "veg:leaf",
  "油菜": "veg:leaf",
  "青江菜": "veg:leaf",
  "芹菜": "veg:leaf",
  "紅鳳菜": "veg:leaf",
  "芫荽": "veg:leaf",
  "洛葵": "veg:leaf",
  "龍鬚菜": "veg:leaf",
  "菾菜": "veg:leaf",
  "菊苣": "veg:leaf",
  "青松菜": "veg:leaf",
  "紫蘇": "veg:leaf",
  "小松菜": "veg:leaf",
  "芝麻菜": "veg:leaf",
  "芥菜": "veg:leaf",
  "白鳳菜": "veg:leaf",
  "山茼蒿": "veg:leaf",
  "山芹菜": "veg:leaf",
  "韭菜花": "veg:leaf",
  "羽衣甘藍": "veg:leaf",
  "味美菜": "veg:leaf",
  "黑葉白菜": "veg:leaf",
  "馬齒莧": "veg:leaf",
  "青油菜": "veg:leaf",
  "過溝菜蕨": "veg:leaf",
  "小白菜": "veg:leaf",
  "塔菇菜": "veg:leaf",
  "山菠菜": "veg:leaf",
  "奶油白菜": "veg:leaf",
  "荷葉白菜": "veg:leaf",
  "廣島菜": "veg:leaf",
  "小芥菜": "veg:leaf",
  "千寶菜": "veg:leaf",
  "甜菜心": "veg:leaf",
  "福山萵苣": "veg:leaf",
  "京都水菜": "veg:leaf",
  "空心菜": "veg:leaf",
  "羅勒": "veg:leaf",
  "山蘇": "veg:leaf",
  "A菜": "veg:leaf",
  "龍葵": "veg:leaf",
  "茴香": "veg:leaf",
  "皇宮菜": "veg:leaf",
  "地瓜葉": "veg:leaf",
  "蘿蔓萵苣": "veg:leaf",
  "蘿蔓": "veg:leaf",
  "蚵仔白菜": "veg:leaf",
  "川七": "veg:leaf",
  "赤道櫻草": "veg:leaf",
  "紅莧菜": "veg:leaf",
  "優愛菜": "veg:leaf",
  "青梗白菜": "veg:leaf",
  "油江菜": "veg:leaf",
  "皺葉白菜": "veg:leaf",
  "塌棵菜": "veg:leaf",
  "葉用芥菜": "veg:leaf",
  "青泉菜": "veg:leaf",
  "蚵白菜": "veg:leaf",
  "白莧菜": "veg:leaf",
  "野澤菜": "veg:leaf",
  "白松菜": "veg:leaf",
  "雪菜": "veg:leaf",
  "葉用甘藷": "veg:leaf",
  "香菜": "veg:leaf",
  "京水菜": "veg:leaf",
  "大陸妹": "veg:leaf",
  "角菜": "veg:leaf",
  "綠莧菜": "veg:leaf",
  "芝麻葉": "veg:leaf",
  "蘿蔓A菜": "veg:leaf",
  "福山A菜": "veg:leaf",
  "春菊": "veg:leaf",
  "高脚白菜": "veg:leaf",
  "芥菜(含廣島菜": "veg:leaf",
  "廣東A菜": "veg:leaf",
  "日本茼蒿": "veg:leaf",
  "娃娃菜": "veg:leaf",
  "甜菠菜": "veg:leaf",
  "白菜(含千寶菜": "veg:leaf",
  "枸杞葉": "veg:leaf",
  "高腳白菜": "veg:leaf",
  "西洋菜": "veg:leaf",
  "綠寶石萵苣": "veg:leaf",
  "野莧": "veg:leaf",
  "葉萵苣": "veg:leaf",
  "山葵菜": "veg:leaf",
  "廣島白菜": "veg:leaf",
  "甜豌豆": "veg:leaf",
  "水菜": "veg:leaf",
  "油麥菜": "veg:leaf",
  "芥藍花": "veg:leaf",
  "短期葉菜類": "veg:leaf",
  "大陸A菜": "veg:leaf",
  "奶油萵苣": "veg:leaf",
  "本島萵苣": "veg:leaf",
  "蘿美心": "veg:leaf",
  "萵苣(含紅葉萵苣": "veg:leaf",
  "番杏": "veg:leaf",
  "甜菜": "veg:leaf",
  "綠莧": "veg:leaf",
  "鹿角萵苣": "veg:leaf",
  "檸檬香蜂草": "veg:leaf",
  "蜜雪兒白菜": "veg:leaf",
  "鵝白菜": "veg:leaf",
  "白杏菜": "veg:leaf",
  "馬郁蘭": "veg:leaf",
  "酸模": "veg:leaf",
  "巴西利": "veg:leaf",
  "薺菜": "veg:leaf",
  "高腳奶油白菜": "veg:leaf",
  "珍珠菜": "veg:leaf",
  "波士頓萵苣": "veg:leaf",
  "甜蘿蔓": "veg:leaf",
  "食用玉米筍": "veg:leaf",
  "芥末菜": "veg:leaf",
  "油菜(含小松菜": "veg:leaf",
  "紅捲萵苣": "veg:leaf",
  "土人參": "veg:leaf",
  "琉璃苣": "veg:leaf",
  "油菜花": "veg:leaf",
  "圓葉萵苣": "veg:leaf",
  "白莧": "veg:leaf",
  "全範圍": "veg:leaf",
  "刺芫荽": "veg:leaf",
  "牛奶白菜": "veg:leaf",
  "檸檬葉": "veg:leaf",
  "東京白菜": "veg:leaf",
  "蘿蔔葉": "veg:leaf",
  "忍冬": "veg:leaf",
  "月桂葉": "veg:leaf",
  "紅莧": "veg:leaf",
  "綠捲萵苣": "veg:leaf",
  "白花菜": "veg:leaf",
  "葉用枸杞": "veg:leaf",
  "龍骨瓣莕菜": "veg:leaf",
  "豆瓣菜": "veg:leaf",
  "綠寶萵苣": "veg:leaf",
  "尖葉萵苣": "veg:leaf",
  "莧菜(紅莧菜": "veg:leaf",
  "蕨菜": "veg:leaf",
  "酸漿": "veg:leaf",
  "甜蘿勒": "veg:leaf",
  "紅葉萵苣": "veg:leaf",
  "活力菜": "veg:leaf",
  "落葵": "veg:leaf",
  "火焰萵苣": "veg:leaf",
  "美味菜": "veg:leaf",
  "洋洛葵": "veg:leaf",
  "塔棵菜": "veg:leaf",
  "打拋葉": "veg:leaf",
  "食茱萸": "veg:leaf",
  "牧草筍": "veg:leaf",
  "白菜(小白菜": "veg:leaf",
  "白菜(千寶菜": "veg:leaf",
  "萵苣(紅葉萵苣": "veg:leaf",
  "過貓蕨": "veg:leaf",
  "咖哩葉": "veg:leaf",
  "木虌果": "veg:leaf",
  "香芹": "veg:leaf",
  "澎湖絲瓜": "veg:leaf",
  "葉用豌豆": "veg:leaf",
  "鳳京白菜": "veg:leaf",
  "日本菠菜": "veg:leaf",
  "白菜(黑葉白菜": "veg:leaf",
  "黃金莓": "veg:leaf",
  "水蓮": "veg:leaf",
  "水芹菜": "veg:leaf",
  "向日葵": "veg:leaf",
  "甜薰衣草": "veg:leaf",
  "水芹": "veg:leaf",
  "白鶴靈芝草": "veg:leaf",
  "牛蕃茄": "veg:leaf",
  "昭和菜": "veg:leaf",
  "甜肉桂": "veg:leaf",
  "通天草": "veg:leaf",
  "萵苣(A菜": "veg:leaf",
  "廣島芥菜": "veg:leaf",
  "埃及國王菜": "veg:leaf",
  "蝦夷蔥": "veg:leaf",
  "紅松菜": "veg:leaf",
  "綠蘿蔓": "veg:leaf",
  "沙拉白菜": "veg:leaf",
  "枸杞菜": "veg:leaf",
  "食用玫瑰": "veg:leaf",
  "小金英": "veg:leaf",
  "小茴香": "veg:leaf",
  "檸檬草": "veg:leaf",
  "翠白菜": "veg:leaf",
  "蘿勒": "veg:leaf",
  "鄒葉白菜": "veg:leaf",
  "荷白菜": "veg:leaf",
  "甘藍菜嬰": "veg:leaf",
  "甜萬壽菊": "veg:leaf",
  "甜白菜": "veg:leaf",
  "九尾草": "veg:leaf",
  "金盞草": "veg:leaf",
  "沙巴蛇草": "veg:leaf",
  "蘿美心萵苣": "veg:leaf",
  "東京娃娃菜": "veg:leaf",
  "人蔘菜": "veg:leaf",
  "瑞士菠菜": "veg:leaf",
  "尼龍白菜": "veg:leaf",
  "紫蘇葉": "veg:leaf",
  "莧菜(含白莧": "veg:leaf",
  "巴蔘菜": "veg:leaf",
  "樹莓": "veg:leaf",
  "蘿美生菜": "veg:leaf",
  "藤三七": "veg:leaf",
  "山茼萵": "veg:leaf",
  "水蕹菜": "veg:leaf",
  "甜心菜": "veg:leaf",
  "綠羽芥末菜": "veg:leaf",
  "齒薰衣草": "veg:leaf",
  "萵苣(含鹿角萵苣": "veg:leaf",
  "火焰菜": "veg:leaf",
  "菜心": "veg:leaf",
  "綠紫蘇": "veg:leaf",
  "檸檬羅勒": "veg:leaf",
  "紅地瓜葉": "veg:leaf", // sweet potato leaves, a common leafy vegetable
  "貝比生菜": "veg:leaf", // baby leaf greens mix
  // veg:root (85)
  "青蔥": "veg:root",
  "紅蔥頭": "veg:root",
  "西洋芹": "veg:root",
  "大頭菜": "veg:root",
  "細香蔥": "veg:root",
  "粉薯": "veg:root",
  "嫩薑": "veg:root",
  "黃洋蔥": "veg:root",
  "分蔥": "veg:root",
  "粉薑": "veg:root",
  "西芹": "veg:root",
  "球莖茴香": "veg:root",
  "紅洋蔥": "veg:root",
  "大蔥": "veg:root",
  "四季蔥": "veg:root",
  "韭黃": "veg:root",
  "球莖甘藍(結球菜": "veg:root",
  "菊薯": "veg:root",
  "蕪菁": "veg:root",
  "莖用芥菜": "veg:root",
  "芥藍菜筍": "veg:root",
  "芋頭梗": "veg:root",
  "草石蠶": "veg:root",
  "白蘆筍": "veg:root",
  "檳榔心芋": "veg:root",
  "韭蔥": "veg:root",
  "蒜頭粒": "veg:root",
  "高麗菜筍": "veg:root",
  "粉蔥": "veg:root",
  "彩色蘿蔔": "veg:root",
  "白玉蘿蔔": "veg:root",
  "人蔘山藥": "veg:root",
  "日本山藥": "veg:root",
  "甜茴香": "veg:root",
  "蘿蔔": "veg:root",
  "竹筍": "veg:root",
  "胡蘿蔔": "veg:root",
  "芋頭": "veg:root",
  "薑": "veg:root",
  "甜菜根": "veg:root",
  "馬鈴薯": "veg:root",
  "球莖甘藍": "veg:root",
  "山藥": "veg:root",
  "洋蔥": "veg:root",
  "蘆筍": "veg:root",
  "蒜頭": "veg:root",
  "大心芥菜": "veg:root",
  "嫩莖萵苣": "veg:root",
  "筊白筍": "veg:root",
  "櫻桃蘿蔔": "veg:root",
  "牛蒡": "veg:root",
  "蓮藕": "veg:root",
  "桂竹筍": "veg:root",
  "樹薯": "veg:root",
  "豆薯": "veg:root",
  "蕗蕎": "veg:root",
  "麻竹筍": "veg:root",
  "菱角": "veg:root",
  "結頭菜": "veg:root",
  "葛鬱金": "veg:root",
  "綠竹筍": "veg:root",
  "茭白筍": "veg:root",
  "甜龍筍": "veg:root",
  "荸薺": "veg:root",
  "竹薑": "veg:root",
  "箭筍": "veg:root",
  "老薑": "veg:root",
  "山葵": "veg:root",
  "紫蘆筍": "veg:root",
  "綠蘆筍": "veg:root",
  "黃金馬鈴薯": "veg:root",
  "美人蕉": "veg:root",
  "桂竹": "veg:root",
  "葛根": "veg:root",
  "黃薑黃": "veg:root",
  "白茅": "veg:root",
  "筍": "veg:root",
  "箭竹筍": "veg:root",
  "孟宗竹筍": "veg:root",
  "鮮切有機山藥": "veg:root",
  "截切山藥": "veg:root",
  "石篙竹筍": "veg:root",
  "蘆筍花": "veg:root",
  "菊芋": "veg:root", // Jerusalem artichoke - a root vegetable
  "紫山藥": "veg:root", // purple yam - a root vegetable
  // veg:flowerfruit (127)
  "黑柿番茄": "veg:flowerfruit",
  "鮮切有機南瓜": "veg:flowerfruit",
  "甜丁": "veg:flowerfruit",
  "青花椰": "veg:flowerfruit",
  "白玉苦瓜": "veg:flowerfruit",
  "大莢豌豆": "veg:flowerfruit",
  "鵲豆": "veg:flowerfruit",
  "紫花椰": "veg:flowerfruit",
  "冬瓜分切": "veg:flowerfruit",
  "蛋茄": "veg:flowerfruit",
  "黑柿蕃茄": "veg:flowerfruit",
  "截切冬瓜": "veg:flowerfruit",
  "長辣椒": "veg:flowerfruit",
  "小西瓜": "veg:flowerfruit",
  "白玉米": "veg:flowerfruit",
  "截切南瓜": "veg:flowerfruit",
  "辣椒(青龍椒": "veg:flowerfruit",
  "小辣椒": "veg:flowerfruit",
  "大辣椒": "veg:flowerfruit",
  "黑寶玉米": "veg:flowerfruit",
  "玉女小蕃茄": "veg:flowerfruit",
  "紅小辣椒": "veg:flowerfruit",
  "圓茄": "veg:flowerfruit",
  "紫玉米": "veg:flowerfruit",
  "角豆": "veg:flowerfruit",
  "小蕃茄": "veg:flowerfruit",
  "大番茄": "veg:flowerfruit",
  "南瓜分切": "veg:flowerfruit",
  "紅鬚帶殼玉米筍": "veg:flowerfruit",
  "糯米玉米": "veg:flowerfruit",
  "蠶豆": "veg:flowerfruit",
  "牛奶玉米": "veg:flowerfruit",
  "短茄": "veg:flowerfruit",
  "水果絲瓜": "veg:flowerfruit",
  "截切大黃瓜": "veg:flowerfruit",
  "截切花胡瓜": "veg:flowerfruit",
  "截切小黃瓜": "veg:flowerfruit",
  "截切扁蒲": "veg:flowerfruit",
  "青花菜筍": "veg:flowerfruit",
  "格蘭菜花": "veg:flowerfruit",
  "碗豆": "veg:flowerfruit",
  "紫花椰菜": "veg:flowerfruit",
  "青花椰菜": "veg:flowerfruit",
  "黃花芥藍": "veg:flowerfruit",
  "香瓜茄": "veg:flowerfruit",
  "甜油菜心": "veg:flowerfruit",
  "糯米辣椒": "veg:flowerfruit",
  "南瓜": "veg:flowerfruit",
  "番茄": "veg:flowerfruit",
  "絲瓜": "veg:flowerfruit",
  "茄子": "veg:flowerfruit",
  "辣椒": "veg:flowerfruit",
  "花胡瓜": "veg:flowerfruit",
  "苦瓜": "veg:flowerfruit",
  "甜椒": "veg:flowerfruit",
  "食用玉米": "veg:flowerfruit",
  "花椰菜": "veg:flowerfruit",
  "青花菜": "veg:flowerfruit",
  "冬瓜": "veg:flowerfruit",
  "敏豆": "veg:flowerfruit",
  "胡瓜": "veg:flowerfruit",
  "扁蒲": "veg:flowerfruit",
  "黃秋葵": "veg:flowerfruit",
  "豇豆": "veg:flowerfruit",
  "玉米": "veg:flowerfruit",
  "豌豆": "veg:flowerfruit",
  "粉豆": "veg:flowerfruit",
  "玉米筍": "veg:flowerfruit",
  "香瓜": "veg:flowerfruit",
  "西瓜": "veg:flowerfruit",
  "秋葵": "veg:flowerfruit",
  "萊豆": "veg:flowerfruit",
  "洋香瓜": "veg:flowerfruit",
  "毛豆": "veg:flowerfruit",
  "櫛瓜": "veg:flowerfruit",
  "隼人瓜": "veg:flowerfruit",
  "青花筍": "veg:flowerfruit",
  "哈密瓜": "veg:flowerfruit",
  "金針": "veg:flowerfruit",
  "肉豆": "veg:flowerfruit",
  "青椒": "veg:flowerfruit",
  "小黃瓜": "veg:flowerfruit",
  "翼豆": "veg:flowerfruit",
  "糯米椒": "veg:flowerfruit",
  "美濃瓜": "veg:flowerfruit",
  "菰瓜": "veg:flowerfruit",
  "四季豆": "veg:flowerfruit",
  "夏南瓜": "veg:flowerfruit",
  "甜玉米": "veg:flowerfruit",
  "大黃瓜": "veg:flowerfruit",
  "山苦瓜": "veg:flowerfruit",
  "菜豆": "veg:flowerfruit",
  "越瓜": "veg:flowerfruit",
  "牛番茄": "veg:flowerfruit",
  "青龍椒": "veg:flowerfruit",
  "佛手瓜": "veg:flowerfruit",
  "扁豆": "veg:flowerfruit",
  "瓠瓜": "veg:flowerfruit",
  "醜豆": "veg:flowerfruit",
  "朝天椒": "veg:flowerfruit",
  "皇帝豆": "veg:flowerfruit",
  "小番茄": "veg:flowerfruit",
  "長豆": "veg:flowerfruit",
  "彩椒": "veg:flowerfruit",
  "栗子南瓜": "veg:flowerfruit",
  "水果玉米": "veg:flowerfruit",
  "玉女小番茄": "veg:flowerfruit",
  "羊角椒": "veg:flowerfruit",
  "荷蘭豆": "veg:flowerfruit",
  "蒲瓜": "veg:flowerfruit",
  "刀豆": "veg:flowerfruit",
  "甜瓜": "veg:flowerfruit",
  "紅秋葵": "veg:flowerfruit",
  "蘋果絲瓜": "veg:flowerfruit",
  "木鱉子": "veg:flowerfruit",
  "桃太郎番茄": "veg:flowerfruit",
  "紅鬚玉米筍": "veg:flowerfruit",
  "長豇豆": "veg:flowerfruit",
  "金針花": "veg:flowerfruit",
  "水果小黃瓜": "veg:flowerfruit",
  "玉女番茄": "veg:flowerfruit",
  "東昇南瓜": "veg:flowerfruit",
  "玉米鬚": "veg:flowerfruit",
  "阿成南瓜": "veg:flowerfruit",
  "其他：玉米筍": "veg:flowerfruit",
  "青苦瓜": "veg:flowerfruit",
  "哈蜜瓜": "veg:flowerfruit",
  // veg:fungisprout (82)
  "甘藍菜苗": "veg:fungisprout",
  "豌豆苗": "veg:fungisprout",
  "芥藍芽": "veg:fungisprout",
  "蕎麥苗": "veg:fungisprout",
  "葵花苗": "veg:fungisprout",
  "甘藍嬰": "veg:fungisprout",
  "芥藍芽菜": "veg:fungisprout",
  "芽菜": "veg:fungisprout",
  "紅高麗苗": "veg:fungisprout",
  "蘿蔔苗": "veg:fungisprout",
  "紫高麗菜苗": "veg:fungisprout",
  "球甘藍苗": "veg:fungisprout",
  "甜菜根苗": "veg:fungisprout",
  "紫高麗菜芽": "veg:fungisprout",
  "芥藍菜芽": "veg:fungisprout",
  "香菇": "veg:fungisprout",
  "木耳": "veg:fungisprout",
  "杏鮑菇": "veg:fungisprout",
  "綠豆芽": "veg:fungisprout",
  "金針菇": "veg:fungisprout",
  "秀珍菇": "veg:fungisprout",
  "黃豆芽": "veg:fungisprout",
  "黑木耳": "veg:fungisprout",
  "白精靈菇": "veg:fungisprout",
  "猴頭菇": "veg:fungisprout",
  "黑豆芽": "veg:fungisprout",
  "鮑魚菇": "veg:fungisprout",
  "珊瑚菇": "veg:fungisprout",
  "鴻喜菇": "veg:fungisprout",
  "柳松菇": "veg:fungisprout",
  "洋菇": "veg:fungisprout",
  "靈芝": "veg:fungisprout",
  "銀耳": "veg:fungisprout",
  "苜蓿芽": "veg:fungisprout",
  "雪白菇": "veg:fungisprout",
  "草菇": "veg:fungisprout",
  "蘿蔔嬰": "veg:fungisprout",
  "白木耳": "veg:fungisprout",
  "蠔菇": "veg:fungisprout",
  "黑美人菇": "veg:fungisprout",
  "美白菇": "veg:fungisprout",
  "黑蠔菇": "veg:fungisprout",
  "鴻禧菇": "veg:fungisprout",
  "巴西蘑菇": "veg:fungisprout",
  "金滑菇": "veg:fungisprout",
  "雪菇": "veg:fungisprout",
  "酒杯菇": "veg:fungisprout",
  "青花苗": "veg:fungisprout",
  "姬松茸": "veg:fungisprout",
  "藍寶石菇": "veg:fungisprout",
  "白雪菇": "veg:fungisprout",
  "鮮香菇": "veg:fungisprout",
  "發芽黃豆": "veg:fungisprout",
  "蕎麥芽": "veg:fungisprout",
  "青花菜芽": "veg:fungisprout",
  "川耳": "veg:fungisprout",
  "發芽黑豆": "veg:fungisprout",
  "白玉珍菇": "veg:fungisprout",
  "扁豆芽": "veg:fungisprout",
  "豌豆芽": "veg:fungisprout",
  "白舞菇": "veg:fungisprout",
  "花生芽": "veg:fungisprout",
  "黃金菇": "veg:fungisprout",
  "白玉菇": "veg:fungisprout",
  "玫瑰菇": "veg:fungisprout",
  "山茶茸": "veg:fungisprout",
  "百靈菇": "veg:fungisprout",
  "小麥芽": "veg:fungisprout",
  "杏香菇": "veg:fungisprout",
  "黃豆胚芽": "veg:fungisprout",
  "黑豆胚芽": "veg:fungisprout",
  "豌豆嬰": "veg:fungisprout",
  "紫高麗苗": "veg:fungisprout",
  "粉紅菇": "veg:fungisprout",
  "青花椰苗": "veg:fungisprout",
  "鹿角靈芝": "veg:fungisprout",
  "紅扁豆芽": "veg:fungisprout",
  "青花菜苗": "veg:fungisprout",
  "黑珍珠菇": "veg:fungisprout",
  "雪耳": "veg:fungisprout",
  "韓小菇": "veg:fungisprout",
  // fruit:berry (45)
  "覆盆子": "fruit:berry",
  "香蕉": "fruit:berry",
  "木瓜": "fruit:berry",
  "百香果": "fruit:berry",
  "酪梨": "fruit:berry",
  "草莓": "fruit:berry",
  "鳳梨": "fruit:berry",
  "無花果": "fruit:berry",
  "黃金果": "fruit:berry",
  "蓮霧": "fruit:berry",
  "芭蕉": "fruit:berry",
  "桑椹": "fruit:berry",
  "楊桃": "fruit:berry",
  "葡萄": "fruit:berry",
  "波羅蜜": "fruit:berry",
  "番石榴": "fruit:berry",
  "嘉寶果": "fruit:berry",
  "奇異果": "fruit:berry",
  "火龍果": "fruit:berry",
  "藍莓": "fruit:berry",
  "榴槤蜜": "fruit:berry",
  "星蘋果": "fruit:berry",
  "牛奶果": "fruit:berry",
  "紅毛丹": "fruit:berry",
  "石榴": "fruit:berry",
  "番荔枝": "fruit:berry",
  "榴槤": "fruit:berry",
  "芭樂芯": "fruit:berry",
  "山竹": "fruit:berry",
  "沙梨橄欖": "fruit:berry",
  "青木瓜": "fruit:berry",
  "金鑽鳳梨": "fruit:berry",
  "山刺番荔枝": "fruit:berry",
  "鳳梨釋迦": "fruit:berry",
  "紅心芭樂": "fruit:berry",
  "紅肉火龍果": "fruit:berry",
  "旦蕉": "fruit:berry",
  "龍貢": "fruit:berry",
  "香瓜梨": "fruit:berry",
  "巴西櫻桃": "fruit:berry",
  "紅石榴": "fruit:berry",
  "蒲桃": "fruit:berry",
  "黃金山竹": "fruit:berry",
  "綠奇異果": "fruit:berry",
  "黑莓": "fruit:berry",
  "西印度櫻桃": "fruit:berry",
  // fruit:citrus (49)
  "馬蜂橙": "fruit:citrus",   // kaffir lime (Citrus hystrix) - a citrus species
  "甜桔": "fruit:citrus",     // a sweet tangerine, like 桶柑/椪柑
  "甜橙": "fruit:citrus",     // a sweet orange, like 柳丁/臍橙
  "紅肉柳丁": "fruit:citrus", // blood-orange variant of 柳丁
  "佛利檬": "fruit:citrus",   // same family as 佛利蒙柑, a mandarin cultivar
  "晚崙西亞": "fruit:citrus", // Valencia orange, same as 晚崙西亞橙
  "海梨": "fruit:citrus",     // an orange/mandarin cultivar, same family as 海梨柑
  "海梨柑": "fruit:citrus",   // a mandarin cultivar
  "橘子": "fruit:citrus",     // mandarin orange
  "酸桔": "fruit:citrus",     // a sour tangerine
  "檸檬": "fruit:citrus",
  "柚子": "fruit:citrus",
  "柳橙": "fruit:citrus",
  "金桔": "fruit:citrus",
  "萊姆": "fruit:citrus",
  "葡萄柚": "fruit:citrus",
  "金棗": "fruit:citrus",
  "柳丁": "fruit:citrus",
  "砂糖橘": "fruit:citrus",
  "桶柑": "fruit:citrus",
  "文旦": "fruit:citrus",
  "帝王柑": "fruit:citrus",
  "文旦柚": "fruit:citrus",
  "茂谷柑": "fruit:citrus",
  "香檬": "fruit:citrus",
  "砂糖桔": "fruit:citrus",
  "椪柑": "fruit:citrus",
  "扁實檸檬": "fruit:citrus",
  "西施柚": "fruit:citrus",
  "珍珠柑": "fruit:citrus",
  "白柚": "fruit:citrus",
  "柑橘": "fruit:citrus",
  "臍橙": "fruit:citrus",
  "四季柑": "fruit:citrus",
  "大白柚": "fruit:citrus",
  "無籽檸檬": "fruit:citrus",
  "香水檸檬": "fruit:citrus",
  "台灣香檬": "fruit:citrus",
  "金柑": "fruit:citrus",
  "四季檸檬": "fruit:citrus",
  "香丁": "fruit:citrus",
  "美人柑": "fruit:citrus",
  "茂谷": "fruit:citrus",
  "肚臍橙": "fruit:citrus",
  "蜜柚": "fruit:citrus",
  "佛利蒙柑": "fruit:citrus",
  "蜜柑": "fruit:citrus",
  "晚崙西亞橙": "fruit:citrus",
  "紅文旦": "fruit:citrus",
  // fruit:stonepome (30)
  "桃接李": "fruit:stonepome",
  "李子": "fruit:stonepome",  // plum, same as 李
  "白柿": "fruit:stonepome",  // a persimmon cultivar, same as 柿
  "筆柿": "fruit:stonepome",  // a persimmon cultivar, same as 柿
  "甜桃": "fruit:stonepome",  // a peach cultivar, same as 桃/水蜜桃
  "梅": "fruit:stonepome",
  "芒果": "fruit:stonepome",
  "龍眼": "fruit:stonepome",
  "荔枝": "fruit:stonepome",
  "桃": "fruit:stonepome",
  "李": "fruit:stonepome",
  "枇杷": "fruit:stonepome",
  "柿": "fruit:stonepome",
  "梨": "fruit:stonepome",
  "蘋果": "fruit:stonepome",
  "棗": "fruit:stonepome",
  "楊梅": "fruit:stonepome",
  "橄欖": "fruit:stonepome",
  "櫻桃": "fruit:stonepome",
  "紅肉李": "fruit:stonepome",
  "水蜜桃": "fruit:stonepome",
  "甜柿": "fruit:stonepome",
  "椰棗": "fruit:stonepome",
  "梅子": "fruit:stonepome",
  "桃子": "fruit:stonepome",
  "黃肉李": "fruit:stonepome",
  "蜜李": "fruit:stonepome",
  "柿子": "fruit:stonepome",
  "沙梨": "fruit:stonepome", // sand pear (Pyrus pyrifolia), a pear species/synonym, not "other"
  // processed (342)
  "甜菊粉": "processed",
  "芳香萬壽菊粉": "processed",
  "小菊花": "processed",
  "乾燥蒜頭": "processed",
  "咸豐草乾": "processed",
  "紅棗": "processed",
  "枸杞": "processed",
  "乾香菇": "processed",
  "薑黃粉": "processed",
  "乾木耳": "processed",
  "蘿蔔乾": "processed",
  "薑粉": "processed",
  "洛神葵乾": "processed",
  "芭樂乾": "processed",
  "檸檬乾": "processed",
  "法國進口有機手工長棍": "processed",
  "菊花": "processed",
  "砂糖": "processed",
  "黑豆茶": "processed",
  "黑糖": "processed",
  "洛神花乾": "processed",
  "鳳梨乾": "processed",
  "黑豆漿": "processed",
  "辣椒乾": "processed",
  "糙米粉": "processed",
  "黑芝麻粉": "processed",
  "香蕉乾": "processed",
  "黃耆": "processed",
  "仙草乾": "processed",
  "麵線": "processed",
  "奇亞籽": "processed",
  "燕麥粉": "processed",
  "決明子": "processed",
  "三色藜麥": "processed",
  "全麥麵粉": "processed",
  "大燕麥片": "processed",
  "葡萄乾": "processed",
  "龍眼乾": "processed",
  "黑豆粉": "processed",
  "薑片": "processed",
  "紅薑黃粉": "processed",
  "寬麵": "processed",
  "細麵": "processed",
  "紅龍果乾": "processed",
  "燕麥仁": "processed",
  "洛神乾": "processed",
  "埃及豆": "processed",
  "青仁黑豆": "processed",
  "黃豆粉": "processed",
  "紅棗乾": "processed",
  "高麗菜乾": "processed",
  "糙米麩": "processed",
  "芒果乾": "processed",
  "薑黃片": "processed",
  "燕麥片": "processed",
  "糙米餅": "processed",
  "蕎麥仁": "processed",
  "黑糯糙米": "processed",
  "杭菊乾": "processed",
  "亞麻子": "processed",
  "高筋麵粉": "processed",
  "番茄乾": "processed",
  "乾燥杭菊": "processed",
  "黑棗": "processed",
  "木瓜乾": "processed",
  "米穀粉": "processed",
  "紅薏仁": "processed",
  "乾燥洛神花": "processed",
  "紅扁豆": "processed",
  "乾仙草": "processed",
  "檸檬粉": "processed",
  "苦茶油": "processed",
  "水稻碾製品": "processed",
  "無花果乾": "processed",
  "火龍果乾": "processed",
  "紅球薑": "processed",
  "綜合堅果": "processed",
  "乾燥薄荷": "processed",
  "山苦瓜粉": "processed",
  "南瓜粉": "processed",
  "竹薑粉": "processed",
  "濃豆漿": "processed",
  "中筋麵粉": "processed",
  "草莓乾": "processed",
  "枸杞原汁": "processed",
  "辣椒粉": "processed",
  "黑麥片": "processed",
  "黑藜麥": "processed",
  "杏仁粉": "processed",
  "黑糯米": "processed",
  "乾燥洛神葵": "processed",
  "南瓜子仁": "processed",
  "白藜麥": "processed",
  "蔓越莓乾": "processed",
  "紅藜麥粉": "processed",
  "豆漿": "processed",
  "乾燥甜菊": "processed",
  "秋葵乾": "processed",
  "紫蘇粉": "processed",
  "金銀花乾": "processed",
  "羽衣甘藍粉": "processed",
  "五穀粉": "processed",
  "紅晶冰糖": "processed",
  "黑麥仁": "processed",
  "鳳梨果乾": "processed",
  "枸杞乾果": "processed",
  "金棗乾": "processed",
  "乾燥紫蘇": "processed",
  "南瓜乾": "processed",
  "玫瑰花乾": "processed",
  "芳香萬壽菊乾": "processed",
  "紫蘇乾": "processed",
  "印加果仁": "processed",
  "乾猴頭菇": "processed",
  "亞麻仁籽": "processed",
  "大紅棗": "processed",
  "玫瑰花茶": "processed",
  "乾燥檸檬香茅": "processed",
  "香椿粉": "processed",
  "黑芝麻醬": "processed",
  "麥芽糖": "processed",
  "蕎麥粉": "processed",
  "乾燥迷迭香": "processed",
  "乾燥芳香萬壽菊": "processed",
  "甜菊乾": "processed",
  "山苦瓜乾": "processed",
  "玉米粉": "processed",
  "甜菜根粉": "processed",
  "醬油": "processed",
  "山苦瓜茶包": "processed",
  "黑芝麻粒": "processed",
  "玉米粒": "processed",
  "甘草": "processed",
  "中低筋麵粉": "processed",
  "莧籽": "processed",
  "乾燥印加果": "processed",
  "白朮": "processed",
  "乾芳香萬壽菊": "processed",
  "葛鬱金粉": "processed",
  "檸檬原汁": "processed",
  "黑木耳乾": "processed",
  "決明子茶": "processed",
  "洋薏仁": "processed",
  "綜合菇": "processed",
  "肉桂粉": "processed",
  "乾薑片": "processed",
  "味噌": "processed",
  "洛神花茶": "processed",
  "荔枝乾": "processed",
  "蓮藕粉": "processed",
  "老薑粉": "processed",
  "紅藜粉": "processed",
  "酸白菜": "processed",
  "芭蕉乾": "processed",
  "豆干": "processed",
  "乾燥香茅": "processed",
  "地瓜乾": "processed",
  "山藥粉": "processed",
  "梅子醋": "processed",
  "十穀米": "processed",
  "黑糖粉": "processed",
  "即食燕麥片": "processed",
  "薄荷茶": "processed",
  "桂花乾": "processed",
  "九層塔粉": "processed",
  "菠菜粉": "processed",
  "紅米": "processed",
  "玄米茶": "processed",
  "糙米醋": "processed",
  "茯苓": "processed",
  "花生醬": "processed",
  "香蕉果乾": "processed",
  "晶冰糖": "processed",
  "酸菜": "processed",
  "豆腐": "processed",
  "乾燥薑片": "processed",
  "乾燥薰衣草": "processed",
  "乾燥鼠尾草": "processed",
  "檸檬片": "processed",
  "乾柳松菇": "processed",
  "米糠": "processed",
  "黑豆茶包": "processed",
  "桑椹原汁": "processed",
  "亞麻仁籽粉": "processed",
  "馬鈴薯澱粉": "processed",
  "地瓜粉": "processed",
  "可可粉": "processed",
  "大紅豆": "processed",
  "南薑粉": "processed",
  "丹參粉": "processed",
  "長秈白米": "processed",
  "木棉豆腐": "processed",
  "乾燥黑豆": "processed",
  "枸杞子": "processed",
  "冷凍芋頭塊": "processed",
  "米穀粒": "processed",
  "乾燥油菊": "processed",
  "當歸片": "processed",
  "洛神花茶包": "processed",
  "枸杞汁": "processed",
  "草莓果乾": "processed",
  "黑棗乾": "processed",
  "光中杏": "processed",
  "乾燥玫瑰": "processed",
  "茉莉花乾": "processed",
  "枸杞乾": "processed",
  "枸杞明采茶": "processed",
  "黃豆漿": "processed",
  "苦瓜粉": "processed",
  "馬鈴薯粉": "processed",
  "蕎麥麵": "processed",
  "長秈糙米": "processed",
  "咖哩粉": "processed",
  "黑胡椒粉": "processed",
  "葵花籽": "processed",
  "竹薑片": "processed",
  "土肉桂粉": "processed",
  "秋葵粉": "processed",
  "芹菜粉": "processed",
  "小松菜粉": "processed",
  "豆腐乳": "processed",
  "絹豆腐": "processed",
  "五穀米": "processed",
  "花椰菜乾": "processed",
  "洛神花粉": "processed",
  "蘋果乾": "processed",
  "甜菊葉": "processed",
  "蘋果醋": "processed",
  "牛蒡乾": "processed",
  "檸檬果乾": "processed",
  "刺五加茶包": "processed",
  "小燕麥片": "processed",
  "綠豆澱粉": "processed",
  "薏仁粉": "processed",
  "冷凍芋頭角": "processed",
  "草莓果醬": "processed",
  "香米": "processed",
  "山楂": "processed",
  "乾肉桂葉": "processed",
  "諾麗果粉": "processed",
  "檸檬香茅茶包": "processed",
  "檸檬茶包": "processed",
  "米糠粉": "processed",
  "花生粉": "processed",
  "小米粉": "processed",
  "白胡椒粉": "processed",
  "乾燥蒜片": "processed",
  "桑葉乾": "processed",
  "黃金奇異果": "processed",
  "洛神葵粉": "processed",
  "乾燥金盞花": "processed",
  "萵苣粉": "processed",
  "山苦瓜片": "processed",
  "辣椒醬": "processed",
  "紅麴": "processed",
  "米精": "processed",
  "綠豆粉": "processed",
  "蔗糖": "processed",
  "玉米鬚茶": "processed",
  "牛蒡茶包": "processed",
  "乾燥玫瑰花瓣": "processed",
  "生糙米粉": "processed",
  "薑茶": "processed",
  "紫蘇茶包": "processed",
  "番茄果乾": "processed",
  "青芒果乾": "processed",
  "可可豆": "processed",
  "圓糯白米": "processed",
  "百香果乾": "processed",
  "紅藜茶包": "processed",
  "洛神花果乾": "processed",
  "黑芝麻油": "processed",
  "花生油": "processed",
  "紅棗粉": "processed",
  "紅棗圈": "processed",
  "印加果油": "processed",
  "乾燥睡蓮": "processed",
  "乾燥甜菊葉": "processed",
  "乾燥百里香": "processed",
  "檸檬香片": "processed",
  "乾桑葉": "processed",
  "乾白鶴靈芝": "processed",
  "炭培烏龍茶": "processed",
  "乾白木耳": "processed",
  "紅薑黃片": "processed",
  "刺五加乾": "processed",
  "甜酒釀": "processed",
  "紅蘿蔔粉": "processed",
  "黑木耳飲": "processed",
  "柑橘紅茶": "processed",
  "蘋果烏龍茶": "processed",
  "牛蒡乾片": "processed",
  "米麴": "processed",
  "仙草茶": "processed",
  "檸檬草茶": "processed",
  "野生紅心芭樂茶": "processed",
  "愛玉籽": "processed",
  "乾燥土肉桂葉": "processed",
  "乾燥辣椒": "processed",
  "地瓜葉粉": "processed",
  "桑葉粉": "processed",
  "莧菜粉": "processed",
  "羅勒粉": "processed",
  "胡蘿蔔粉": "processed",
  "香菇粉": "processed",
  "番茄粉": "processed",
  "酸高麗菜": "processed",
  "無糖豆漿": "processed",
  "乾燥肉桂": "processed",
  "黑木耳露": "processed",
  "大麥片": "processed",
  "麵粉": "processed",
  "杏桃乾": "processed",
  "白米餅": "processed",
  "黑糯米餅": "processed",
  "菠菜米餅": "processed",
  "南瓜米餅": "processed",
  "香蕉米餅": "processed",
  "藍藻錠": "processed",
  "鳳梨醋": "processed",
  "檸檬醋": "processed",
  "豆包": "processed",
  "米酒": "processed",
  "長糯白米": "processed",
  "紅心芭樂乾": "processed",
  "肉桂茶包": "processed",
  "白芍": "processed",
  "芭樂果乾": "processed",
  "地瓜泥": "processed",
  "鳳梨果醬": "processed",
  "丁香": "processed",
  "碾製米(白米": "processed",
  "青江菜粉": "processed",
  "乾苦茶籽": "processed",
  "紅棗丁": "processed",
  "枸杞粉": "processed",
  "特級初榨橄欖油": "processed",
  "枸杞濃縮汁": "processed",
  "香茅乾": "processed", // dried lemongrass - matches 乾檸檬香茅/乾燥檸檬香茅
  "乾桂花": "processed", // dried osmanthus - matches 乾燥桂花
  "乾金針": "processed", // dried daylily - a processed dried food, like other 乾 items
  "乾枸杞": "processed", // dried goji - matches 枸杞/枸杞乾/枸杞子
  // other (183)
  "芭樂葉": "other",
  "檸檬百里香": "other",
  "櫻花": "other",            // cherry blossom - an ornamental flower, not a fruit
  "無患子": "other",          // soapberry - not eaten as fruit, used for soap nuts
  "阿里山油菊": "other",      // a chrysanthemum grown for tea, same family as 油菊
  "歐芹": "other",
  "鳳梨鼠尾草": "other",
  "馬鬱蘭": "other",
  "當歸葉": "other",
  "鴨兒芹": "other",
  "野人參": "other",
  "桋梧": "other",
  "蟛蜞菊": "other",
  "紫錐": "other",
  "苦楝": "other",
  "巧克力薄荷": "other",
  "斑蘭葉": "other",
  "蓮蓬": "other",
  "食用花卉(玫瑰花": "other",
  "山肉桂": "other",
  "洛神葵": "other",
  "薑黃": "other",
  "印加果": "other",
  "魚腥草": "other",
  "香茅": "other",
  "迷迭香": "other",
  "芳香萬壽菊": "other",
  "仙草": "other",
  "香椿": "other",
  "艾草": "other",
  "甜菊": "other",
  "油茶": "other",
  "苦茶": "other",
  "樹葡萄": "other",
  "杭菊": "other",
  "桂花": "other",
  "當歸": "other",
  "肉桂": "other",
  "檸檬香茅": "other",
  "明日葉": "other",
  "石蓮花": "other",
  "昭和草": "other",
  "金銀花": "other",
  "木鱉果": "other",
  "百里香": "other",
  "諾麗果": "other",
  "薰衣草": "other",
  "刺蔥": "other",
  "蝶豆花": "other",
  "愛玉子": "other",
  "咸豐草": "other",
  "香蜂草": "other",
  "玫瑰": "other",
  "油茶果": "other",
  "蘆薈": "other",
  "土肉桂": "other",
  "油甘": "other",
  "羊奶頭": "other",
  "愛玉鮮果": "other",
  "刺五加": "other",
  "南薑": "other",
  "鼠尾草": "other",
  "苦茶鮮果": "other",
  "丹參": "other",
  "白鶴靈芝": "other",
  "洋甘菊": "other",
  "破布子": "other",
  "洛神": "other",
  "野薑花": "other",
  "蛋黃果": "other",
  "冰花": "other",
  "檸檬馬鞭草": "other",
  "萬壽菊": "other",
  "苦茶籽": "other",
  "燈籠果": "other",
  "洛神花": "other",
  "金盞花": "other",
  "奧勒岡": "other",
  "可可": "other",
  "食用百合": "other",
  "仙桃": "other",
  "馬鞭草": "other",
  "蓮子": "other",
  "香蘭": "other",
  "桑葉": "other",
  "食用花卉": "other",
  "蘋婆": "other",
  "玫瑰花": "other",
  "狗尾草": "other",
  "茉莉花": "other",
  "百合": "other",
  "香莢蘭": "other",
  "山胡椒": "other",
  "朝鮮薊": "other",
  "何首烏": "other",
  "丹蔘": "other",
  "辣木": "other",
  "茶籽": "other",
  "金蓮花": "other",
  "神秘果": "other",
  "麵包果": "other",
  "晚香玉筍": "other",
  "可可鮮果": "other",
  "苦蘵": "other",
  "小油菊": "other",
  "新鮮蓮子": "other",
  "左手香": "other",
  "七葉蘭": "other",
  "天竺葵": "other",
  "紅薑黃": "other",
  "金線蓮": "other",
  "馬告": "other",
  "愛玉": "other",
  "紫錐花": "other",
  "五葉松": "other",
  "接骨木": "other",
  "山當歸": "other",
  "晚香玉": "other",
  "到手香": "other",
  "蒲公英": "other",
  "蔬果乾": "other",
  "油茶籽": "other",
  "黃藤": "other",
  "睡蓮": "other",
  "山芙蓉": "other",
  "油菊": "other",
  "月桂": "other",
  "山葡萄": "other",
  "紫錐菊": "other",
  "佛手柑": "other",
  "貓薄荷": "other",
  "荷花": "other",
  "月桃": "other",
  "食用玫瑰花": "other",
  "黃花蜜菜": "other",
  "台灣土肉桂": "other",
  "肉桂葉": "other",
  "車前草": "other",
  "雨來菇": "other",
  "芋頭冬瓜": "other",
  "雷公根": "other",
  "玫瑰天竺葵": "other",
  "苜蓿": "other",
  "七葉膽": "other",
  "假酸漿": "other",
  "益母草": "other",
  "油甘果": "other",
  "樹番茄": "other",
  "薄荷葉": "other",
  "香蘭葉": "other",
  "廣藿香": "other",
  "枇杷葉": "other",
  "大花咸豐草": "other",
  "香草莢": "other",
  "人參果": "other",
  "桑椹葉": "other",
  "黨參": "other",
  "油柑": "other",
  "石斛": "other",
  "白粗康": "other",
  "苦茶樹": "other",
  "土肉桂葉": "other",
  "花椒": "other",
  "梅精": "other",
  "天仙果": "other",
  "金錢薄荷": "other",
  "台灣天仙果": "other",
  "餘甘子": "other",
  "南非葉": "other",
  "紅紫蘇": "other",
  "辣木葉": "other",
  "油芒": "other",
  "香蕉花": "other",
  "荊芥": "other",
  "五味子": "other",
  "皇菊": "other",
  "苦茶菓": "other",
  "紅花": "other",
  "魚針草": "other",
  "茵陳蒿": "other",
  "沉香": "other",
  "大黃": "other",
};

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

    for (const rawCrop of splitCrops(row.ContainCrops)) {
      if (rawCrop.length > 10 || rawCrop.includes(",")) continue; // malformed/noisy entries
      const crop = normalizeCrop(rawCrop);
      if (CATEGORY_LABEL_TOKENS.has(crop)) continue; // category label, not a specific crop
      if (CROP_NAME_BLOCKLIST.has(crop)) continue; // modifier/packaging word, not a crop
      if (!scores.has(crop)) scores.set(crop, new Map());
      const perLeaf = scores.get(crop);
      for (const leafKey of rowLeaves) {
        perLeaf.set(leafKey, (perLeaf.get(leafKey) || 0) + share);
      }
      totalMentions.set(crop, (totalMentions.get(crop) || 0) + 1);
    }
  });

  // Determine each crop's winning leaf, in priority order:
  // 1. CROP_FORCED_LEAF - manual correction, always wins.
  // 2. FORCED_LEAF_PATTERNS - manual correction by pattern, always wins.
  // 3. CROP_CATEGORY_MAP - baked in from a real data snapshot, authoritative
  //    for everything it knows about.
  // 4. Live fractional-vote tally - only for a crop none of the above have
  //    seen yet, i.e. one that's new to the dataset since the map was baked.
  const winningLeaf = new Map(); // crop -> leafKey
  for (const [crop, perLeaf] of scores) {
    if (CROP_FORCED_LEAF[crop]) {
      winningLeaf.set(crop, CROP_FORCED_LEAF[crop]);
      continue;
    }
    const patternLeaf = patternForcedLeaf(crop);
    if (patternLeaf) {
      winningLeaf.set(crop, patternLeaf);
      continue;
    }
    if (CROP_CATEGORY_MAP[crop]) {
      winningLeaf.set(crop, CROP_CATEGORY_MAP[crop]);
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
    for (const rawCrop of splitCrops(row.ContainCrops)) {
      const crop = normalizeCrop(rawCrop);
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
  normalizeCrop,
};