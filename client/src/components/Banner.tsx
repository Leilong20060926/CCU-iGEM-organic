import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { STR } from "../data/content";
import { listOperators } from "../api/organic";
import type { Operator } from "../types";
import Spinner from "./Spinner";

export default function Banner() {
  const { lang, tv, toggleLang } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Operator[] | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setResults(null);
      return;
    }
    const handle = setTimeout(() => {
      listOperators({ search: query, pageSize: 8 })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(handle);
  }, [q]);

  function submitSearch() {
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-[60] border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1080px] items-center gap-4.5 px-8 py-3.5 max-[720px]:px-4.5">
        <Link to="/" className="flex flex-none items-center gap-2.5">
          <img
            src="/assets/logo.png"
            alt="NoFold"
            className="block h-[42px] w-[42px] flex-none -rotate-6 rounded-full border-[2.5px] border-seal object-cover"
          />
          <div className="leading-[1.05]">
            <span className="block text-[19px] font-bold">{STR.appNameZh}</span>
            <span className="block text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">
              {STR.appNameEn}
            </span>
          </div>
        </Link>

        <nav className="ml-auto flex flex-wrap items-center gap-1">
          <Link to="/info" className="hidden rounded-full px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink min-[521px]:inline">
            {tv(STR.info)}
          </Link>
          <Link to="/about" className="hidden rounded-full px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink min-[521px]:inline">
            {tv(STR.about)}
          </Link>
          <Link to="/map" className="rounded-full px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink">
            {tv(STR.mapNav)}
          </Link>

          <div className="relative" ref={wrapRef}>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3.5 text-[13px] text-ink-soft">🔍</span>
              <input
                className="w-[190px] rounded-full border-[1.5px] border-line bg-surface py-2 pl-8.5 pr-3.5 text-[13.5px] text-ink placeholder:text-ink-soft focus:border-both focus:shadow-[0_0_0_3px_var(--color-both-soft)] focus:outline-none max-[640px]:w-[120px]"
                type="text"
                placeholder={tv(STR.searchPh)}
                value={q}
                onFocus={() => setOpen(true)}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              />
            </div>
            {open && (
              <div className="absolute right-0 top-12 z-[70] w-[min(360px,88vw)] rounded-xl border border-line bg-surface p-2.5 card-shadow">
                <div className="max-h-[300px] overflow-auto">
                  {!q.trim() && <div className="px-1.5 py-2 text-[13px] text-ink-soft">{tv(STR.searchPh)}</div>}
                  {q.trim() && results === null && <Spinner variant="compact" />}
                  {q.trim() && results && results.length === 0 && (
                    <div className="px-1.5 py-2 text-[13px] text-ink-soft">{tv(STR.noResult)}</div>
                  )}
                  {results?.map((op) => (
                    <Link
                      key={op.id}
                      to={`/operator/${op.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-1.5 py-2 hover:bg-paper-deep"
                    >
                      <div>
                        <div className="text-[13.5px] font-bold">
                          {op.Name}{" "}
                          <span className="font-normal text-[11px] text-ink-soft">{op.county}</span>
                        </div>
                        <div className="text-[11px] text-ink-soft">{op.Products}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold tracking-wide hover:bg-paper-deep"
            onClick={toggleLang}
          >
            {lang === "zh" ? "EN" : "中"}
          </button>
        </nav>
      </div>
    </header>
  );
}
