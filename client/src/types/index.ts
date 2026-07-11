export type Lang = "zh" | "en";

export type Status = "通過" | "結束" | "終止" | "暫終";

export type CertType = "organic" | "friendly";

export interface Operator {
  id: string;
  certType: CertType;
  Name: string;
  Address: string;
  Tel: string;
  Products: string;
  ContainCrops: string;
  BehaviorType: string;
  CompanyName: string;
  CertOrganicSn: string;
  EffectiveDate: string;
  Status: Status;
  MailingAddress: string;
  OldCertOrganicSN: string;
  county: string | null;
}

export interface OperatorListResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: string;
  order: "asc" | "desc";
  data: Operator[];
}

export interface CategorySub {
  id: string;
  zh: string;
  en: string;
  count: number;
}

export interface CategoryMeta {
  id: string;
  zh: string;
  en: string;
  icon: string;
  count: number;
  subs: CategorySub[] | null;
}

export interface CountyCount {
  name: string;
  count: number;
}

export interface StatusCount {
  value: string;
  count: number;
}

export interface MetaResponse {
  total: number;
  certTypes: { value: CertType; count: number }[];
  categories: CategoryMeta[];
  counties: CountyCount[];
  statuses: StatusCount[];
  tokenLabelsEn: Record<string, string>;
  fetchedAt: number;
}

export type SortField =
  | "Name" | "Address" | "Tel" | "Products" | "ContainCrops" | "BehaviorType"
  | "CompanyName" | "CertOrganicSn" | "EffectiveDate" | "Status" | "MailingAddress" | "OldCertOrganicSN";

export type GeocodePrecision = "address" | "street" | "district" | "county";

export interface GeocodeResult {
  lat: number;
  lng: number;
  precision: GeocodePrecision;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortField;
  order?: "asc" | "desc";
  search?: string;
  category?: string;
  sub?: string;
  county?: string;
  status?: string;
  crop?: string;
  certType?: CertType;
}

export interface CropCount {
  name: string;
  count: number;
}
