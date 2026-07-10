import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "../types";

interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
  tv: (obj: Record<Lang, string>) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

function readStoredLang(): Lang {
  return localStorage.getItem("lang") === "en" ? "en" : "zh";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang);
  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      toggleLang: () =>
        setLang((l) => {
          const next = l === "zh" ? "en" : "zh";
          localStorage.setItem("lang", next);
          return next;
        }),
      tv: (obj) => obj[lang],
    }),
    [lang]
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
