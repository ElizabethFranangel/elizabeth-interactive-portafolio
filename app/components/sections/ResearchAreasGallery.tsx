"use client";

import { useLanguage } from "../content/LanguageProvider";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInteraction } from "../Interaction/InteractionContext";
import styles from "./ResearchAreasGallery.module.css";
import ResearchAreaIllustration from "./ResearchAreaIllustration";

const areas = [
  ["Intelligent Optimization", "Design of algorithms for solving complex optimization problems."],
  ["Multi-objective Metaheuristics", "Development of metaheuristic approaches for multiple conflicting objectives."],
  ["Workflow Scheduling", "Scheduling and allocation of computational workflows under multiple objectives."],
  ["Cloud Computing", "Efficient resource allocation and performance optimization in cloud environments."],
  ["Computational Resource Allocation", "Strategies to allocate resources efficiently and cost-effectively."],
  ["Data Preprocessing", "Acquisition, cleaning and preparation of data to improve quality and usability."],
  ["Experimental Analysis", "Comparative evaluation of algorithms using experiments and statistical analysis."],
  ["Data Analysis", "Exploratory analysis and extraction of insights from data."],
];

export default function ResearchAreasGallery() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const { inputMode, pointerRef, handTrackingEnabled, gestureStateRef } = useInteraction();
  const touchStart = useRef<number | null>(null);
  const galleryRoot = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const lastAdvance = useRef(0);
  const resetAutomatic = useRef(false);
  const alignSection = () => galleryRoot.current?.closest<HTMLElement>("[data-section-transition]")?.scrollIntoView({ block: "start", behavior: "instant" });
  const handleSelect = (index: number) => { resetAutomatic.current = true; setActive(index); alignSection(); };
  const handleMove = (direction: number) => { resetAutomatic.current = true; setActive(current => (current + direction + areas.length) % areas.length); alignSection(); };

  useEffect(() => {
    let direction = 0;
    let enteredSide = 0;
    let lastHoverStep = 0;
    lastAdvance.current = performance.now();
    const timer = window.setInterval(() => {
      const root = galleryRoot.current;
      const surface = stage.current;
      if (!root || !surface) return;
      const now = performance.now();
      if (resetAutomatic.current) { lastAdvance.current = now; resetAutomatic.current = false; }
      const bounds = surface.getBoundingClientRect();
      const visibleHeight = Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0);
      if (document.hidden || visibleHeight < bounds.height * .6) {
        lastAdvance.current = now;
        direction = 0;
        return;
      }
      const hand = inputMode === "hands" && handTrackingEnabled && gestureStateRef.current.gesture === "point"
        ? { x: pointerRef.current.x * innerWidth, y: pointerRef.current.y * innerHeight } : null;
      const point = inputMode === "hands" ? hand : mouse.current;
      const rootBounds = root.getBoundingClientRect();
      const interacting = !!point && point.x >= rootBounds.left && point.x <= rootBounds.right && point.y >= rootBounds.top && point.y <= rootBounds.bottom;
      const inStage = interacting && point.y >= bounds.top && point.y <= bounds.bottom;
      const card = surface.querySelector<HTMLElement>('[aria-pressed="true"]');
      const center = bounds.left + bounds.width / 2;
      const threshold = (card?.offsetWidth ?? 350) * .5;
      const nextDirection = inStage ? (point.x < center - threshold ? -1 : point.x > center + threshold ? 1 : 0) : 0;
      if (nextDirection !== direction) { direction = nextDirection; enteredSide = now; }
      // A short dwell filters incidental movement and tracking jitter.
      if (direction && now - enteredSide >= 450 && now - lastHoverStep >= 1000) {
        setActive(current => (current + direction + areas.length) % areas.length);
        lastHoverStep = now;
        lastAdvance.current = now;
      }
      const focused = root.contains(document.activeElement);
      if (interacting || focused) lastAdvance.current = now;
      if (playing && !interacting && !focused && !matchMedia("(prefers-reduced-motion: reduce)").matches && now - lastAdvance.current >= 3000) {
        setActive(current => (current + 1) % areas.length);
        lastAdvance.current = now;
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, inputMode, pointerRef, handTrackingEnabled, gestureStateRef]);

  return <section ref={galleryRoot} className={styles.gallery} aria-label={t("Research areas")} aria-roledescription="carousel"
    onPointerMove={event => { if (event.pointerType !== "touch") mouse.current = { x: event.clientX, y: event.clientY }; }}
    onPointerLeave={() => { mouse.current = null; }}
    onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      handleMove(event.key === "ArrowRight" ? 1 : -1);
    }}>
    <p className={styles.eyebrow}>{t("Research areas")}</p>
    <div ref={stage} className={styles.stage}
      onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
      onTouchEnd={event => {
        if (touchStart.current === null) return;
        const distance = touchStart.current - event.changedTouches[0].clientX;
        if (Math.abs(distance) > 40) handleMove(distance > 0 ? 1 : -1);
        touchStart.current = null;
      }}>
      {areas.map(([title, description], index) => {
        const offset = (index - active + areas.length + 4) % areas.length - 4;
        const visible = Math.abs(offset) <= 2;
        return <button key={title} type="button" className={styles.card}
          style={{ "--offset": offset, "--distance": Math.abs(offset), zIndex: 5 - Math.abs(offset) } as CSSProperties}
          aria-label={t(title)} aria-pressed={index === active} aria-hidden={!visible}
          tabIndex={visible ? 0 : -1} onClick={() => handleSelect(index)}
          data-hand-target={visible ? "" : undefined} data-hand-style="box">
          <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
          <ResearchAreaIllustration area={title} className={styles.symbol} />
          <h3>{t(title)}</h3>
          <p>{t(description)}</p>
        </button>;
      })}
    </div>
    <div className={styles.controls}>
      <button type="button" aria-label={t("Previous research area")} onClick={() => handleMove(-1)} data-hand-target data-hand-prev data-hand-style="box">‹</button>
      <span role="status" aria-live={playing ? "off" : "polite"} aria-atomic="true">{String(active + 1).padStart(2, "0")} <span>/ {String(areas.length).padStart(2, "0")}</span><span className={styles.srOnly}> · {t(areas[active][0])}</span></span>
      <button type="button" aria-label={t("Next research area")} onClick={() => handleMove(1)} data-hand-target data-hand-next data-hand-style="box">›</button>
      <button type="button" aria-label={t(playing ? "Pause automatic gallery" : "Play automatic gallery")} aria-pressed={playing} onClick={() => setPlaying(current => !current)} data-hand-target data-hand-style="box">{playing ? "Ⅱ" : "▷"}</button>
    </div>
    <div className={styles.dots} aria-label={t("Choose a research area")}>
      {areas.map(([title], index) => <button key={title} type="button" aria-label={t(`Go to ${title}`)} aria-current={index === active ? "true" : undefined} onClick={() => handleSelect(index)} />)}
    </div>
  </section>;
}
