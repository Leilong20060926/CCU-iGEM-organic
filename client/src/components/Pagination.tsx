interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1].filter((p) => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);

  const items: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push("…");
    items.push(p);
    prev = p;
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      <button
        className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-paper-deep disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ←
      </button>
      {items.map((it, i) =>
        it === "…" ? (
          <span key={`e${i}`} className="px-1.5 text-xs text-ink-soft">
            …
          </span>
        ) : (
          <button
            key={it}
            onClick={() => onChange(it)}
            className={`min-w-8 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${
              it === page ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:bg-paper-deep"
            }`}
          >
            {it}
          </button>
        )
      )}
      <button
        className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-paper-deep disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        →
      </button>
    </div>
  );
}
