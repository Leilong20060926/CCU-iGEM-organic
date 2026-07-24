import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { STR, STATUS_LABELS } from "../data/content";
import { useMeta } from "../hooks/useMeta";
import { listOperators } from "../api/organic";
import type { CertType, Operator, SortField } from "../types";
import BackLink from "../components/BackLink";
import OperatorCard from "../components/OperatorCard";
import FilterChips from "../components/FilterChips";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";

const SORT_OPTIONS: { value: SortField; zh: string; en: string }[] = [
  { value: "Name", zh: "名稱", en: "Name" },
  { value: "county" as SortField, zh: "縣市", en: "County" },
  { value: "EffectiveDate", zh: "有效期限", en: "Valid until" },
  { value: "Status", zh: "狀態", en: "Status" },
];

export default function OperatorListPage() {
  const { catId, sub, crop } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, tv } = useLang();
  const { meta } = useMeta();

  const q = searchParams.get("q") ?? "";
  const county = searchParams.get("county") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = (searchParams.get("sortBy") as SortField) || "Name";
  const order = (searchParams.get("order") as "asc" | "desc") || "asc";
  const status = searchParams.get("status") ?? "all";
  const certType = searchParams.get("certType") ?? "all";

  const [result, setResult] = useState<{ data: Operator[]; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const cropFromQuery = searchParams.get("crop") ?? undefined;
  const activeCrop = (crop && crop !== "_all" ? crop : undefined) ?? cropFromQuery;
  const cat = catId ? meta?.categories.find((c) => c.id === catId) : undefined;
  const subMeta = cat?.subs?.find((s) => s.id === sub);

  useEffect(() => {
    setLoading(true);
    listOperators({
      page,
      pageSize: 20,
      sortBy: sortBy === ("county" as SortField) ? "Address" : sortBy,
      order,
      search: q || undefined,
      category: catId,
      sub,
      crop: activeCrop,
      county: county || undefined,
      status: status !== "all" ? status : undefined,
      certType: certType !== "all" ? (certType as CertType) : undefined,
    })
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => (a.Status === "通過" && b.Status !== "通過" ? -1 : b.Status === "通過" && a.Status !== "通過" ? 1 : 0));
        setResult({ ...res, data: sorted });
      })
      .finally(() => setLoading(false));
  }, [catId, sub, activeCrop, county, page, sortBy, order, status, certType, q]);

  function update(patch: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if (!("page" in patch)) next.delete("page");
    setSearchParams(next);
  }

  const backTo = catId ? (sub ? `/category/${catId}/${sub}` : cat?.subs ? `/category/${catId}` : `/category/${catId}/crops`) : "/";
  const categoryLabel = cat ? (lang === "zh" ? subMeta?.zh ?? cat.zh : subMeta?.en ?? cat.en) : null;

  let title: string;
  let subtitle: string | null = null;
  if (activeCrop) {
    title = activeCrop;
    subtitle = categoryLabel;
  } else if (catId) {
    title = categoryLabel ?? "…";
  } else {
    title = q || county || tv(STR.searchResultsFor);
  }

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
          { value: "organic", label: `🌱 ${tv(STR.organicTag)}` },
          { value: "friendly", label: `🤝 ${tv(STR.friendlyTag)}` },
        ]}
        value={certType}
        onChange={(v) => update({ certType: v === "all" ? "" : v })}
      />

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

      {loading && <Spinner />}

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
