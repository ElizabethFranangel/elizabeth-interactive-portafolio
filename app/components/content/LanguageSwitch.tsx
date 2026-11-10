"use client";

import { useLanguage } from "./LanguageProvider";
import styles from "./LanguageSwitch.module.css";

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  const nextLanguage = language === "es" ? "en" : "es";
  return <button type="button" className={styles.switch} lang={nextLanguage}
    aria-label={language === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
    title={nextLanguage === "en" ? "English" : "Español"}
    onClick={() => setLanguage(nextLanguage)} data-hand-target data-hand-style="box">
    {nextLanguage.toUpperCase()}
  </button>;
}
