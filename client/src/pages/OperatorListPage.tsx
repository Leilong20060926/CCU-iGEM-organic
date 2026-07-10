import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { STR, STATUS_LABELS } from "../data/content";
import { useMeta } from "../hooks/useMeta";
import { listOperators } from "../api/organic";
import type { Operator, SortField } from "../types";
import BackLink from "../components/BackLink";
import OperatorCard from "../components/OperatorCard";
import FilterChips from "../components/FilterChips";
import Pagination from "../components/Pagination";

const SORT_OPTIONS: { value: SortField; zh: string; en: string }[] = [
  { value: "Name", zh: "名稱", en: "Name" },
  { value: "county" as SortField, zh: "縣市", en: "County" },
  { value: "EffectiveDate", zh: "有效期限", en: "Valid until" },
  { value: "Status", zh: "狀態", en: "Status" },
];

export default function OperatorListPage() {
  const { catId, sub } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, tv } = useLang();
  const { meta } = useMeta();

  const q = searchParams.get("q") ?? "";
  const county = searchParams.get("county") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = (searchParams.get("sortBy") as SortField) || "Name";
  const order = (searchParams.get("order") as "asc" | "desc") || "asc";
  const status = searchParams.get("status") ?? "all";

  const [result, setResult] = useState<{ data: Operator[]; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const activeSub = sub && sub !== "list" ? sub : undefined;
  const cat = catId ? meta?.categories.find((c) => c.id === catId) : undefined;
  const subMeta = cat?.subs?.find((s) => s.id === activeSub);

  useEffect(() => {
    setLoading(true);
    listOperators({
      page,
      pageSize: 20,
      sortBy: sortBy === ("county" as SortField) ? "Address" : sortBy,
      order,
      search: q || undefined,
      category: catId,
      sub: activeSub,
      county: county || undefined,
      status: status !== "all" ? status : undefined,
    })
      .then(setResult)
      .finally(() => setLoading(false));
  }, [catId, activeSub, county, page, sortBy, order, status, q]);

  function update(patch: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if (!("page" in patch)) next.delete("page");
    setSearchParams(next);
  }

  const backTo = catId ? (cat?.subs ? `/category/${catId}` : "/") : "/";
  const title = catId
    ? cat
      ? lang === "zh"
        ? subMeta?.zh ?? cat.zh
        : subMeta?.en ?? cat.en
      : "…"
    : q || county || tv(STR.searchResultsFor);
  const subtitle = catId && cat && subMeta ? (lang === "zh" ? cat.zh : cat.en) : null;

  return (
    <div>
      <BackLink to={backTo}>{tv(STR.back)}</BackLink>
      <h2 className="mb-1 mt-0.5 text-[26px] font-bold">
        {title} {subtitle && <span className="text-[15px] font-normal text-ink-soft">{subtitle}</span>}
      </h2>
      <p className="mb-4 text-[13px] text-ink-soft">
        {result ? result.total.toLocaleString() : "…"} {tv(STR.operatorsCount)}
      </p>

      <FilterChips
        options={[
          { value: "all", label: tv(STR.all) },
          ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label: tv(label) })),
        ]}
        value={status}
        onChange={(v) => update({ status: v === "all" ? "" : v })}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-soft">
        <span>{lang === "zh" ? "排序" : "Sort"}:</span>
        <select
          className="rounded-full border border-line bg-surface px-3 py-1.5"
          value={sortBy}
          onChange={(e) => update({ sortBy: e.target.value })}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {lang === "zh" ? o.zh : o.en}
            </option>
          ))}
        </select>
        <button
          className="rounded-full border border-line bg-surface px-3 py-1.5"
          onClick={() => update({ order: order === "asc" ? "desc" : "asc" })}
        >
          {order === "asc" ? "↑" : "↓"}
        </button>
        {county && (
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-both-soft px-3 py-1.5 text-both">
            {county}
            <button onClick={() => update({ county: "" })} className="font-bold">
              ×
            </button>
          </span>
        )}
      </div>

      {loading && <div className="text-sm text-ink-soft">…</div>}

      {!loading && (!result || result.data.length === 0) && (
        <div className="px-1.5 py-2 text-[13px] text-ink-soft">{tv(STR.noResult)}</div>
      )}

      <div className="grid grid-cols-4 gap-4 max-[860px]:grid-cols-2 max-[520px]:grid-cols-2">
        {result?.data.map((op) => (
          <OperatorCard key={op.id} op={op} />
        ))}
      </div>

      {result && (
        <Pagination page={page} totalPages={result.totalPages} onChange={(p) => update({ page: String(p) })} />
      )}
    </div>
  );
}
