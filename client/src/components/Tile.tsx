import { Link } from "react-router-dom";

interface Props {
  to: string;
  icon?: string;
  zh: string;
  en: string;
  colorClass?: string;
  count?: number;
}

export default function Tile({ to, icon, zh, en, colorClass, count }: Props) {
  return (
    <Link
      to={to}
      className="relative overflow-hidden rounded-[14px] border border-line bg-surface p-4.5 text-center transition-transform hover:-translate-y-0.5 hover:card-shadow"
    >
      {colorClass && <span className={`absolute inset-y-0 left-0 w-[5px] ${colorClass}`} />}
      {icon && <div className="mb-2 text-[34px]">{icon}</div>}
      <div className="text-[14.5px] font-bold">{zh}</div>
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-ink-soft">{en}</div>
      {typeof count === "number" && (
        <div className="mt-1 text-[10.5px] text-ink-soft">{count.toLocaleString()}</div>
      )}
    </Link>
  );
}
