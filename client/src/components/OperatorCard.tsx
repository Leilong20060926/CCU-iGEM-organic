import { Link } from "react-router-dom";
import type { Operator } from "../types";
import StatusBadge from "./StatusBadge";

export default function OperatorCard({ op }: { op: Operator }) {
  return (
    <Link
      to={`/operator/${op.id}`}
      className="block rounded-[14px] border border-line bg-surface p-3.5 transition-transform hover:-translate-y-0.5 hover:card-shadow"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-[11.5px] text-ink-soft">{op.county ?? "—"}</span>
        <StatusBadge status={op.Status} />
      </div>
      <div className="text-[14.5px] font-bold">{op.Name}</div>
      <div className="mt-1 text-[11.5px] text-ink-soft">{op.CompanyName}</div>
      <div className="mt-2 line-clamp-2 text-[12px] text-ink-soft">{op.Products}</div>
    </Link>
  );
}
