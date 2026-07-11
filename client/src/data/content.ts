import type { Lang } from "../types";

type Bi = Record<Lang, string>;

export const STR = {
  appNameZh: "有心良食",
  appNameEn: "TrueHarvest",
  heroP: {
    zh: "查詢全台有機農產品的驗證資訊與經營者，讓每一次採買都吃得安心、買得明白。",
    en: "Look up certification and operator info for organic farm products across Taiwan.",
  } as Bi,
  heroStamp: { zh: "有機驗證\n查詢系統", en: "ORGANIC\nCERT LOOKUP" } as Bi,
  info: { zh: "相關資訊", en: "Info" } as Bi,
  about: { zh: "關於我們", en: "About" } as Bi,
  searchPh: { zh: "輸入業者名稱、地址或作物搜尋…", en: "Search by name, address or crop…" } as Bi,
  home: { zh: "首頁", en: "Home" } as Bi,
  mapNav: { zh: "地圖", en: "Map" } as Bi,
  categories: { zh: "農糧產品之大分類", en: "Product categories" } as Bi,
  goMap: { zh: "查看全台驗證分布地圖", en: "View nationwide map" } as Bi,
  goMapSub: { zh: "看看住家附近有哪些有機驗證業者", en: "Find certified organic operators near you" } as Bi,
  viewMap: { zh: "開啟地圖 →", en: "Open map →" } as Bi,
  back: { zh: "返回上一頁", en: "Back" } as Bi,
  backHome: { zh: "回首頁", en: "Back to home" } as Bi,
  all: { zh: "全部", en: "All" } as Bi,
  noResult: { zh: "找不到符合的資料", en: "No matching results" } as Bi,
  subcatTitle: { zh: "選擇細項分類", en: "Choose a sub-category" } as Bi,
  cropListTitle: { zh: "選擇農產品項目", en: "Choose a produce type" } as Bi,
  viewAllInCategory: { zh: "查看全部業者 →", en: "View all operators →" } as Bi,
  operatorsCount: { zh: "筆驗證資料", en: "certified operators" } as Bi,
  searchResultsFor: { zh: "搜尋結果", en: "Search results" } as Bi,
  certBlock: { zh: "驗證證書", en: "Certification" } as Bi,
  certNo: { zh: "證書字號", en: "Cert. No." } as Bi,
  oldCertNo: { zh: "舊證書字號", en: "Former cert. No." } as Bi,
  certAgency: { zh: "驗證機構", en: "Certifying body" } as Bi,
  certExpiry: { zh: "有效期限", en: "Valid until" } as Bi,
  certStatus: { zh: "驗證狀態", en: "Status" } as Bi,
  organicTag: { zh: "有機認證", en: "Certified Organic" } as Bi,
  friendlyTag: { zh: "友善耕作", en: "Friendly Farming" } as Bi,
  friendlyCertNo: { zh: "友善字號", en: "Friendly cert. No." } as Bi,
  friendlyGroup: { zh: "友善團體", en: "Friendly farming group" } as Bi,
  contactBlock: { zh: "聯絡資訊", en: "Contact" } as Bi,
  phone: { zh: "聯絡電話", en: "Phone" } as Bi,
  address: { zh: "登記地址", en: "Address" } as Bi,
  mailingAddress: { zh: "通訊地址", en: "Mailing address" } as Bi,
  county: { zh: "所在縣市", en: "County" } as Bi,
  geocoding: { zh: "定位中…", en: "Locating…" } as Bi,
  cropsBlock: { zh: "驗證作物項目", en: "Certified crops" } as Bi,
  cropsNote: { zh: "此業者通過驗證之完整作物清單", en: "Full list of crops certified for this operator" } as Bi,
  categoriesBlock: { zh: "農糧產品分類", en: "Product categories" } as Bi,
  mapTitle: { zh: "全台有機驗證分布地圖", en: "Nationwide certification map" } as Bi,
  mapSub: { zh: "圓點標示各縣市中心位置，大小代表驗證業者數量（非個別業者實際地址）", en: "Dots mark each county's center; size reflects operator count (not individual operator addresses)." } as Bi,
  countyListTitle: { zh: "縣市清單", en: "Counties" } as Bi,
  viewOperators: { zh: "查看業者 →", en: "View operators →" } as Bi,
  openGmap: { zh: "開啟 Google 地圖 →", en: "Open in Google Maps →" } as Bi,
  aboutTitle: { zh: "關於我們", en: "About us" } as Bi,
  aboutIntro: { zh: "簡介", en: "About" } as Bi,
  aboutBody: {
    zh: "我們是 No Fold，CCU-Taiwan iGEM 團隊，由國立中正大學各學院的學生所組成，涵蓋理學院、工學院、社會科學院、文學院，以及跨領域學士學位學程的同學。\n我們團隊計畫利用生物合成學的方式，開發可用於驅趕農業害蟲瘤野螟的系統，希望大家了解農藥對世界的危害以及增進大眾對有機稻米的認知。",
    en: "We are No Fold, the CCU-Taiwan iGEM team, made up of students from National Chung Cheng University's College of Science, College of Engineering, College of Social Sciences, College of Humanities, and the interdisciplinary undergraduate program.\nOur team is developing a synthetic-biology-based system to repel the rice leaffolder, a major agricultural pest, while raising public awareness of the harms of pesticides and understanding of organic rice.",
  } as Bi,
  aboutLinksTitle: { zh: "相關連結", en: "Related links" } as Bi,
  infoTitle: { zh: "相關資訊", en: "Related info" } as Bi,
  infoBody: { zh: "以下資料庫與連結，提供本平台資料來源與延伸閱讀：", en: "Sources and further reading used by this platform:" } as Bi,
  dbName: { zh: "有機農產品全國資訊網（農糧署）", en: "National Organic Product Information Network" } as Bi,
  miniMapTitle: { zh: "全台驗證業者分布", en: "Nationwide operator distribution" } as Bi,
  miniMapCta: { zh: "查看完整地圖 →", en: "View full map →" } as Bi,
  footer: { zh: "© 有心良食 TrueHarvest － 資料來源：農業部有機農產品追溯資訊", en: "© TrueHarvest — data source: MOA organic traceability open data" } as Bi,
};

export const STATUS_LABELS: Record<string, Bi> = {
  "通過": { zh: "通過", en: "Active" },
  "結束": { zh: "結束", en: "Ended" },
  "終止": { zh: "終止", en: "Terminated" },
  "暫終": { zh: "暫終", en: "Suspended" },
};

// tailwind color-utility suffixes (matches --color-* tokens in index.css)
export const STATUS_COLOR: Record<string, string> = {
  "通過": "organic",
  "結束": "ink-soft",
  "終止": "friendly",
  "暫終": "seal",
};

export const GEOCODE_PRECISION_LABEL: Record<string, Bi> = {
  address: { zh: "已定位到門牌地址", en: "Pinned to street address" },
  street: { zh: "已定位到街道／巷弄", en: "Pinned to street/lane level" },
  district: { zh: "已定位到行政區中心（地址過於精細，無法精確定位）", en: "Pinned to district center (address too specific to resolve precisely)" },
  county: { zh: "已定位到縣市中心（地址無法定位）", en: "Pinned to county center (address could not be resolved)" },
};

export const INFO_SECTIONS: { zh: string; en: string; points: Bi[] }[] = [
  {
    zh: "瘤野螟的破壞", en: "Rice Leaffolder Damage",
    points: [
      { zh: "瘤野螟為水稻二期作重要害蟲之一，也是亞洲所有稻作生態系中最具破壞性的害蟲之一。",
        en: "The rice leaffolder is one of the major pests of the second-crop rice season, and one of the most destructive pests across Asia's rice ecosystems." },
      { zh: "若慣行稻不使用農藥，瘤野螟幼蟲會將葉片捲起並藏匿其中啃食稻葉，這會導致水稻產生嚴重的白葉情況，使稻穗無法結實而無法收成。",
        en: "Without pesticides, leaffolder larvae roll up rice leaves and hide inside while feeding on them, causing severe leaf-whitening that prevents grain filling and leads to crop failure." },
    ],
  },
  {
    zh: "農藥的危害", en: "The Harm of Pesticides",
    points: [
      { zh: "有實驗顯示，在美國農業密集的區域，農民以及居住在農田附近的居民，因環境中的農藥殘留（隨風飄散、水源污染），面臨極高的致癌風險。",
        en: "Studies show that in intensively farmed regions of the US, farmers and nearby residents face significantly elevated cancer risk from pesticide residue drifting through the air and contaminating water sources." },
      { zh: "化學農藥與抗藥性形成惡性循環，農民必須不斷交替用藥、混合用藥。",
        en: "Chemical pesticides and pest resistance form a vicious cycle, forcing farmers to keep rotating and mixing more chemicals." },
      { zh: "長期農藥的累積會使新女王蜂的產量暴跌85%，破壞蜂群。",
        en: "Long-term pesticide accumulation can cause new queen bee production to plummet by 85%, devastating bee colonies." },
      { zh: "農藥毒殺野生授粉昆蟲，甚至影響瀕危物種（如兩棲類樹蛙）。",
        en: "Pesticides poison wild pollinating insects and even affect endangered species, such as amphibian tree frogs." },
    ],
  },
  {
    zh: "我們能做些什麼", en: "What We Can Do",
    points: [
      { zh: "支持有機稻米，保護環境、保護自身健康。", en: "Support organic rice to protect the environment and your own health." },
      { zh: "支持環保標章，購買選用環保包裝的產品。", en: "Support eco-labels and choose products with environmentally friendly packaging." },
    ],
  },
];

export const ABOUT_LINKS = [
  { icon: "📷", zh: "Instagram", en: "Instagram", url: "https://www.instagram.com/ccuigem/" },
  { icon: "🌐", zh: "學校官網", en: "Team website", url: "https://igem.ccu.edu.tw" },
  { icon: "▶️", zh: "YouTube", en: "YouTube", url: "https://www.youtube.com/@ccutaiwanigemteam133/featured" },
];
