"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { certificates, type Certificate } from "../../lib/certificates";
import styles from "./CertificatePreview.module.css";

type Preview = { id: string; certificate: Certificate; x: number; y: number; theme: string };
type Actions = { show: (id: string, target: HTMLElement) => void; leave: () => void; open: (id: string, target: HTMLElement) => void };
const CertificateContext = createContext<Actions | null>(null);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function CertificateProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [selected, setSelected] = useState<{ certificate: Certificate; theme: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const suppressFocus = useRef(false);
  const isOpen = useRef(false);

  const cancel = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; }, []);
  const hide = useCallback(() => { cancel(); setPreview(null); }, [cancel]);
  const leave = useCallback(() => { cancel(); timer.current = setTimeout(() => setPreview(null), 400); }, [cancel]);
  const show = useCallback((id: string, target: HTMLElement) => {
    cancel();
    if (isOpen.current || suppressFocus.current || !certificates[id]) return;
    trigger.current = target;
    const rect = target.getBoundingClientRect();
    const width = Math.min(300, window.innerWidth - 32);
    const height = Math.min(390, window.innerHeight - 32);
    const right = rect.right + 18;
    const left = rect.left - width - 18;
    let x = right + width <= window.innerWidth - 16 ? right : left >= 16 ? left : window.innerWidth - width - 16;
    let y = rect.top - 40;
    if (left < 16 && right + width > window.innerWidth - 16) {
      const below = rect.bottom + 12;
      const above = rect.top - height - 12;
      y = below + height <= window.innerHeight - 16 ? below : above >= 16 ? above : below;
    }
    x = Math.max(16, x);
    y = Math.max(16, Math.min(y, window.innerHeight - height - 16));
    setPreview({ id, certificate: certificates[id], x, y, theme: target.closest<HTMLElement>("[data-theme]")?.dataset.theme || "light" });
  }, [cancel]);
  const open = useCallback((id: string, target: HTMLElement) => {
    if (!certificates[id]) return;
    hide(); trigger.current = target; isOpen.current = true;
    setSelected({ certificate: certificates[id], theme: target.closest<HTMLElement>("[data-theme]")?.dataset.theme || "light" });
  }, [hide]);

  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [selected]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); };
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    window.addEventListener("keydown", escape);
    return () => { cancel(); window.removeEventListener("scroll", hide, true); window.removeEventListener("resize", hide); window.removeEventListener("keydown", escape); };
  }, [hide, cancel]);

  const close = () => {
    isOpen.current = false; setSelected(null); hide();
    suppressFocus.current = true;
    trigger.current?.focus({ preventScroll: true });
    suppressFocus.current = false;
  };

  return <CertificateContext.Provider value={{ show, leave, open }}>
    {children}
    {preview && createPortal(<aside className={`${styles.surface} ${styles.preview}`} data-theme={preview.theme} style={{ left: preview.x, top: preview.y }} onPointerEnter={cancel} onPointerDown={cancel} onPointerLeave={leave} onFocus={cancel} onBlur={leave} aria-label={`Certificate preview: ${preview.certificate.title}`}>
      <button type="button" className={styles.thumbnail} aria-label={`Expand certificate: ${preview.certificate.title}`} aria-haspopup="dialog" onClick={event => open(preview.id, trigger.current || event.currentTarget)} data-hand-target data-hand-style="box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={basePath + preview.certificate.image} alt={`Certificate: ${preview.certificate.title}`} draggable={false} />
      </button>
      <p>{preview.certificate.institution} · {preview.certificate.year}</p>
    </aside>, document.body)}
    {selected && createPortal(<dialog ref={dialog} className={`${styles.surface} ${styles.dialog}`} data-theme={selected.theme} aria-labelledby="certificate-dialog-title" tabIndex={-1} autoFocus onClose={close} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
    }}>
      <header><span>{selected.certificate.category} · {selected.certificate.year}</span></header>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={basePath + selected.certificate.image} alt={`Original certificate: ${selected.certificate.title}`} />
      <h2 id="certificate-dialog-title">{selected.certificate.title}</h2>
      <p>{selected.certificate.institution}</p><p>{selected.certificate.date}</p>
    </dialog>, document.body)}
  </CertificateContext.Provider>;
}

export function CertificateTitle({ id, children }: { id: string; children: ReactNode }) {
  const actions = useContext(CertificateContext);
  if (!actions || !certificates[id]) return <>{children}</>;
  return <button type="button" className={styles.title} aria-haspopup="dialog" aria-label={`View certificate: ${certificates[id].title}`} onPointerEnter={event => { if (event.pointerType !== "touch") actions.show(id, event.currentTarget); }} onPointerLeave={actions.leave} onFocus={event => actions.show(id, event.currentTarget)} onBlur={actions.leave} onClick={event => actions.open(id, event.currentTarget)} data-hand-target data-hand-style="text">{children}<span aria-hidden="true" className={styles.mark}> ↗</span></button>;
}
