import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { STR } from "../data/content";
import { CATEGORY_COLOR_CLASS } from "../data/categoryColors";
import { useMeta } from "../hooks/useMeta";
import Tile from "../components/Tile";
import Spinner from "../components/Spinner";

export default function Home() {
  const { lang, tv } = useLang();
  const { meta, loading } = useMeta();

  return (
    <div>
      <section className="mb-6.5 flex flex-wrap items-center justify-between gap-6.5 border-b border-line pb-7.5 pt-6.5">
        <div className="max-w-[480px]">
          <h1 className="mb-2.5 text-[clamp(26px,4vw,38px)] leading-[1.25]">
            {lang === "zh" ? (
              <>
                查詢全台認證的
                <br />
                有機好食材
              </>
            ) : (
              <>
                Find certified organic
                <br />
                produce you can trust
              </>
            )}
          </h1>
          <p className="text-[14.5px] text-ink-soft">{tv(STR.heroP)}</p>
        </div>
        <div className="seal-ring relative flex h-[118px] w-[118px] flex-none rotate-6 items-center justify-center whitespace-pre-line rounded-full border-[3px] border-seal text-center font-serif text-[15px] font-black leading-[1.3] text-seal">
          {tv(STR.heroStamp)}
        </div>
      </section>

      <Link
        to="/map"
        className="mb-7.5 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-both bg-both-soft px-5 py-4"
      >
        <div>
          <div className="text-[15.5px] font-bold">{tv(STR.goMap)}</div>
          <div className="text-[12.5px] text-ink-soft">{tv(STR.goMapSub)}</div>
        </div>
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ink px-4.5 py-2.5 text-sm font-semibold text-paper">
          {tv(STR.viewMap)}
        </span>
      </Link>

      <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">
        {tv(STR.categories)}
      </div>
      <div className="grid grid-cols-3 gap-4 max-[860px]:grid-cols-2">
        {loading && (
          <div className="col-span-full">
            <Spinner />
          </div>
        )}
        {meta?.categories.map((c) => (
          <Tile
            key={c.id}
            to={`/category/${c.id}`}
            icon={c.icon}
            zh={c.zh}
            en={c.en}
            colorClass={CATEGORY_COLOR_CLASS[c.id]}
            count={c.count}
          />
        ))}
      </div>
    </div>
  );
}
