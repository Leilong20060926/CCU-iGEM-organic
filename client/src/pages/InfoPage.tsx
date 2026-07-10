import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { INFO_SECTIONS, STR } from "../data/content";
import BackLink from "../components/BackLink";
import CountyLeafletMap from "../components/CountyLeafletMap";
import { useMeta } from "../hooks/useMeta";

export default function InfoPage() {
  const { tv } = useLang();
  const { meta } = useMeta();
  const counts: Record<string, number> = {};
  meta?.counties.forEach((c) => (counts[c.name] = c.count));

  return (
    <div>
      <BackLink to="/">{tv(STR.backHome)}</BackLink>
      <h2 className="mb-4 mt-0.5 text-[26px] font-bold">{tv(STR.infoTitle)}</h2>
      <div className="text-[14.5px] leading-[1.9] text-ink-soft">
        {INFO_SECTIONS.map((sec) => (
          <div key={sec.zh}>
            <h3 className="mb-2 mt-5.5 text-[15.5px] text-ink">{tv(sec)}</h3>
            <ul className="mb-1.5 list-disc pl-5">
              {sec.points.map((pt, i) => (
                <li key={i} className="mb-2">
                  {tv(pt)}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h3 className="mb-2 mt-5.5 text-[15.5px] text-ink">{tv(STR.infoBody)}</h3>
        <div className="my-2.5 flex items-center justify-between gap-2.5 rounded-xl border border-line bg-surface px-4.5 py-3.5">
          <span>{tv(STR.dbName)}</span>
          <a
            href="https://epv.afa.gov.tw/"
            target="_blank"
            rel="noopener"
            className="text-[12px] font-bold text-both"
          >
            epv.afa.gov.tw →
          </a>
        </div>

        <h3 className="mb-2 mt-5.5 text-[15.5px] text-ink">{tv(STR.miniMapTitle)}</h3>
        <div className="flex flex-col items-start gap-2 rounded-[14px] border border-line bg-surface p-3.5">
          <CountyLeafletMap counts={counts} heightClass="h-[260px]" interactive={false} zoom={6.3} />
          <Link to="/map" className="self-end text-[12px] font-bold text-both">
            {tv(STR.miniMapCta)}
          </Link>
        </div>
      </div>
    </div>
  );
}
