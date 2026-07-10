import { useLang } from "../context/LangContext";
import { STATUS_COLOR, STATUS_LABELS } from "../data/content";

const COLOR_CLASSES: Record<string, string> = {
  organic: "bg-organic-soft text-organic",
  "ink-soft": "bg-paper-deep text-ink-soft",
  friendly: "bg-friendly-soft text-friendly",
  seal: "bg-seal-soft text-seal",
};

export default function StatusBadge({ status }: { status: string }) {
  const { tv } = useLang();
  const color = STATUS_COLOR[status] || "ink-soft";
  const label = STATUS_LABELS[status] ? tv(STATUS_LABELS[status]) : status;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${COLOR_CLASSES[color]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
