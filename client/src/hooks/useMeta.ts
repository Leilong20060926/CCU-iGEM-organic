import { useEffect, useState } from "react";
import { getMeta } from "../api/organic";
import type { MetaResponse } from "../types";

let cached: MetaResponse | null = null;
let inflight: Promise<MetaResponse> | null = null;

function loadMeta(): Promise<MetaResponse> {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = getMeta().then((meta) => {
      cached = meta;
      inflight = null;
      return meta;
    });
  }
  return inflight;
}

export function useMeta() {
  const [meta, setMeta] = useState<MetaResponse | null>(cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cached) return;
    let alive = true;
    loadMeta()
      .then((m) => alive && setMeta(m))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  return { meta, loading: !meta && !error, error };
}
