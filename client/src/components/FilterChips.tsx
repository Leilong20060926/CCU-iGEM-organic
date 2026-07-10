interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterChips({ options, value, onChange }: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold ${
            value === opt.value
              ? "border-ink bg-ink text-paper"
              : "border-line bg-surface text-ink-soft hover:bg-paper-deep"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
