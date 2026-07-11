import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

// Goes back in browser history when the user navigated here within the app,
// so list filters/pagination survive; `to` is the fallback for direct visits
// (deep link, refresh, new tab) where "back" would leave the site.
export default function BackLink({ to, children }: { to: string; children: ReactNode }) {
  const navigate = useNavigate();
  const hasInAppHistory = typeof window !== "undefined" && (window.history.state?.idx ?? 0) > 0;

  return (
    <button
      onClick={() => (hasInAppHistory ? navigate(-1) : navigate(to))}
      className="mb-3.5 inline-flex items-center gap-1.5 px-1 py-1.5 text-sm text-ink-soft hover:text-ink"
    >
      ← {children}
    </button>
  );
}
