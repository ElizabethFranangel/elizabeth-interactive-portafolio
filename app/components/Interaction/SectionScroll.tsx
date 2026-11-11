"use client";

import { useEffect, useRef } from "react";
import { useInteraction } from "./InteractionContext";

const sectionIds = ["home", "about", "research", "teaching", "publications", "projects", "contact"];

export default function SectionScroll() {
  const { setCurrentSection } = useInteraction();
  const gesture = useRef({ lastEvent: 0, lockedUntil: 0, total: 0 });

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const target = event.target instanceof Element ? event.target : null;
      if (document.querySelector("dialog[open]") || target?.closest("input, textarea, select, [contenteditable=true], [role=listbox]")) return;
      // Allow independent scrollable controls to consume their own gestures.
      for (let parent = target; parent && parent !== document.body; parent = parent.parentElement) {
        const overflow = getComputedStyle(parent).overflowY;
        if (/(auto|scroll)/.test(overflow) && parent.scrollHeight > parent.clientHeight + 2) return;
      }
      const sections = sectionIds.map(id => document.getElementById(id));
      const header = document.querySelector("header nav")?.closest("header")?.getBoundingClientRect().height
        || parseFloat(getComputedStyle(document.getElementById("about")!).getPropertyValue("--section-header-height")) || 82;
      let index = 0;
      sections.forEach((section, position) => {
        if (section && section.getBoundingClientRect().top <= header + 30) index = position;
      });
      const section = sections[index];
      if (!section || !event.deltaY) return;
      const bounds = section.getBoundingClientRect();
      const direction = Math.sign(event.deltaY);
      const now = performance.now();
      const state = gesture.current;
      const quiet = now - state.lastEvent > 180;
      state.lastEvent = now;
      if (now < state.lockedUntil) { event.preventDefault(); return; }
      if (state.lockedUntil && !quiet) { event.preventDefault(); return; }
      state.lockedUntil = 0;
      // Long sections remain readable before moving to the following section.
      if (bounds.height > innerHeight - header + 32 &&
        (direction > 0 ? bounds.bottom > innerHeight + 8 : bounds.top < header - 8)) {
        state.total = 0;
        return;
      }
      event.preventDefault();
      if (quiet || Math.sign(state.total) !== direction) state.total = 0;
      state.total += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(state.total) < 35) return;
      const next = Math.max(0, Math.min(sections.length - 1, index + direction));
      if (next === index) return;
      state.total = 0;
      state.lockedUntil = now + 1000;
      setCurrentSection(next);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [setCurrentSection]);

  return null;
}
