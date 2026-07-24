import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { STR } from "../data/content";
import { useMeta } from "../hooks/useMeta";
import BackLink from "../components/BackLink";
import CountyLeafletMap from "../components/CountyLeafletMap";
import NearestVendorFinder from "../components/NearestVendorFinder";
import Spinner from "../components/Spinner";
import { COUNTY_POINTS } from "../data/countyMap";

export default function MapPage() {
  const { tv } = useLang();
  const { meta, loading } = useMeta();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<string | null>(searchParams.get("county"));

  const counts: Record<string, number> = {};
  meta?.counties.forEach((c) => (counts[c.name] = c.count));

  return (
    <div>
      <BackLink to="/">{tv(STR.backHome)}</BackLink>
      <h2 className="mb-1 mt-0.5 text-[26px] font-bold">{tv(STR.mapTitle)}</h2>
      <p className="mb-4 text-[13px] text-ink-soft">{tv(STR.mapSub)}</p>

      <NearestVendorFinder />

      {loading && <Spinner />}

      <div className="flex flex-wrap items-start gap-6.5">
        <div className="flex-none overflow-hidden rounded-[14px] border border-line bg-surface p-3.5">
          <CountyLeafletMap counts={counts} selected={selected} onSelect={setSelected} />
          <div className="mt-1.5 text-center text-[11px] text-ink-soft">{tv(STR.mapSub)}</div>
        </div>

        <div className="min-w-[280px] flex-[1_1_320px]">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">
            {tv(STR.countyListTitle)}
          </div>
          {COUNTY_POINTS.map((c) => {
            const count = counts[c.name] || 0;
            return (
              <div
                key={c.name}
                onClick={() => setSelected(c.name)}
                className={`mb-2.5 flex cursor-pointer flex-wrap items-center justify-between gap-2.5 rounded-[10px] border bg-surface p-3.5 ${
                  selected === c.name ? "border-seal shadow-[0_0_0_2px_var(--color-seal-soft)]" : "border-line"
                }`}
              >
                <div>
                  <div className="text-[13.5px] font-bold">{c.name}</div>
                  <div className="text-[11.5px] text-ink-soft">{count.toLocaleString()} 家</div>
                </div>
                <Link
                  to={`/search?q=&county=${encodeURIComponent(c.name)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[12px] font-bold text-both"
                >
                  {tv(STR.viewOperators)}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
