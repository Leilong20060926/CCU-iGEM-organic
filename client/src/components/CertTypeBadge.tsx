import { useLang } from "../context/LangContext";
import { STR } from "../data/content";
import type { CertType } from "../types";

export default function CertTypeBadge({ certType }: { certType: CertType }) {
  const { tv } = useLang();
  const isOrganic = certType === "organic";
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
        isOrganic ? "bg-organic-soft text-organic" : "bg-friendly-soft text-friendly"
      }`}
    >
      {isOrganic ? "🌱" : "🤝"} {tv(isOrganic ? STR.organicTag : STR.friendlyTag)}
    </span>
  );
}
