"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLanguage } from "./LanguageProvider";
import { defaultContent } from "../../lib/content-defaults";
import { contentConfigured, loadContent } from "../../lib/content-service";

const ContentContext = createContext(defaultContent);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultContent);
  useEffect(() => {
    if (!contentConfigured) return;
    let active = true;
    loadContent().then(result => { if (active) setContent(result.content); }).catch(() => {
      // Keep the original portfolio available when the content service is offline.
    });
    return () => { active = false; };
  }, []);
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

const originalFields = new Set(["id", "title", "firstName", "lastName", "name", "journal", "event", "institution", "repository", "repositoryUrl", "github", "linkedin", "doi", "volume", "issue", "pages", "image"]);
function localize<T>(value: T, t: (text: string) => string, field = ""): T {
  if (typeof value === "string") return (originalFields.has(field) ? value : t(value)) as T;
  if (Array.isArray(value)) return value.map(item => localize(item, t, field)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item, t, key)])) as T;
  return value;
}
export function usePortfolioContent() {
  const content = useContext(ContentContext);
  const { t } = useLanguage();
  return useMemo(() => localize(content, t), [content, t]);
}
