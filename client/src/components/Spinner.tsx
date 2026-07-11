interface Props {
  /** compact: inline size for panels/dropdowns; page: centered with generous padding */
  variant?: "page" | "compact";
}

export default function Spinner({ variant = "page" }: Props) {
  const ring = (
    <span
      role="status"
      aria-label="loading"
      className={`inline-block animate-spin rounded-full border-line border-t-seal ${
        variant === "page" ? "h-8 w-8 border-[3px]" : "h-4.5 w-4.5 border-2"
      }`}
    />
  );

  if (variant === "compact") {
    return <span className="inline-flex items-center px-1.5 py-2">{ring}</span>;
  }
  return <div className="flex justify-center py-12">{ring}</div>;
}
