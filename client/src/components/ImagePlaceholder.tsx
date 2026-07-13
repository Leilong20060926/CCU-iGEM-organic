interface ImagePlaceholderProps {
  className?: string;
  src?: string;
  alt?: string;
}

export default function ImagePlaceholder({ className = "", src, alt = "image" }: ImagePlaceholderProps) {
  if (src) {
    return <img src={src} alt={alt} className={`aspect-square w-full rounded-lg border border-line object-cover ${className}`} />;
  }

  return (
    <div
      className={`flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-line bg-paper-deep text-ink-soft ${className}`}
    >
      <span className="text-[26px] opacity-60">🖼️</span>
    </div>
  );
}
