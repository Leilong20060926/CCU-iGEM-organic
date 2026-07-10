import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export default function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="mb-3.5 inline-flex items-center gap-1.5 px-1 py-1.5 text-sm text-ink-soft hover:text-ink">
      ← {children}
    </Link>
  );
}
