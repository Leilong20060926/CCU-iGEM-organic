import type { GeocodeResult, ListParams, MetaResponse, Operator, OperatorListResponse } from "../types";

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
