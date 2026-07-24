import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { STR } from "../data/content";
import { getAllCrops, getCropCounties } from "../api/organic";
import { COUNTY_POINTS, type CountyPoint } from "../data/countyMap";
import { distanceKm } from "../lib/distance";
import type { CropCount } from "../types";
import Spinner from "./Spinner";

type LocState = { status: "idle" | "locating" | "ready" | "error"; coords?: { lat: number; lng: number } };

export default function NearestVendorFinder() {
  const { tv } = useLang();
  const [allCrops, setAllCrops] = useState<CropCount[] | null>(null);
  const [crop, setCrop] = useState("");
  const [loc, setLoc] = useState<LocState>({ status: "idle" });
  const [countyCounts, setCountyCounts] = useState<CropCount[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchedCrop, setSearchedCrop] = useState<string | null>(null);

  useEffect(() => {
    getAllCrops()
      .then(setAllCrops)
      .catch(() => setAllCrops([]));
  }, []);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLoc({ status: "error" });
      return;
    }
    setLoc({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ status: "ready", coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      () => setLoc({ status: "error" }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const matchedCrop = useMemo(() => {
    const trimmed = crop.trim();
    if (!trimmed || !allCrops) return null;
    return allCrops.find((c) => c.name === trimmed) ?? null;
  }, [crop, allCrops]);

  function search() {
    if (!matchedCrop || loc.status !== "ready" || !loc.coords) return;
    setSearching(true);
    setSearchedCrop(matchedCrop.name);
    getCropCounties(matchedCrop.name)
      .then(setCountyCounts)
      .finally(() => setSearching(false));
  }

  const ranked = useMemo(() => {
    if (!countyCounts || loc.status !== "ready" || !loc.coords) return null;
    const userCoords = loc.coords;
    return countyCounts
      .map((c) => {
        const point = COUNTY_POINTS.find((p) => p.name === c.name);
        return point ? { ...c, point, km: distanceKm(userCoords, point) } : null;
      })
      .filter((x): x is CropCount & { point: CountyPoint; km: number } => x !== null)
      .sort((a, b) => a.km - b.km);
  }, [countyCounts, loc]);

  const canSearch = !!matchedCrop && loc.status === "ready";

  return (
    <div className="mb-6.5 rounded-[14px] border border-line bg-surface p-5">
      <h3 className="text-[15.5px] font-bold">{tv(STR.nearestFinderTitle)}</h3>
      <p className="mb-3.5 text-[12.5px] text-ink-soft">{tv(STR.nearestFinderSub)}</p>

      <div className="flex flex-wrap items-center gap-2.5">
        <input
          list="crop-options"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder={tv(STR.cropInputPh)}
          className="w-[220px] rounded-full border-[1.5px] border-line bg-paper px-4 py-2 text-[13.5px] text-ink placeholder:text-ink-soft focus:border-both focus:outline-none"
        />
        <datalist id="crop-options">
          {allCrops?.map((c) => <option key={c.name} value={c.name} />)}
        </datalist>

        <button
          onClick={useMyLocation}
          className="rounded-full border border-line bg-paper px-4 py-2 text-[13.5px] font-semibold text-ink hover:bg-paper-deep"
        >
          {loc.status === "locating" ? tv(STR.locating) : tv(STR.useMyLocation)}
          {loc.status === "ready" && " ✓"}
        </button>

        <button
          onClick={search}
          disabled={!canSearch}
          className="rounded-full bg-ink px-5 py-2 text-[13.5px] font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          {tv(STR.viewOperators).replace(" →", "")}
        </button>
      </div>

      {crop.trim() && !matchedCrop && allCrops && (
        <p className="mt-2.5 text-[12px] text-friendly">{tv(STR.noCropMatch)}</p>
      )}
      {loc.status === "error" && <p className="mt-2.5 text-[12px] text-friendly">{tv(STR.locationDenied)}</p>}

      {searching && <div className="mt-4"><Spinner variant="compact" /></div>}

      {!searching && searchedCrop && ranked && (
        <div className="mt-4 border-t border-line pt-4">
          {ranked.length === 0 ? (
            <p className="text-[13px] text-ink-soft">{tv(STR.noVendorForCrop)}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {ranked.slice(0, 8).map((c, i) => (
                <Link
                  key={c.name}
                  to={`/search?crop=${encodeURIComponent(searchedCrop)}&county=${encodeURIComponent(c.name)}`}
                  className="flex items-center justify-between gap-2.5 rounded-[10px] border border-line bg-paper px-4 py-2.5 hover:border-both"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-both-soft text-[11px] font-bold text-both">
                      {i + 1}
                    </span>
                    <span className="text-[13.5px] font-bold">{c.name}</span>
                    <span className="text-[11.5px] text-ink-soft">{c.count.toLocaleString()} 家</span>
                  </span>
                  <span className="whitespace-nowrap text-[12.5px] font-semibold text-both">
                    {c.km.toFixed(1)} {tv(STR.awayFromYou)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
