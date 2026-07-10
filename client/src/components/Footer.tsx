import { useLang } from "../context/LangContext";
import { STR } from "../data/content";

export default function Footer() {
  const { tv } = useLang();
  return (
    <footer className="border-t border-line py-5.5 text-center text-[11.5px] text-ink-soft">
      <div className="mx-auto max-w-[1080px] px-8">{tv(STR.footer)}</div>
    </footer>
  );
}
