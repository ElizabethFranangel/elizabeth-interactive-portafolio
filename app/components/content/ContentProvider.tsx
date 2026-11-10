"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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

export const usePortfolioContent = () => useContext(ContentContext);
