import type { ReactNode } from "react";
import { useLanguage } from "../content/LanguageProvider";

const illustrations: Record<string, ReactNode> = {
  "Intelligent Optimization": <>
    <path d="M12 8v44h96M22 16c14 0 14 29 34 29s21-24 43-29" />
    <circle cx="56" cy="45" r="8" /><circle cx="56" cy="45" r="2" />
    <path d="m34 27 9 8m-1-7 1 7-7-1M81 27l-9 8m1-7-1 7 7-1" />
  </>,
  "Multi-objective Metaheuristics": <>
    <path d="M14 8v44h94M29 17c3 23 24 28 65 28" strokeDasharray="3 3" />
    {[[29,17],[35,31],[47,39],[65,43],[94,45]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="3" />)}
    <path d="m21 5-7 3 7 3m84 34 3 7-7-3" />
    <circle cx="66" cy="20" r="2" /><circle cx="88" cy="29" r="2" />
  </>,
  "Workflow Scheduling": <>
    <path d="M24 8v44h84M34 8v44M58 8v44M82 8v44" opacity=".35" />
    <path d="M10 18h7M10 31h7M10 44h7" />
    <rect x="28" y="13" width="25" height="9" rx="2" />
    <rect x="55" y="26" width="27" height="9" rx="2" />
    <rect x="84" y="39" width="20" height="9" rx="2" />
    <path d="M53 18h5v8m24 5h6v8" />
  </>,
  "Cloud Computing": <>
    <path d="M34 34a10 10 0 0 1-1-20 15 15 0 0 1 28-4 12 12 0 0 1 23 7 9 9 0 0 1 1 17Z" />
    <path d="M59 34v9M27 43h64M27 43v5m32-5v5m32-5v5" />
    {[18,50,82].map(x => <rect key={x} x={x} y="48" width="18" height="9" rx="2" />)}
  </>,
  "Computational Resource Allocation": <>
    <rect x="44" y="5" width="32" height="17" rx="3" />
    <path d="M50 11h20m-20 5h13M60 22v10M23 32h74M23 32v9m37-9v9m37-9v9m-78-4 4 4 4-4m29 0 4 4 4-4m29 0 4 4 4-4" />
    {[10,47,84].map(x => <rect key={x} x={x} y="42" width="26" height="13" rx="2" />)}
  </>,
  "Data Preprocessing": <>
    {[[12,13],[25,9],[14,27],[29,24],[21,40],[10,47]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />)}
    <path d="M39 12h32L60 30v13l-10 5V30ZM73 30h13m-4-4 4 4-4 4" />
    <rect x="91" y="13" width="20" height="34" rx="2" />
    <path d="M91 24h20M91 35h20m-10-22v34" />
  </>,
  "Experimental Analysis": <>
    <path d="M22 8h19M26 8v14L14 44a6 6 0 0 0 5 9h26a6 6 0 0 0 5-9L37 22V8M20 35h23" />
    <circle cx="28" cy="43" r="2" /><circle cx="37" cy="46" r="2" />
    <path d="M66 12v41h43" />
    <rect x="73" y="33" width="8" height="20" rx="1" />
    <rect x="87" y="23" width="8" height="30" rx="1" />
    <path d="M73 28h8m-4-4v8m10-14h8m-4-4v8" />
  </>,
  "Data Analysis": <>
    <path d="M13 10v42h58M23 40l12-12 12 7 16-17" />
    <rect x="22" y="43" width="7" height="9" rx="1" />
    <rect x="37" y="37" width="7" height="15" rx="1" />
    <rect x="52" y="32" width="7" height="20" rx="1" />
    <circle cx="87" cy="25" r="14" /><path d="m97 35 14 15M80 28l5-8 5 4 4-7" />
  </>,
};

export default function ResearchAreaIllustration({ area, className }: { area: string; className: string }) {
  const { t } = useLanguage();
  return <svg className={className} viewBox="0 0 120 60" role="img" aria-label={`${t(area)} · ${t("Illustration")}`}>
    {illustrations[area]}
  </svg>;
}
