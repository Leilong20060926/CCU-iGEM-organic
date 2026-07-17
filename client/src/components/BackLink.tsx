import React from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

// Goes back in browser history when the user navigated here within the app,
// so list filters/pagination survive; `to` is the fallback for direct visits
// (deep link, refresh, new tab) where "back" would leave the site.
export default function BackLink({ to, children }: { to: string; children: ReactNode }) {
  const navigate = useNavigate();
  const hasInAppHistory = typeof window !== "undefined" && (window.history.state?.idx ?? 0) > 0;

  function handleClick() {
    // Derive the visible label from children and use it to decide behavior.
    // If the label clearly indicates "home" (e.g. "回首頁" / "Back to home"),
    // always navigate to the provided `to` (typically `/`). Otherwise prefer
    // navigating back in history when available so filters/pagination survive.
    const label = React.Children.toArray(children)
      .map((c) => (typeof c === "string" ? c : (c as any)?.props?.children ?? ""))
      .join("")
      .trim()
      .toLowerCase();

    const isHomeLabel = label.includes("回首頁") || label.includes("back to home") || label === "home";

    if (isHomeLabel) {
      navigate(to);
      return;
    }

    if (hasInAppHistory) {
      navigate(-1);
    } else {
      navigate(to);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="mb-3.5 inline-flex items-center gap-1.5 px-1 py-1.5 text-sm text-ink-soft hover:text-ink"
    >
      ← {children}
    </button>
  );
}
