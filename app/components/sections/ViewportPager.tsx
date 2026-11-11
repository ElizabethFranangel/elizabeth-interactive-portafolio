"use client";

import { useLanguage } from "../content/LanguageProvider";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./ViewportPager.module.css";

const columnGap = 28;

export default function ViewportPager({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const flow = useRef<HTMLDivElement>(null);
  const pendingPage = useRef<number | null>(null);
  const [size, setSize] = useState({ height: 420, width: 0 });
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(0);

  useLayoutEffect(() => {
    const element = root.current;
    const region = viewport.current;
    const section = element?.closest<HTMLElement>("[data-section-transition]");
    if (!element || !region || !section) return;
    let frame = 0;
    let disposed = false;
    let previousWidth = 0;
    const measure = () => {
      if (disposed) return;
      const sectionStyle = getComputedStyle(section);
      const header = parseFloat(sectionStyle.getPropertyValue("--section-header-height")) || 82;
      const offset = element.getBoundingClientRect().top - section.getBoundingClientRect().top;
      const available = window.innerHeight - header - offset - parseFloat(sectionStyle.paddingBottom) - 30;
      const next = { height: Math.max(160, Math.floor(available)), width: region.clientWidth };
      setSize(current => current.height === next.height && current.width === next.width ? current : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width;
      if (width !== previousWidth) { previousWidth = width; schedule(); }
    });
    observer.observe(region);
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(schedule);
    measure();
    return () => { disposed = true; observer.disconnect(); window.removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
  }, [children]);

  useLayoutEffect(() => {
    const region = viewport.current;
    const content = flow.current;
    if (!region || !content || !size.width) return;
    region.scrollLeft = 0;
    // Keep short entries together. Let oversized grids and articles continue
    // across columns rather than clipping content below the screen.
    content.querySelectorAll<HTMLElement>("[data-pager-split]").forEach(element => delete element.dataset.pagerSplit);
    content.querySelectorAll<HTMLElement>("[data-pager-tight]").forEach(element => delete element.dataset.pagerTight);
    content.querySelectorAll<HTMLElement>("article, div, aside, dl").forEach(element => {
      const display = getComputedStyle(element).display;
      if (element.scrollHeight > size.height && (element.tagName === "ARTICLE" || display.includes("grid"))) {
        element.dataset.pagerSplit = "true";
      }
    });
    // An unbroken grid may fit a whole column but not the space below its
    // heading. Keep the first record on page one instead of leaving it empty.
    const firstRecord = content.querySelector<HTMLElement>("article");
    const startsOnLaterPage = () => firstRecord && firstRecord.getBoundingClientRect().left >= region.getBoundingClientRect().right - 1;
    if (startsOnLaterPage() && firstRecord) {
      firstRecord.dataset.pagerTight = "true";
      if (startsOnLaterPage()) firstRecord.dataset.pagerSplit = "true";
    }
    const pages = Math.max(1, Math.ceil((region.scrollWidth + columnGap - 1) / (size.width + columnGap)));
    setPageCount(pages);
    pendingPage.current = null;
    region.scrollLeft = 0;
    setPage(0);
  }, [children, size]);

  const goTo = useCallback((next: number) => {
    pendingPage.current = next;
    setPage(next);
    root.current?.closest<HTMLElement>("[data-section-transition]")?.scrollIntoView({ block: "start", behavior: "instant" });
    viewport.current?.scrollTo({
      left: next * (size.width + columnGap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [size.width]);
  const next = () => {
    if (page < pageCount - 1) goTo(page + 1);
  };

  return <div ref={root} className={styles.pager} onKeyDown={event => {
    if (pageCount < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    if (event.key === "ArrowRight") next();
    else goTo(Math.max(0, page - 1));
  }}>
    {page > 0 && <button type="button" className={`${styles.next} ${styles.previous}`} onClick={() => goTo(page - 1)}
      aria-label={t("Previous content page")}
      data-hand-target data-hand-prev data-hand-style="box">‹</button>}
    <div className={styles.main}>
      <div className={styles.pagination}>
        {pageCount > 1 && <>
          <span role="status" aria-live="polite">{page + 1}{" "}{t("of")}{" "}{pageCount}</span>
        </>}
      </div>
      <div ref={viewport} className={styles.viewport} data-page-viewport style={{ height: size.height }} onScroll={event => {
        if (pendingPage.current !== null) {
          const destination = pendingPage.current * (size.width + columnGap);
          if (Math.abs(event.currentTarget.scrollLeft - destination) < 2) pendingPage.current = null;
          return;
        }
        const nextPage = Math.round(event.currentTarget.scrollLeft / (size.width + columnGap));
        setPage(Math.max(0, Math.min(pageCount - 1, nextPage)));
      }}>
        <div ref={flow} className={styles.flow} style={{ height: size.height, columnGap }}>{children}</div>
      </div>
    </div>
    {page < pageCount - 1 && <button type="button" className={styles.next} onClick={next}
      aria-label={t("Next content page")}
      data-hand-target data-hand-next data-hand-style="box">›</button>}
  </div>;
}
