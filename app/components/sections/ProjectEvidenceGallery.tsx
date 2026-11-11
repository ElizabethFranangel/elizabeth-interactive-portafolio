"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../content/LanguageProvider";
import styles from "./ProjectEvidenceGallery.module.css";
import { projectEvidence } from "../../lib/project-evidence";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const imagePath = (filename: string) => `${basePath}/images/project-evidence/${filename}`;

export default function ProjectEvidenceGallery({ project = "portfolio" }: { project?: "portfolio" | "gym" }) {
  const evidence = projectEvidence[project];
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [theme, setTheme] = useState("light");
  const dialog = useRef<HTMLDialogElement>(null);
  const panels = useRef<(HTMLButtonElement | null)[]>([]);
  const headingId = useId();

  useEffect(() => {
    if (selected !== null && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [selected]);

  const open = (index: number, element: HTMLButtonElement) => {
    setTheme(element.closest<HTMLElement>("[data-theme]")?.dataset.theme || "light");
    setActive(index);
    setSelected(index);
  };
  const close = () => { setSelected(null); panels.current[active]?.focus({ preventScroll: true }); };
  const move = (direction: number) => {
    const next = (active + direction + evidence.length) % evidence.length;
    setActive(next);
    requestAnimationFrame(() => panels.current[next]?.focus({ preventScroll: true }));
  };

  const groupStart = Math.floor(active / 4) * 4;
  return <section className={styles.gallery} data-project-evidence={project} aria-label={`${t("Project evidence")}: ${t(project === "gym" ? "Gym Management & Point-of-Sale System" : "Interactive Academic Portfolio")}`}>
    <p className={styles.eyebrow}>{t("Project evidence")}</p>
    <div className={styles.accordion} onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      if (event.key === "Home" || event.key === "End") {
        const next = event.key === "Home" ? 0 : evidence.length - 1;
        setActive(next); requestAnimationFrame(() => panels.current[next]?.focus({ preventScroll: true }));
      } else move(event.key === "ArrowRight" ? 1 : -1);
    }}>
      {evidence.slice(groupStart, groupStart + 4).map((item, offset) => {
        const index = groupStart + offset;
        return <button key={item.image} type="button"
        ref={element => { panels.current[index] = element; }} className={styles.panel}
        data-active={index === active} aria-label={`${t("Expand evidence")}: ${t(item.title)}`}
        aria-haspopup="dialog" onPointerEnter={event => { if (event.pointerType !== "touch") setActive(index); }}
        onFocus={() => setActive(index)} onClick={event => open(index, event.currentTarget)}
        data-hand-target data-hand-style="box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagePath(item.image)} alt={t(item.title)} style={{ objectPosition: item.position || "center" }} loading="lazy" draggable={false} />
        <span className={styles.shade} aria-hidden="true" />
        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.panelTitle}>{t(item.title)}</span>
        <span className={styles.expand} aria-hidden="true">↗</span>
      </button>; })}
    </div>
    <div className={styles.caption}>
      <div className={styles.navigation}>
        <button type="button" aria-label={t("Previous evidence")} onClick={() => move(-1)} data-hand-target data-hand-style="box">‹</button>
        <span aria-hidden="true">{String(active + 1).padStart(2, "0")} / {String(evidence.length).padStart(2, "0")}</span>
        <button type="button" aria-label={t("Next evidence")} onClick={() => move(1)} data-hand-target data-hand-style="box">›</button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true">{t(evidence[active].description)}</p>
    </div>
    {selected !== null && createPortal(<dialog ref={dialog} className={styles.dialog} data-theme={theme}
      tabIndex={-1} autoFocus aria-labelledby={headingId} onClose={close}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close();
      }} onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault(); event.stopPropagation();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const next = (selected + direction + evidence.length) % evidence.length;
        setSelected(next); setActive(next);
      }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imagePath(evidence[selected].image)} alt={t(evidence[selected].title)} draggable={false} />
      <div className={styles.viewerFooter}>
        <button type="button" aria-label={t("Previous evidence")} onClick={() => { const next = (selected - 1 + evidence.length) % evidence.length; setSelected(next); setActive(next); }}>‹</button>
        <div><h2 id={headingId}>{t(evidence[selected].title)}</h2><p>{selected + 1} / {evidence.length}</p></div>
        <button type="button" aria-label={t("Next evidence")} onClick={() => { const next = (selected + 1) % evidence.length; setSelected(next); setActive(next); }}>›</button>
      </div>
      <p className={styles.hint}>{t("Click outside or press Escape to close")}</p>
    </dialog>, document.body)}
  </section>;
}
