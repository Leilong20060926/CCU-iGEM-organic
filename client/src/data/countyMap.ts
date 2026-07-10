export interface CountyPoint {
  name: string;
  en: string;
  lat: number;
  lng: number;
}

// Real county-seat coordinates (WGS84) for Taiwan's 22 counties/cities, used as
// aggregate marker positions since the source data has no per-operator geocoding.
export const COUNTY_POINTS: CountyPoint[] = [
  { name: "基隆市", en: "Keelung", lat: 25.1276, lng: 121.7392 },
  { name: "臺北市", en: "Taipei", lat: 25.0330, lng: 121.5654 },
  { name: "新北市", en: "New Taipei", lat: 25.0117, lng: 121.4627 },
  { name: "宜蘭縣", en: "Yilan", lat: 24.7021, lng: 121.7377 },
  { name: "桃園市", en: "Taoyuan", lat: 24.9936, lng: 121.3010 },
  { name: "新竹市", en: "Hsinchu City", lat: 24.8138, lng: 120.9675 },
  { name: "新竹縣", en: "Hsinchu County", lat: 24.8388, lng: 121.0025 },
  { name: "苗栗縣", en: "Miaoli", lat: 24.5602, lng: 120.8214 },
  { name: "臺中市", en: "Taichung", lat: 24.1477, lng: 120.6736 },
  { name: "彰化縣", en: "Changhua", lat: 24.0806, lng: 120.5385 },
  { name: "南投縣", en: "Nantou", lat: 23.9157, lng: 120.6869 },
  { name: "雲林縣", en: "Yunlin", lat: 23.7092, lng: 120.5415 },
  { name: "嘉義市", en: "Chiayi City", lat: 23.4801, lng: 120.4491 },
  { name: "嘉義縣", en: "Chiayi County", lat: 23.4599, lng: 120.2445 },
  { name: "花蓮縣", en: "Hualien", lat: 23.9871, lng: 121.6015 },
  { name: "臺南市", en: "Tainan", lat: 22.9998, lng: 120.2269 },
  { name: "臺東縣", en: "Taitung", lat: 22.7583, lng: 121.1444 },
  { name: "高雄市", en: "Kaohsiung", lat: 22.6273, lng: 120.3014 },
  { name: "屏東縣", en: "Pingtung", lat: 22.6519, lng: 120.4867 },
  { name: "澎湖縣", en: "Penghu", lat: 23.5711, lng: 119.5793 },
  { name: "金門縣", en: "Kinmen", lat: 24.4327, lng: 118.3172 },
  { name: "連江縣", en: "Lienchiang", lat: 26.1590, lng: 119.9410 },
];

export function countyPoint(name: string): CountyPoint | undefined {
  return COUNTY_POINTS.find((c) => c.name === name);
}
