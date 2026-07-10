import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { GEOCODE_PRECISION_LABEL, STR } from "../data/content";
import { geocodeOperator, getOperator } from "../api/organic";
import type { GeocodeResult, Operator } from "../types";
import BackLink from "../components/BackLink";
import StatusBadge from "../components/StatusBadge";
import CountyLeafletMap from "../components/CountyLeafletMap";
import AddressPinMap from "../components/AddressPinMap";
import { countyPoint } from "../data/countyMap";

function splitList(value: string): string[] {
  return value
    .split("、")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function OperatorDetailPage() {
  const { id = "" } = useParams();
  const { tv } = useLang();
  const [op, setOp] = useState<Operator | null>(null);
  const [error, setError] = useState(false);
  const [geocode, setGeocode] = useState<GeocodeResult | null>(null);
  const [geocoding, setGeocoding] = useState(true);

  useEffect(() => {
    setOp(null);
    setError(false);
    getOperator(id)
      .then(setOp)
      .catch(() => setError(true));
  }, [id]);

  useEffect(() => {
    setGeocode(null);
    setGeocoding(true);
    geocodeOperator(id)
      .then(setGeocode)
      .catch(() => setGeocode(null))
      .finally(() => setGeocoding(false));
  }, [id]);

  if (error) return <div className="text-sm text-ink-soft">{tv(STR.noResult)}</div>;
  if (!op) return <div className="text-sm text-ink-soft">…</div>;

  const crops = splitList(op.ContainCrops);
  const categories = splitList(op.Products);

  return (
    <div>
      <BackLink to="/">{tv(STR.back)}</BackLink>

      <div className="flex flex-wrap items-start gap-7.5">
        <div className="w-[320px] flex-none overflow-hidden rounded-[22px] border-[3px] border-ink bg-surface game-card-shadow max-[400px]:w-full">
          <div className="bg-ink px-4.5 py-3.5 text-center text-paper">
            <div className="text-[19px] font-bold">{op.Name}</div>
            <div className="text-[10.5px] uppercase tracking-[0.1em] opacity-75">{op.CompanyName}</div>
          </div>
          <div
            className="relative flex h-[110px] items-center justify-center border-b-2 border-dashed border-line text-[56px]"
            style={{
              background:
                "repeating-linear-gradient(135deg, var(--color-paper-deep), var(--color-paper-deep) 10px, var(--color-paper) 10px, var(--color-paper) 20px)",
            }}
          >
            <div className="absolute left-2.5 top-2.5">
              <StatusBadge status={op.Status} />
            </div>
            🌾
          </div>
          <div className="px-4.5 py-4">
            <div className="flex justify-between border-b border-dashed border-line py-1.5 text-[12.5px]">
              <span className="text-ink-soft">{tv(STR.certExpiry)}</span>
              <span className="font-mono font-bold">{op.EffectiveDate}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-line py-1.5 text-[12.5px]">
              <span className="text-ink-soft">{tv(STR.phone)}</span>
              <span className="font-mono font-bold">{op.Tel || "—"}</span>
            </div>
            <div className="flex justify-between py-1.5 text-[12.5px]">
              <span className="text-ink-soft">{tv(STR.county)}</span>
              <span className="font-bold">{op.county || "—"}</span>
            </div>
          </div>
        </div>

        <div className="min-w-[280px] flex-[1_1_380px]">
          <div className="mb-4 rounded-[14px] border border-line bg-surface p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm">
              <span className="flex h-7.5 w-7.5 -rotate-[8deg] items-center justify-center rounded-full border-2 border-seal text-[13px] font-black text-seal">
                證
              </span>
              {tv(STR.certBlock)}
            </h3>
            <div className="grid grid-cols-[110px_1fr] gap-x-2.5 gap-y-2 text-[13px]">
              <div className="text-ink-soft">{tv(STR.certNo)}</div>
              <div className="font-mono font-semibold">{op.CertOrganicSn}</div>
              {op.OldCertOrganicSN && (
                <>
                  <div className="text-ink-soft">{tv(STR.oldCertNo)}</div>
                  <div className="font-mono font-semibold">{op.OldCertOrganicSN}</div>
                </>
              )}
              <div className="text-ink-soft">{tv(STR.certAgency)}</div>
              <div className="font-semibold">{op.CompanyName}</div>
              <div className="text-ink-soft">{tv(STR.certExpiry)}</div>
              <div className="font-mono font-semibold">{op.EffectiveDate}</div>
              <div className="text-ink-soft">{tv(STR.certStatus)}</div>
              <div>
                <StatusBadge status={op.Status} />
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-[14px] border border-line bg-surface p-5">
            <h3 className="mb-3 text-sm">📍 {tv(STR.contactBlock)}</h3>
            <div className="grid grid-cols-[110px_1fr] gap-x-2.5 gap-y-2 text-[13px]">
              <div className="text-ink-soft">{tv(STR.phone)}</div>
              <div className="font-mono font-semibold">{op.Tel || "—"}</div>
              <div className="text-ink-soft">{tv(STR.address)}</div>
              <div className="font-semibold">{op.Address}</div>
              {op.MailingAddress && op.MailingAddress !== op.Address && (
                <>
                  <div className="text-ink-soft">{tv(STR.mailingAddress)}</div>
                  <div className="font-semibold">{op.MailingAddress}</div>
                </>
              )}
            </div>

            {op.county &&
              (() => {
                const fallbackPoint = countyPoint(op.county!);
                if (!fallbackPoint) return null;
                return (
                  <div className="mt-3.5 flex flex-col items-start gap-1.5">
                    {geocode ? (
                      <AddressPinMap
                        lat={geocode.lat}
                        lng={geocode.lng}
                        precision={geocode.precision}
                        heightClass="h-[200px]"
                      />
                    ) : (
                      <CountyLeafletMap
                        counts={{ [op.county!]: 1 }}
                        selected={op.county}
                        center={[fallbackPoint.lat, fallbackPoint.lng]}
                        zoom={10.5}
                        heightClass="h-[200px]"
                        interactive={false}
                      />
                    )}
                    <p className="text-[11px] text-ink-soft">
                      {geocoding ? tv(STR.geocoding) : tv(GEOCODE_PRECISION_LABEL[geocode?.precision ?? "county"])}
                    </p>
                    <Link
                      to={`/map?county=${encodeURIComponent(op.county!)}`}
                      className="self-end text-[12px] font-bold text-both"
                    >
                      {tv(STR.viewMap)}
                    </Link>
                  </div>
                );
              })()}
          </div>

          <div className="mb-4 rounded-[14px] border border-line bg-surface p-5">
            <h3 className="mb-3 text-sm">🏷️ {tv(STR.categoriesBlock)}</h3>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span key={c} className="rounded-full bg-organic-soft px-2.5 py-1 text-[11.5px] font-semibold text-organic">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4 rounded-[14px] border border-line bg-surface p-5">
            <h3 className="mb-1 text-sm">🌱 {tv(STR.cropsBlock)}</h3>
            <p className="mb-3 text-[12px] text-ink-soft">{tv(STR.cropsNote)}</p>
            <div className="flex flex-wrap gap-1.5">
              {crops.map((c, i) => (
                <span key={`${c}-${i}`} className="rounded-md bg-paper-deep px-2 py-1 text-[12px] text-ink-soft">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
