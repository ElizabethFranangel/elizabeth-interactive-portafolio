"use client";
import SocialIcon from "./components/SocialIcon";

import { useLanguage, LanguageProvider } from "./components/content/LanguageProvider";
import LanguageSwitch from "./components/content/LanguageSwitch";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

import OrbScene from "./components/Experience3D/OrbScene";

import InteractionController from "./components/Interaction/InteractionController";
import SectionNavigator from "./components/Interaction/SectionNavigator";

import {
  InteractionProvider,
  useInteraction,
} from "./components/Interaction/InteractionContext";

import HandTracker from "./components/Interaction/HandTracker";
import InputModeSelector from "./components/Interaction/InputModeSelector";
import HandHoverController from "./components/Interaction/HandHoverController";
import HandCursor from "./components/Interaction/HandCursor";
import PortfolioChapters from "./components/sections/PortfolioChapters";

import { CertificateProvider } from "./components/content/CertificatePreview";
import { ContentProvider, usePortfolioContent } from "./components/content/ContentProvider";

type Theme = "light" | "dark";

function ThemeSwitch({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  const { t } = useLanguage();
  return (
    <button
      className={styles.themeToggle}
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={theme === "dark"}
      aria-label={t(theme === "light" ? "Switch to dark mode" : "Switch to light mode")}
      title={t(theme === "light" ? "Switch to dark mode" : "Switch to light mode")}
      data-hand-target
      data-hand-style="box"
    >
      <svg className={styles.themeIcon} viewBox="0 0 24 24" aria-hidden="true">
        {theme === "light" ? (
          <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42M7.06 16.94l-1.42 1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
        ) : (
          <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />
        )}
      </svg>
      <span className={styles.themeLabel}>{t(theme === "light" ? "Light" : "Dark")}</span>
      <span className={styles.themeTrack} aria-hidden="true">
        <span className={styles.themeThumb} />
      </span>
    </button>
  );
}

const homeCards = [
  {
    title: "About Me",
    description: "Learn more about my background, academic journey, and professional interests.",
    href: "#about",
    section: 1,
    icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0",
  },
  {
    title: "Research",
    description: "Explore my research in optimization, metaheuristics, and cloud workflow scheduling.",
    href: "#research",
    section: 2,
    icon: "M4 19h16M7 16V9m5 7V5m5 11v-4",
  },
  {
    title: "Teaching",
    description: "Discover my teaching interests, academic preparation, and educational resources.",
    href: "#teaching",
    section: 3,
    icon: "m3 8 9-4 9 4-9 4-9-4Zm4 2v6c3 2 7 2 10 0v-6",
  },
  {
    title: "Publications",
    description: "Review verified publications and academic research outputs.",
    href: "#publications",
    section: 4,
    icon: "M6 4h9l3 3v13H6V4Zm9 0v4h4M9 12h6M9 16h6",
  },
  {
    title: "Projects",
    description: "Browse selected projects and tools developed to solve real-world computational problems.",
    href: "#projects",
    section: 5,
    icon: "m8 8-4 4 4 4m8-8 4 4-4 4m-2-9-4 18",
  },
  {
    title: "Contact",
    description: "Let's connect for collaborations, academic opportunities, research, and professional projects.",
    href: "#contact",
    section: 6,
    icon: "M4 6h16v12H4V6Zm0 1 8 6 8-6",
  },
] as const;

function PortfolioContent() {
  const { t } = useLanguage();
  const { profile } = usePortfolioContent();
  const [theme, setTheme] = useState<Theme>("light");
  const sectionChangedByScroll = useRef(false);
  const programmaticScrollUntil = useRef(0);
  const programmaticSectionTarget = useRef<number | null>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    const preferredTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    const frame = window.requestAnimationFrame(() => setTheme(preferredTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      window.localStorage.setItem("portfolio-theme", nextTheme);
      return nextTheme;
    });
  };

  const {
    currentSection,
    setCurrentSection,
  } = useInteraction();

  useEffect(() => {
    const sectionIds = [
      "home",
      "about",
      "research",
      "teaching",
      "publications",
      "projects",
      "contact",
    ];

    if (sectionChangedByScroll.current) {
      sectionChangedByScroll.current = false;
      return;
    }

    programmaticSectionTarget.current = currentSection;
    programmaticScrollUntil.current = Date.now() + 3000;
    document.getElementById(sectionIds[currentSection])?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentSection]);

  useEffect(() => {
    const sectionIds = [
      "home",
      "about",
      "research",
      "teaching",
      "publications",
      "projects",
      "contact",
    ];
    let frame = 0;

    const syncSectionWithScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const targetIndex = programmaticSectionTarget.current;

        if (targetIndex !== null) {
          const targetSection = document.getElementById(sectionIds[targetIndex]);
          const targetReached = targetSection
            ? Math.abs(targetSection.getBoundingClientRect().top) <= 18
            : true;

          if (targetReached) {
            programmaticSectionTarget.current = null;
          } else if (Date.now() < programmaticScrollUntil.current) {
            return;
          } else {
            programmaticSectionTarget.current = null;
          }
        }

        const activationLine = window.innerHeight * 0.7;
        let visibleSection = 0;

        sectionIds.forEach((sectionId, index) => {
          const section = document.getElementById(sectionId);
          if (section && section.getBoundingClientRect().top <= activationLine) {
            visibleSection = index;
          }
        });

        if (visibleSection !== currentSection) {
          sectionChangedByScroll.current = true;
          setCurrentSection(visibleSection);
        }
      });
    };

    syncSectionWithScroll();
    window.addEventListener("scroll", syncSectionWithScroll, { passive: true });
    window.addEventListener("resize", syncSectionWithScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", syncSectionWithScroll);
      window.removeEventListener("resize", syncSectionWithScroll);
    };
  }, [currentSection, setCurrentSection]);

  return (
    <main className={styles.page} data-theme={theme}>

      {/* ===================================================
          INTERACCIÓN
          =================================================== */}

      <InteractionController />

      <HandTracker />

      <HandHoverController />

      <HandCursor />

      <SectionNavigator />

      {currentSection === 0 && (
        <div className={styles.homeControls}>
          <InputModeSelector variant="home" />
          <div className={styles.appearanceControls}><ThemeSwitch theme={theme} onToggle={toggleTheme} /><LanguageSwitch /></div>
        </div>
      )}


      {/* ===================================================
          THREE.JS
          =================================================== */}

      <div className={styles.globalCanvas}>
        <OrbScene theme={theme} />
      </div>


      {/* ===================================================
          FONDO DECORATIVO
          =================================================== */}

      <div
        className={styles.background}
        aria-hidden="true"
      >
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
        <div className={styles.grid} />
      </div>


      {/* ===================================================
          NAVBAR
          =================================================== */}

      {currentSection !== 0 && <nav className={styles.navbar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            E
          </span>

          <span className={styles.brandName}>{t("Elizabeth Franco ")}</span>

          <span className={styles.brandBotanical} aria-hidden="true" />
        </div>


        <div className={styles.navLinks} aria-label={t("Portfolio sections")}>
          <a
            href="#home"
            onClick={(event) => { event.preventDefault(); setCurrentSection(0); }}
            data-hand-target
          >{t("Home ")}</a>
          {homeCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={currentSection === card.section ? styles.activeNavLink : undefined}
              aria-current={currentSection === card.section ? "page" : undefined}
              data-hand-target
              onClick={(event) => {
                event.preventDefault();
                setCurrentSection(card.section);
              }}
            >
              {t(card.title === "About Me" ? "About" : card.title)}
            </a>
          ))}
        </div>

        <div className={styles.navActions}>
          <InputModeSelector variant="navbar" />
          <ThemeSwitch theme={theme} onToggle={toggleTheme} /><LanguageSwitch />

          <a
            className={styles.cvLink}
            href="#contact"
            aria-label={t("Contact Elizabeth")}
            title={t("Contact")}
            data-hand-target
            data-hand-style="icon"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16v12H4V6Zm0 1 8 6 8-6" />
            </svg>
          </a>
        </div>
      </nav>}


      {/* ===================================================
          CONTENEDOR DE SECCIONES
          =================================================== */}

      <div
        className={styles.sectionsTrack}
      >

        {/* =================================================
            HOME
            ================================================= */}

        <section id="home" className={styles.hero}>

          <div className={styles.heroPrimary}>

          <div className={styles.heroContent}>

            <p className={styles.eyebrow}>
              <span>{t("WELCOME")}</span>
            </p>


            <h1>
              <span>{profile.firstName}</span>

              <span className={styles.lastName}>{profile.lastName}</span>
            </h1>


            <p className={styles.specialties}>{t("COMPUTER SCIENCE RESEARCHER ")}<span>|</span>{t("OPTIMIZATION ")}<span>|</span>{t("CLOUD COMPUTING ")}</p>


            <p className={styles.description}>
              {profile.description}
            </p>


            <div className={styles.actions}>

              {/* LinkedIn */}

              <a
                className={styles.socialLink}
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("LinkedIn")}
                title={t("LinkedIn")}
                data-hand-target
                data-hand-style="icon"
              >
                <SocialIcon kind="linkedin" className={styles.socialIcon} />
              </a>


              {/* GitHub */}

              <a
                className={styles.socialLink}
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("GitHub")}
                title={t("GitHub")}
                data-hand-target
                data-hand-style="icon"
              >
                <SocialIcon kind="github" className={styles.socialIcon} />
              </a>


              {/* View CV */}

              <a
                className={styles.primaryButton}
                href="#cv"
                data-hand-target
                data-hand-style="box"
              >{t("Download CV ")}<span aria-hidden="true">↓</span>
              </a>

            </div>


            <div className={styles.status}>
              <span className={styles.statusDot} />

              <a
                href="https://orcid.org/0009-0006-1800-9996"
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={t("Elizabeth del Ángel Franco ORCID profile")}
                data-hand-target
              >{t("ORCID 0009-0006-1800-9996 ")}</a>
            </div>

          </div>


          <div className={styles.visual} data-hero-visual>
            <div className={styles.orbCaption}>
              <span>{t("SCIENTIFIC NETWORK ")}</span>

              <small>{t("PARTICLES + HAND TRACKING ")}</small>
            </div>
          </div>

          </div>

          <div className={styles.homeLower}>
            <div className={styles.previewGrid} aria-label={t("Explore the portfolio")}>
              {homeCards.map((card, index) => (
                <a
                  key={card.title}
                  className={`${styles.previewCard} ${styles[`previewCard${index + 1}`]}`}
                  href={card.href}
                  data-hand-target
                  data-hand-style="box"
                  onClick={
                    "section" in card
                      ? (event) => {
                          event.preventDefault();
                          setCurrentSection(card.section);
                        }
                      : undefined
                  }
                >
                  <svg className={styles.previewIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d={card.icon} />
                  </svg>
                  <h2>{t(card.title)}</h2>
                  <p>{t(card.description)}</p>
                  <span className={styles.previewLink}>{t("Learn more ")}<span aria-hidden="true">→</span></span>
                  <span className={styles.cardDecoration} aria-hidden="true" />
                </a>
              ))}
            </div>

          </div>


          <div className={styles.scrollIndicator}>
            <span>{t("SWIPE TO EXPLORE ")}</span>

            <div className={styles.scrollLine} />
          </div>

        <footer className={styles.quoteStrip} aria-label={t("Home quote")}>
          <span className={styles.quoteMark} aria-hidden="true">“</span>
          <blockquote>{t("Efficiency is not just about speed. It is about making intelligent choices that create sustainable impact. ")}</blockquote>
          <div className={styles.signature}>
            <span />{t("Elizabeth del Ángel Franco ")}</div>
        </footer>
        </section>

        <PortfolioChapters onNavigate={setCurrentSection} />


        {/* =================================================
            ABOUT
            ================================================= */}

        <section
          className={`${styles.about} ${styles.legacySection}`}
        >
          <div className={styles.aboutGlow} />

          <div className={styles.aboutInner}>

            <div className={styles.aboutHeader}>
              <p className={styles.sectionEyebrow}>
                01 / ABOUT
              </p>

              <h2 className={styles.sectionTitle}>
                Researcher in
                <span> Computer Science</span>
              </h2>

              <p className={styles.aboutDescription}>
                My work focuses on intelligent optimization,
                multiobjective metaheuristics and workflow
                scheduling in cloud computing environments.
              </p>
            </div>


            <div className={styles.aboutGrid}>

              <article
                className={styles.aboutCard}
                data-hand-target
                data-hand-style="box"
              >
                <span className={styles.cardNumber}>
                  01
                </span>

                <div className={styles.cardContent}>
                  <h3>
                    Academic Background
                  </h3>

                  <p>
                    Master&apos;s degree in Computer Science
                    and doctoral training in Computer Science,
                    with a research-oriented academic profile.
                  </p>
                </div>

                <span
                  className={styles.cardAccent}
                  aria-hidden="true"
                />
              </article>


              <article
                className={styles.aboutCard}
                data-hand-target
                data-hand-style="box"
              >
                <span className={styles.cardNumber}>
                  02
                </span>

                <div className={styles.cardContent}>
                  <h3>
                    Research Focus
                  </h3>

                  <p>
                    Intelligent optimization,
                    multiobjective metaheuristics and
                    efficient allocation of computational
                    resources.
                  </p>
                </div>

                <span
                  className={styles.cardAccent}
                  aria-hidden="true"
                />
              </article>


              <article
                className={styles.aboutCard}
                data-hand-target
                data-hand-style="box"
              >
                <span className={styles.cardNumber}>
                  03
                </span>

                <div className={styles.cardContent}>
                  <h3>
                    Current Interests
                  </h3>

                  <p>
                    Artificial intelligence, evolutionary
                    algorithms and workflow scheduling in
                    cloud computing environments.
                  </p>
                </div>

                <span
                  className={styles.cardAccent}
                  aria-hidden="true"
                />
              </article>

            </div>
          </div>
        </section>
        {/* =================================================
            RESEARCH
            ================================================= */}
          <section
              className={`${styles.research} ${styles.legacySection}`}
            >
              <div className={styles.researchGlow} />

              <div className={styles.researchInner}>

                <div className={styles.researchHeader}>
                  <p className={styles.sectionEyebrow}>
                    02 / RESEARCH
                  </p>

                  <h2 className={styles.sectionTitle}>
                    Intelligent Optimization for
                    <span> Cloud Workflows</span>
                  </h2>

                  <p className={styles.researchDescription}>
                    My research focuses on intelligent optimization and
                    multiobjective metaheuristics for workflow scheduling
                    in cloud computing environments.
                  </p>
                </div>


                <div className={styles.researchGrid}>

                  <article
                    className={styles.researchMainCard}
                    data-hand-target
                    data-hand-style="box"
                  >
                    <p className={styles.researchLabel}>
                      RESEARCH PROBLEM
                    </p>

                    <h3>
                      Multiobjective Workflow Scheduling
                    </h3>

                    <p>
                      Efficient allocation of computational resources while
                      considering conflicting objectives such as execution
                      time and computational cost.
                    </p>

                    <div className={styles.objectives}>
                      <div>
                        <span>
                          01
                        </span>

                        <strong>
                          Makespan
                        </strong>

                        <small>
                          Minimize execution time
                        </small>
                      </div>

                      <div>
                        <span>
                          02
                        </span>

                        <strong>
                          Cost
                        </strong>

                        <small>
                          Minimize computational cost
                        </small>
                      </div>
                    </div>
                  </article>


                  <div className={styles.researchSide}>

                    <article
                      className={styles.researchCard}
                      data-hand-target
                      data-hand-style="box"
                    >
                      <p className={styles.researchLabel}>
                        METHODS
                      </p>

                      <div className={styles.researchTags}>
                        <span>NSGA-II</span>
                        <span>NSGA-III</span>
                        <span>CCGA</span>
                        <span>MSCCA</span>
                        <span>MMSCCA</span>
                      </div>
                    </article>


                    <article
                      className={styles.researchCard}
                      data-hand-target
                      data-hand-style="box"
                    >
                      <p className={styles.researchLabel}>
                        EXPERIMENTAL ENVIRONMENT
                      </p>

                      <div className={styles.researchTags}>
                        <span>WorkflowSim</span>
                        <span>CloudSim</span>
                        <span>DAG Workflows</span>
                        <span>Heterogeneous VMs</span>
                      </div>
                    </article>

                  </div>

                </div>

              </div>
            </section>
            {/*=====================================
            TEACHING
            =========================================*/}
            <section
              className={`${styles.teaching} ${styles.legacySection}`}
            >
              <div className={styles.teachingGlow} />

              <div className={styles.teachingInner}>

                <div className={styles.teachingHeader}>
                  <p className={styles.sectionEyebrow}>
                    03 / TEACHING
                  </p>

                  <h2 className={styles.sectionTitle}>
                    From Research
                    <span> to Education</span>
                  </h2>

                  <p className={styles.teachingDescription}>
                    My academic background and research experience support
                    my interest in university teaching and in communicating
                    computer science concepts through structured,
                    practical and problem-oriented learning.
                  </p>
                </div>


                <div className={styles.teachingGrid}>

                  {/* ===================================================
                      EXPERIENCIA DOCENTE
                      =================================================== */}

                  <article
                    className={styles.teachingExperience}
                    data-hand-target
                    data-hand-style="box"
                  >
                    <div className={styles.teachingExperienceHeader}>
                      <p className={styles.teachingLabel}>
                        TEACHING EXPERIENCE
                      </p>

                      <span className={styles.teachingYear}>
                        2022
                      </span>
                    </div>

                    <div className={styles.teachingExperienceContent}>
                      <h3>
                        Adjunct Professor
                      </h3>

                      <h4>
                        Analysis and Design of Algorithms
                      </h4>

                      <p>
                        Computer Systems Engineering
                      </p>

                      <p>
                        Tecnológico Nacional de México
                        <br />
                        Instituto Tecnológico de Ciudad Madero
                      </p>

                      <span className={styles.teachingPeriod}>
                        August – December 2022
                      </span>
                    </div>

                    <div className={styles.teachingAccent} />
                  </article>


                  {/* ===================================================
                      ÁREAS DE INTERÉS
                      =================================================== */}

                  <article
                    className={styles.teachingAreas}
                    data-hand-target
                    data-hand-style="box"
                  >
                    <p className={styles.teachingLabel}>
                      AREAS OF INTEREST FOR TEACHING
                    </p>

                    <div className={styles.teachingAreaGrid}>

                      <div>
                        <span>01</span>
                        <strong>Programming</strong>
                      </div>

                      <div>
                        <span>02</span>
                        <strong>Algorithms</strong>
                      </div>

                      <div>
                        <span>03</span>
                        <strong>Artificial Intelligence</strong>
                      </div>

                      <div>
                        <span>04</span>
                        <strong>Databases</strong>
                      </div>

                      <div>
                        <span>05</span>
                        <strong>Optimization</strong>
                      </div>

                      <div>
                        <span>06</span>
                        <strong>Cybersecurity</strong>
                      </div>

                    </div>
                  </article>


                  {/* ===================================================
                      ENFOQUE
                      =================================================== */}

                  <article
                    className={styles.teachingApproach}
                    data-hand-target
                    data-hand-style="box"
                  >
                    <p className={styles.teachingLabel}>
                      TEACHING APPROACH
                    </p>

                    <h3>
                      From fundamentals to
                      <span> real-world applications.</span>
                    </h3>

                    <p>
                      I am interested in connecting theoretical foundations
                      with practical problem solving, computational thinking
                      and the application of computer science concepts to
                      real scenarios.
                    </p>
                  </article>

                </div>

              </div>
            </section>

      </div>
    </main>
  );
}


export default function Home() {
  return (
    <InteractionProvider>
      <LanguageProvider><ContentProvider><CertificateProvider><PortfolioContent /></CertificateProvider></ContentProvider></LanguageProvider>
    </InteractionProvider>
  );
}
