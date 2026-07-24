import type { CropCount, GeocodeResult, ListParams, MetaResponse, Operator, OperatorListResponse } from "../types";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function listOperators(params: ListParams = {}): Promise<OperatorListResponse> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") qs.set(key, String(value));
  });
  return apiFetch(`/api/organic?${qs.toString()}`);
}

export function getMeta(): Promise<MetaResponse> {
  return apiFetch("/api/organic/meta");
}

export function getOperator(id: string): Promise<Operator> {
  return apiFetch(`/api/organic/${encodeURIComponent(id)}`);
}

export function geocodeOperator(id: string): Promise<GeocodeResult> {
  return apiFetch(`/api/organic/${encodeURIComponent(id)}/geocode`);
}

export async function getCrops(category: string, sub?: string): Promise<CropCount[]> {
  const qs = new URLSearchParams({ category, ...(sub ? { sub } : {}) });
  const res = await apiFetch<{ crops: CropCount[] }>(`/api/organic/crops?${qs.toString()}`);
  return res.crops;
}

export async function getAllCrops(): Promise<CropCount[]> {
  const res = await apiFetch<{ crops: CropCount[] }>("/api/organic/all-crops");
  return res.crops;
}

export async function getCropCounties(crop: string): Promise<CropCount[]> {
  const qs = new URLSearchParams({ crop });
  const res = await apiFetch<{ counties: CropCount[] }>(`/api/organic/crop-counties?${qs.toString()}`);
  return res.counties;
}
