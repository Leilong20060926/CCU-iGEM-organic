import { useLang } from "../context/LangContext";
import { ABOUT_LINKS, STR } from "../data/content";
import BackLink from "../components/BackLink";

export default function AboutPage() {
  const { tv } = useLang();
  return (
    <div>
      <BackLink to="/">{tv(STR.backHome)}</BackLink>
      <h2 className="mb-4 mt-0.5 text-[26px] font-bold">{tv(STR.aboutTitle)}</h2>
      <div className="text-[14.5px] leading-[1.9] text-ink-soft">
        <h3 className="mb-2 mt-5.5 text-[15.5px] text-ink">{tv(STR.aboutIntro)}</h3>
        {tv(STR.aboutBody)
          .split("\n")
          .map((line, i) => (
            <p key={i}>{line}</p>
          ))}

        <h3 className="mb-2 mt-5.5 text-[15.5px] text-ink">{tv(STR.aboutLinksTitle)}</h3>
        {ABOUT_LINKS.map((l) => (
          <div key={l.url} className="my-2.5 flex items-center justify-between gap-2.5 rounded-xl border border-line bg-surface px-4.5 py-3.5">
            <span className="flex items-center gap-2.5">
              <span className="text-[18px]">{l.icon}</span>
              {tv(l)}
            </span>
            <a href={l.url} target="_blank" rel="noopener" className="text-[12px] font-bold text-both">
              {l.url.replace(/^https?:\/\//, "")} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
