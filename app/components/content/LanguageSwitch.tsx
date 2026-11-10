"use client";

import { useLanguage } from "./LanguageProvider";
import styles from "./LanguageSwitch.module.css";

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return <div className={styles.switch} role="group" aria-label="Idioma / Language">
    <button type="button" lang="es" aria-label="Español" aria-pressed={language === "es"} onClick={() => setLanguage("es")} data-hand-target data-hand-style="box">ES</button>
    <button type="button" lang="en" aria-label="English" aria-pressed={language === "en"} onClick={() => setLanguage("en")} data-hand-target data-hand-style="box">EN</button>
  </div>;
}
