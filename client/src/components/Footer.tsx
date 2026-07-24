import { useLang } from "../context/LangContext";
import { STR } from "../data/content";

export default function Footer() {
  const { tv } = useLang();
  return (
    <footer className="border-t border-line py-6 text-center text-[11.5px] text-ink-soft">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-3 px-8">
        <div className="flex items-center gap-5">
          <a href="https://www.ccu.edu.tw" target="_blank" rel="noopener" aria-label="National Chung Cheng University">
            <img src="/assets/ccu-logo.png" alt="國立中正大學 NCCU" className="h-9 w-auto opacity-90 grayscale transition hover:opacity-100 hover:grayscale-0" />
          </a>
          <span className="h-6 w-px bg-line" />
          <a href="https://igem.ccu.edu.tw" target="_blank" rel="noopener" aria-label="CCU-Taiwan iGEM Team">
            <img src="/assets/logo.png" alt="No Fold, CCU-Taiwan iGEM" className="h-9 w-9 rounded-full object-cover opacity-90 grayscale transition hover:opacity-100 hover:grayscale-0" />
          </a>
        </div>
        <div>{tv(STR.footer)}</div>
      </div>
    </footer>
  );
}
