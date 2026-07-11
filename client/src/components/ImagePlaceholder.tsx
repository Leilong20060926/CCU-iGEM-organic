export default function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-line bg-paper-deep text-ink-soft ${className}`}
    >
      <span className="text-[26px] opacity-60">🖼️</span>
    </div>
  );
}
