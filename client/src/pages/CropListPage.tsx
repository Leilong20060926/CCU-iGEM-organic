import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { STR } from "../data/content";
import { getCropImageSrc } from "../data/cropImages.ts";
import { useMeta } from "../hooks/useMeta";
import { getCrops } from "../api/organic";
import type { CropCount } from "../types";
import BackLink from "../components/BackLink";
import ImagePlaceholder from "../components/ImagePlaceholder";
import Spinner from "../components/Spinner";

export default function CropListPage() {
  const { catId = "", sub } = useParams();
  const { lang, tv } = useLang();
  const { meta } = useMeta();
  const [crops, setCrops] = useState<CropCount[] | null>(null);

  useEffect(() => {
    setCrops(null);
    getCrops(catId, sub).then(setCrops);
  }, [catId, sub]);

  const cat = meta?.categories.find((c) => c.id === catId);
  const subMeta = sub ? cat?.subs?.find((s) => s.id === sub) : null;
  const title = cat ? (subMeta ? (lang === "zh" ? subMeta.zh : subMeta.en) : lang === "zh" ? cat.zh : cat.en) : "…";
  const backTo = cat?.subs ? `/category/${catId}` : "/";
  const basePath = sub ? `/category/${catId}/${sub}` : `/category/${catId}`;

  return (
    <div>
      <BackLink to={backTo}>{tv(STR.back)}</BackLink>
      <div className="mb-1 mt-0.5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[26px] font-bold">{title}</h2>
        <Link to={`${basePath}/crop/_all`} className="text-[12.5px] font-bold text-both">
          {tv(STR.viewAllInCategory)}
        </Link>
      </div>
      <p className="mb-5.5 text-[13px] text-ink-soft">{tv(STR.cropListTitle)}</p>

      {!crops && <Spinner />}
      {crops && crops.length === 0 && <div className="text-sm text-ink-soft">{tv(STR.noResult)}</div>}

      <div className="grid grid-cols-4 gap-4 max-[860px]:grid-cols-3 max-[520px]:grid-cols-2">
        {crops?.map((crop) => (
          <Link
            key={crop.name}
            to={`${basePath}/crop/${encodeURIComponent(crop.name)}`}
            className="rounded-[14px] border border-line bg-surface p-3 text-center transition-transform hover:-translate-y-0.5 hover:card-shadow"
          >
            <ImagePlaceholder className="mb-2.5" src={getCropImageSrc(crop.name)} alt={crop.name} />
            <div className="text-[13.5px] font-bold">{crop.name}</div>
            <div className="mt-0.5 text-[11px] text-ink-soft">{crop.count.toLocaleString()}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
