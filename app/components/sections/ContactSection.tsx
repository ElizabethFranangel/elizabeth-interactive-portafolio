"use client";

import { useLanguage } from "../content/LanguageProvider";
import { usePortfolioContent } from "../content/ContentProvider";
import transitions from "./SectionTransitions.module.css";
import styles from "./ContactSection.module.css";
import typography from "../../page.module.css";
import SocialIcon from "../SocialIcon";

export default function ContactSection({ onNavigate }: { onNavigate: (section: number) => void }) {
  const { t } = useLanguage();
  const { profile } = usePortfolioContent();
  const links = [
    { kind: "linkedin", title: "LinkedIn", description: "Professional profile and collaboration", href: profile.linkedin },
    { kind: "github", title: "GitHub", description: "Code, projects and development", href: profile.github },
    { kind: "email", title: "Email", description: "Direct contact", href: "mailto:eliizabeth.franco@gmail.com" },
  ] as const;
  return <section id="contact" data-section-transition data-section-tone="alternate" className={`${transitions.section} ${styles.section}`}>
    <div className={`${styles.inner} ${transitions.content}`}>
      <header className={styles.heading}>
        <p className={`${styles.eyebrow} ${typography.microLabel}`}>{t("06 / Contact")}</p>
        <h2 className={typography.sectionTitle}>{t("Let's ")}<em>{t("connect.")}</em></h2>
      </header>
      <div className={styles.layout}>
        <div className={styles.details}>
          <p className={`${styles.intro} ${typography.chapterIntro}`}>{profile.contact}</p>
          <div className={styles.links}>
            {links.map(link => <a key={link.kind} href={link.href} target={link.kind === "email" ? undefined : "_blank"} rel={link.kind === "email" ? undefined : "noopener noreferrer"} data-hand-target>
              <span className={`${typography.socialLink} ${styles.icon}`}><SocialIcon kind={link.kind} className={typography.socialIcon} /></span>
              <span><h3>{t(link.title)}</h3><small>{t(link.description)}</small></span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </a>)}
          </div>
        </div>
        <form className={styles.form} action="https://formsubmit.co/eliizabeth.franco@gmail.com" method="POST" aria-describedby="contact-delivery-info">
          <label>{t("Name")} <span>*</span><input name="name" autoComplete="name" placeholder={t("Your name")} maxLength={120} required /></label>
          <label>{t("Email")} <span>*</span><input name="email" type="email" autoComplete="email" placeholder={t("you@example.com")} maxLength={254} required /></label>
          <label className={styles.wide}>{t("Subject")} <span>*</span><select name="subject" defaultValue="" required data-hand-target><option value="" disabled>{t("Select a subject")}</option>{["Academic collaboration", "Research", "University teaching", "Technology project", "Other inquiry"].map(subject => <option key={subject} value={subject}>{t(subject)}</option>)}</select></label>
          <label className={styles.wide}>{t("Message")} <span>*</span><textarea name="message" rows={5} placeholder={t("Write your message...")} maxLength={10000} required /></label>
          <input type="hidden" name="_subject" value="Nuevo mensaje · Portafolio de Elizabeth Franco" /><input type="hidden" name="_template" value="table" />
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
          <button type="submit" data-hand-target data-hand-style="box">{t("Send message ")}<span aria-hidden="true">→</span></button>
          <p id="contact-delivery-info" className={styles.notice}>{t("Your message will be processed by FormSubmit and sent to eliizabeth.franco@gmail.com. Sending opens its verification and confirmation page.")}</p>
        </form>
      </div>
      <footer className={styles.footer}><span>Elizabeth del Ángel Franco</span><span>{t("© 2026 · Computer Science Researcher")}</span><a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/admin/`} data-hand-target>{t("Administrar · Iniciar sesión")}</a><button type="button" onClick={() => onNavigate(0)} data-hand-target>{t("Back to top ↑")}</button></footer>
    </div>
  </section>;
}
