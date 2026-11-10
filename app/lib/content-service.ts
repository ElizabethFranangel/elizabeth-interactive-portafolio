import { defaultContent, type PortfolioContent } from "./content-defaults";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const contentConfigured = Boolean(url && key);

export async function request(path: string, init: RequestInit = {}, token?: string) {
  if (!contentConfigured) throw new Error("Falta conectar Supabase. Consulta README.md para activar el panel.");
  const headers = new Headers(init.headers);
  headers.set("apikey", key!);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${url}${path}`, { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    if (response.status === 401) throw new Error("Credenciales incorrectas o sesión vencida. Inicia sesión de nuevo.");
    if (response.status === 403) throw new Error("Tu cuenta no tiene permisos de administración.");
    throw new Error("No se pudo completar la operación. Revisa la conexión y la configuración de Supabase.");
  }
  return response;
}

// Validate remote content before it reaches the public rendering components.
function matches(value: unknown, sample: unknown, field = ""): boolean {
  if (typeof sample === "string") {
    if (typeof value !== "string" || value.length > 20000) return false;
    if (["linkedin", "github", "repositoryUrl"].includes(field)) {
      try { return new URL(value).protocol === "https:"; } catch { return false; }
    }
    return true;
  }
  if (typeof sample === "number") return typeof value === "number" && Number.isFinite(value);
  if (typeof sample === "boolean") return typeof value === "boolean";
  if (Array.isArray(sample)) return Array.isArray(value) && value.length <= 200 && value.every(item => sample.length === 0 ? typeof item === "string" : sample.some(example => matches(item, example)));
  if (sample && typeof sample === "object") {
    return Boolean(value && typeof value === "object" && !Array.isArray(value)
      && Object.entries(sample).every(([name, example]) => matches((value as Record<string, unknown>)[name], example, name))
      && Object.entries(value).every(([name, item]) => name in sample || (name === "featured" && typeof item === "boolean") || (name === "detail" && typeof item === "string" && item.length <= 20000)));
  }
  return false;
}

export function validateContent(value: unknown): asserts value is PortfolioContent {
  if (!matches(value, defaultContent)) throw new Error("El contenido tiene campos incompletos o enlaces inválidos. Los enlaces deben comenzar con https://.");
}

export async function loadContent(): Promise<{ content: PortfolioContent; version: string | null }> {
  const response = await request("/rest/v1/portfolio_content?id=eq.main&select=content,updated_at");
  const rows = await response.json();
  if (!rows.length) return { content: structuredClone(defaultContent), version: null };
  // Older saved portfolios predate these three collections. Preserve saved edits.
  const content = { academicDevelopment: structuredClone(defaultContent.academicDevelopment), academicService: structuredClone(defaultContent.academicService), additionalTraining: structuredClone(defaultContent.additionalTraining), ...rows[0].content };
  validateContent(content);
  return { content, version: rows[0].updated_at };
}

export async function saveContent(content: PortfolioContent, version: string | null, token: string) {
  validateContent(content);
  const response = await request(`/rest/v1/portfolio_content${version ? `?id=eq.main&updated_at=eq.${encodeURIComponent(version)}` : ""}`, {
    method: version ? "PATCH" : "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(version ? { content } : { id: "main", content }),
  }, token);
  const rows = await response.json();
  if (!rows.length) throw new Error("El contenido cambió en otra sesión. Recarga el panel antes de volver a guardar.");
  return rows[0].updated_at as string;
}
