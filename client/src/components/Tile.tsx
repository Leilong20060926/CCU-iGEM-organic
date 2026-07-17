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
      className="relative flex min-h-[170px] flex-col items-center justify-center overflow-hidden rounded-[14px] border border-line bg-surface p-4 text-center transition-transform hover:-translate-y-0.5 hover:card-shadow"
    >
      {colorClass && <span className={`absolute inset-y-0 left-0 w-[5px] ${colorClass}`} />}
      <div>
        <div className="text-[15px] font-bold text-ink">{zh}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-soft">{en}</div>
      </div>

      {icon && (
        <div className="my-2 grid w-full max-w-[180px] grid-cols-3 justify-items-center gap-2">
          {Array.from(icon).map((emoji, index) => (
            <span
              key={`${emoji}-${index}`}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-line bg-paper text-[24px] shadow-sm"
            >
              {emoji}
            </span>
          ))}
        </div>
      )}

      {typeof count === "number" && (
        <div className="absolute right-4 bottom-4 text-[11px] text-ink-soft">{count.toLocaleString()}</div>
      )}
    </Link>
  );
}
