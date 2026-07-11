import { Navigate, useParams } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { STR } from "../data/content";
import { useMeta } from "../hooks/useMeta";
import BackLink from "../components/BackLink";
import Tile from "../components/Tile";
import Spinner from "../components/Spinner";
import { CATEGORY_COLOR_CLASS } from "../data/categoryColors";

export default function CategoryPage() {
  const { catId = "" } = useParams();
  const { tv } = useLang();
  const { meta, loading } = useMeta();

  if (loading) return <Spinner />;

  const cat = meta?.categories.find((c) => c.id === catId);
  if (!cat) return <Navigate to="/" replace />;
  if (!cat.subs) return <Navigate to={`/category/${cat.id}/crops`} replace />;

  return (
    <div>
      <BackLink to="/">{tv(STR.backHome)}</BackLink>
      <h2 className="mb-1 mt-0.5 text-[26px] font-bold">
        {cat.zh} <span className="text-[15px] font-normal text-ink-soft">{cat.en}</span>
      </h2>
      <p className="mb-5.5 text-[13px] text-ink-soft">{tv(STR.subcatTitle)}</p>
      <div className="grid grid-cols-4 gap-4 max-[860px]:grid-cols-3 max-[520px]:grid-cols-2">
        {cat.subs.map((sub) => (
          <Tile
            key={sub.id}
            to={`/category/${cat.id}/${sub.id}`}
            zh={sub.zh}
            en={sub.en}
            colorClass={CATEGORY_COLOR_CLASS[cat.id]}
            count={sub.count}
          />
        ))}
      </div>
    </div>
  );
}
