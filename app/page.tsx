"use client";

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

type Theme = "light" | "dark";

function ThemeSwitch({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <button
      className={styles.themeToggle}
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={theme === "dark"}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
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
      <span className={styles.themeLabel}>{theme === "light" ? "Light" : "Dark"}</span>
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
          <ThemeSwitch theme={theme} onToggle={toggleTheme} />
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

          <span className={styles.brandName}>
            Elizabeth Franco
          </span>

          <span className={styles.brandBotanical} aria-hidden="true" />
        </div>


        <div className={styles.navLinks} aria-label="Portfolio sections">
          <a
            href="#home"
            onClick={(event) => { event.preventDefault(); setCurrentSection(0); }}
            data-hand-target
          >
            Home
          </a>
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
              {card.title === "About Me" ? "About" : card.title}
            </a>
          ))}
        </div>

        <div className={styles.navActions}>
          <InputModeSelector variant="navbar" />
          <ThemeSwitch theme={theme} onToggle={toggleTheme} />

          <a
            className={styles.cvLink}
            href="#contact"
            aria-label="Contact Elizabeth"
            title="Contact"
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
              <span>WELCOME</span>
            </p>


            <h1>
              <span>
                Elizabeth
              </span>

              <span className={styles.lastName}>
                del Angel Franco
              </span>
            </h1>


            <p className={styles.specialties}>
              COMPUTER SCIENCE RESEARCHER

              <span>|</span>

              OPTIMIZATION

              <span>|</span>

              CLOUD COMPUTING
            </p>


            <p className={styles.description}>
              I research intelligent optimization, metaheuristics,
              and workflow scheduling to design efficient, scalable,
              and sustainable solutions in cloud computing.
            </p>


            <div className={styles.actions}>

              {/* LinkedIn */}

              <a
                className={styles.socialLink}
                href="https://www.linkedin.com/in/elizabeth-del-a-franco-2246273a9/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                data-hand-target
                data-hand-style="icon"
              >
                <svg
                  className={styles.socialIcon}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M6.5 8.5H3.2V21h3.3V8.5ZM4.85 3A1.93 1.93 0 1 0 4.85 6.86 1.93 1.93 0 0 0 4.85 3ZM21 13.84c0-3.77-2.01-5.52-4.69-5.52-2.16 0-3.13 1.19-3.67 2.03V8.5H9.35V21h3.29v-6.19c0-1.63.31-3.2 2.32-3.2 1.98 0 2.01 1.85 2.01 3.31V21H21v-7.16Z"
                  />
                </svg>
              </a>


              {/* GitHub */}

              <a
                className={styles.socialLink}
                href="https://github.com/ElizabethFranangel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                data-hand-target
                data-hand-style="icon"
              >
                <svg
                  className={styles.socialIcon}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.27 9.27 0 0 1 12 6.93c.85 0 1.71.12 2.51.36 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
                  />
                </svg>
              </a>


              {/* View CV */}

              <a
                className={styles.primaryButton}
                href="#cv"
                data-hand-target
                data-hand-style="box"
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>

            </div>


            <div className={styles.status}>
              <span className={styles.statusDot} />

              <a
                href="https://orcid.org/0009-0006-1800-9996"
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Elizabeth del Ángel Franco ORCID profile"
                data-hand-target
              >
                ORCID 0009-0006-1800-9996
              </a>
            </div>

          </div>


          <div className={styles.visual} data-hero-visual>
            <div className={styles.orbCaption}>
              <span>
                SCIENTIFIC NETWORK
              </span>

              <small>
                PARTICLES + HAND TRACKING
              </small>
            </div>
          </div>

          </div>

          <div className={styles.homeLower}>
            <div className={styles.previewGrid} aria-label="Explore the portfolio">
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
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <span className={styles.previewLink}>Learn more <span aria-hidden="true">→</span></span>
                  <span className={styles.cardDecoration} aria-hidden="true" />
                </a>
              ))}
            </div>

          </div>


          <div className={styles.scrollIndicator}>
            <span>
              SWIPE TO EXPLORE
            </span>

            <div className={styles.scrollLine} />
          </div>

        </section>

        <footer className={styles.quoteStrip} aria-label="Portfolio closing thought">
          <span className={styles.quoteMark} aria-hidden="true">“</span>
          <blockquote>
            Efficiency is not just about speed. It is about making intelligent choices that create sustainable impact.
          </blockquote>
          <div className={styles.signature}>
            <span />
            Elizabeth del Ángel Franco
          </div>
        </footer>

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
      <PortfolioContent />
    </InteractionProvider>
  );
}
