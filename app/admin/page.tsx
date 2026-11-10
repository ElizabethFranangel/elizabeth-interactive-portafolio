"use client";

import { useEffect, useState, type FormEvent } from "react";
import { defaultContent, type PortfolioContent } from "../lib/content-defaults";
import { contentConfigured, loadContent, request, saveContent } from "../lib/content-service";
import styles from "./panel.module.css";

type Value = string | number | boolean | { [key: string]: Value } | Value[];
const sections: Record<keyof PortfolioContent, string> = {
  profile: "Perfil y contacto", publications: "Publicaciones", scientificPresentations: "Presentaciones",
  academicDevelopment: "Certificaciones y diplomados", academicService: "Participación y servicio académico", additionalTraining: "Formación adicional",
  projects: "Proyectos", researchNodes: "Áreas de investigación", researchPipeline: "Proceso de investigación",
  optimizationFamilies: "Métodos de optimización", workflowBenchmarks: "Workflows de referencia",
  teachingInterests: "Intereses docentes", academicActivities: "Actividades académicas", teachingAreas: "Áreas docentes",
};
const labels: Record<string, string> = {
  firstName: "Nombre", lastName: "Apellidos", description: "Descripción", bio: "Perfil profesional",
  background: "Trayectoria", contact: "Invitación de contacto", title: "Título", subtitle: "Subtítulo",
  year: "Año", month: "Fecha", type: "Tipo", authors: "Autores", name: "Nombre", featured: "Destacar autora",
  journal: "Revista", volume: "Volumen", issue: "Número", pages: "Páginas", doi: "DOI", tags: "Etiquetas",
  event: "Evento", status: "Estado", repository: "Repositorio", repositoryUrl: "Enlace del repositorio",
  repositoryAvailable: "Repositorio disponible", topics: "Temas", technologies: "Tecnologías", family: "Familia",
  methods: "Métodos", context: "Contexto", detail: "Detalle", verified: "Verificado", group: "Grupo", areas: "Áreas",
  institution: "Institución o programa", date: "Fecha y duración",
};
function blank(value: Value): Value {
  if (Array.isArray(value)) return [];
  if (typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, key === "id" ? crypto.randomUUID() : key === "type" && ["journal", "conference", "bookChapter", "presentation"].includes(String(item)) ? item : blank(item)]));
  return typeof value === "boolean" ? false : typeof value === "number" ? new Date().getFullYear() : "";
}

function Fields({ value, template, onChange, label, field = "" }: { value: Value; template: Value; onChange: (value: Value) => void; label: string; field?: string }) {
  if (Array.isArray(value)) {
    const example = Array.isArray(template) ? template[0] ?? "" : "";
    return <fieldset className={styles.collection}><legend>{label} · {value.length}</legend>
      {value.map((item, index) => <div className={styles.entry} key={index}>
        <Fields label={`${label} ${index + 1}`} value={item} template={example} onChange={next => onChange(value.map((current, i) => i === index ? next : current))} />
        <button type="button" className={styles.remove} onClick={() => onChange(value.filter((_, i) => i !== index))}>Quitar {label.toLowerCase()} {index + 1}</button>
      </div>)}
      <button type="button" onClick={() => onChange([...value, blank(example)])}>+ Agregar elemento</button>
    </fieldset>;
  }
  if (typeof value === "object") return <fieldset className={styles.group}><legend>{label}</legend>
    {Object.entries(value).map(([key, item]) => <Fields key={key} label={labels[key] || key} field={key} value={item} template={typeof template === "object" && !Array.isArray(template) ? template[key] ?? item : item} onChange={next => onChange({ ...value, [key]: next })} />)}
  </fieldset>;
  if (typeof value === "boolean") return <label className={styles.check}><input type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} />{label}</label>;
  if (field === "type" && ["journal", "conference", "bookChapter", "presentation"].includes(String(value))) return <label>{label}<select value={String(value)} onChange={event => onChange(event.target.value)}><option value="journal">Artículo</option><option value="conference">Congreso</option><option value="bookChapter">Capítulo de libro</option><option value="presentation">Presentación</option></select></label>;
  return <label>{label}{typeof value === "number" ? <input type="number" required value={value} onChange={event => onChange(Number(event.target.value))} /> : <textarea rows={String(value).length > 100 ? 4 : 2} maxLength={20000} value={value} onChange={event => onChange(event.target.value)} />}</label>;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);
  const [content, setContent] = useState<PortfolioContent>(structuredClone(defaultContent));
  const [version, setVersion] = useState<string | null>(null);
  const [section, setSection] = useState<keyof PortfolioContent>("profile");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const home = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await request("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const session = await response.json();
      const membership = await request(`/rest/v1/portfolio_admins?user_id=eq.${encodeURIComponent(session.user.id)}&select=user_id`, {}, session.access_token);
      if (!(await membership.json()).length) {
        await request("/auth/v1/logout", { method: "POST" }, session.access_token);
        throw new Error("Esta cuenta no está autorizada para administrar el portafolio.");
      }
      const loaded = await loadContent();
      if (!dirty) { setContent(loaded.content); setVersion(loaded.version); }
      setToken(session.access_token); setExpiresAt(Date.now() + session.expires_in * 1000);
      setStatus(dirty ? "Sesión renovada. Tus cambios siguen pendientes de guardar." : "Sesión iniciada. Selecciona una sección para editar.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se pudo iniciar sesión."); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setStatus("");
    try {
      if (Date.now() >= expiresAt) { setToken(""); throw new Error("La sesión venció. Inicia sesión de nuevo; conservamos tus cambios en esta pestaña."); }
      const nextVersion = await saveContent(content, version, token);
      setVersion(nextVersion); setDirty(false); setStatus("Cambios publicados. Ya están disponibles en el portafolio.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se pudo guardar."); }
    finally { setBusy(false); }
  }

  async function logout() {
    if (dirty && !window.confirm("Tienes cambios sin guardar. ¿Quieres descartarlos y cerrar sesión?")) return;
    setBusy(true);
    try {
      await request("/auth/v1/logout", { method: "POST" }, token);
      setToken(""); setDirty(false); setContent(structuredClone(defaultContent)); setStatus("Sesión cerrada.");
    } catch { setStatus("No se pudo cerrar la sesión. Vuelve a intentarlo."); }
    finally { setBusy(false); }
  }

  return <main className={styles.page} lang="es">
    <header className={styles.header}><a href={home}>← Volver al portafolio</a><span>ELIZABETH · ADMINISTRACIÓN</span>{token && <button type="button" disabled={busy} onClick={logout}>Cerrar sesión</button>}</header>
    <div className={styles.intro}><p>Tu espacio de edición</p><h1>{token ? "Actualiza tu portafolio." : "Iniciar sesión."}</h1><p>{token ? "Agrega información, revisa los campos y publica tus cambios cuando estén listos." : "Accede con tu cuenta de administradora para agregar o actualizar información."}</p></div>
    {!contentConfigured && <aside className={styles.notice}><strong>Conexión pendiente</strong><p>Para activar el inicio de sesión, configura Supabase siguiendo la guía de README.md. El portafolio público sigue disponible.</p></aside>}
    <p role="status" aria-live="polite" className={styles.status}>{status}</p>
    {!token ? <form className={styles.login} onSubmit={login}>
      <label>Correo electrónico<input name="email" type="email" autoComplete="username" required /></label>
      <label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>
      <button className={styles.primary} disabled={busy || !contentConfigured}>{busy ? "Iniciando sesión…" : "Iniciar sesión →"}</button>
      <p>Acceso exclusivo para la administración del portafolio.</p>
    </form> : <div className={styles.workspace}>
      <nav aria-label="Secciones editables">{Object.entries(sections).map(([key, label]) => <button key={key} disabled={busy} type="button" aria-current={section === key ? "page" : undefined} onClick={() => setSection(key as keyof PortfolioContent)}>{label}</button>)}</nav>
      <form onSubmit={save} className={styles.editor}>
        <div className={styles.toolbar}><div><h2>{sections[section]}</h2><p>{dirty ? "Cambios sin guardar" : "Contenido guardado"}</p></div><button className={styles.primary} disabled={busy || !dirty}>{busy ? "Guardando…" : "Guardar y publicar"}</button></div>
        <fieldset disabled={busy} className={styles.fields}><Fields label={sections[section]} value={content[section] as Value} template={defaultContent[section] as Value} onChange={next => { setContent({ ...content, [section]: next }); setDirty(true); }} /></fieldset>
      </form>
    </div>}
  </main>;
}
