"use client";

import { FormEvent, useRef, useState } from "react";
import styles from "../../page.module.css";

type PortfolioChaptersProps = {
  onNavigate: (section: number) => void;
};

type PublicationType = "journal" | "conference" | "bookChapter" | "presentation";

type Publication = {
  id: string;
  year: number;
  type: PublicationType;
  title: string;
  authors: readonly { name: string; featured?: boolean }[];
  journal: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  tags: readonly string[];
};

const publications = ([
  {
    id: "J01",
    year: 2025,
    type: "journal",
    title: "Experimental Study of Optimization Algorithms for Resource Allocation in Cloud Computing",
    authors: [
      { name: "Del Angel Franco, E.", featured: true },
      { name: "Gómez-Santillán, C. G." },
      { name: "Cruz Reyes, L." },
      { name: "Rangel Valdez, N." },
      { name: "Rivera Zarate, G." },
    ],
    journal: "International Journal of Combinatorial Optimization Problems and Informatics",
    volume: "16",
    issue: "4",
    pages: "399–415",
    doi: "10.61467/2007.1558.2025.v16i4.983",
    tags: ["Cloud Computing", "Resource Allocation", "Optimization"],
  },
] satisfies Publication[]).sort((a, b) => b.year - a.year);

const scientificPresentations = [
  { id: "P01", year: 2025, month: "August 2025", type: "Scientific Presentation", title: "Efficient Workflow Scheduling with Heterogeneous Virtual Machines Using Competitive Coevolution", event: "International Seminar of Computational Intelligence — ISCI 2025" },
  { id: "P02", year: 2024, month: "November 2024", type: "Oral Presentation", title: "Experimental Study of Optimization Algorithms for Resource Allocation in Cloud Computing", event: "Eureka International Workshop on Artificial Intelligence and Data Analytics — Eureka 2024" },
  { id: "P03", year: 2024, month: "August 2024", type: "Scientific Presentation", title: "Comparative Study of Algorithms for Optimal Resource Allocation in Cloud Computing", event: "International Seminar of Computational Intelligence — ISCI 2024" },
] as const;

const researchNodes = [
  "Multiobjective Optimization",
  "Metaheuristics",
  "Resource Allocation",
  "Cloud Computing",
  "Evolutionary Algorithms",
  "Scheduling Optimization",
] as const;

const researchPipeline = [
  "Scientific Workflow",
  "Ready Tasks",
  "Optimization Algorithm",
  "Resource Allocation",
  "Virtual Machines",
  "Execution",
  "Performance Evaluation",
] as const;

const optimizationFamilies = [
  { family: "Evolutionary", methods: ["NSGA-II", "NSGA-III", "Genetic Algorithms"] },
  { family: "Cooperative", methods: ["Cooperative Coevolution", "Multi-species approaches"] },
  { family: "Swarm / Population-based", methods: ["ACO", "PSO", "Differential Evolution"] },
] as const;

const workflowBenchmarks = ["CyberShake", "Epigenomics", "Montage", "LIGO Inspiral", "SIPHT"] as const;

const projects = [
  {
    id: "P01",
    type: "Research Software",
    status: "Published Research",
    title: "GA Scheduling Algorithm for WorkflowSim",
    subtitle: "Genetic Algorithm implementation for scientific workflow scheduling in cloud computing environments.",
    description: "Implementation of a Genetic Algorithm scheduler integrated directly into WorkflowSim 1.0 for experimental evaluation of scientific workflow scheduling in cloud computing.",
    repository: "PCC-ITCM-TecNM / GAScheduling",
    repositoryUrl: "https://github.com/PCC-ITCM-TecNM/GAScheduling",
    repositoryAvailable: true,
    topics: ["Workflow Scheduling", "Resource Allocation", "Cloud Computing", "Genetic Algorithms"],
    technologies: ["Java", "WorkflowSim 1.0", "CloudSim"],
  },
  {
    id: "P02",
    type: "Ongoing Research",
    status: "Research in Progress",
    title: "Cloud Workflow Scheduling Metaheuristics",
    subtitle: "Research software for computational experimentation in cloud workflow scheduling.",
    description: "Research repository focused on the development and experimental evaluation of metaheuristic approaches for workflow scheduling in cloud computing environments.",
    repository: "ElizabethFranangel / CloudWorkflowSchedulingMetaheuristics",
    repositoryUrl: "https://github.com/ElizabethFranangel/CloudWorkflowSchedulingMetaheuristics",
    repositoryAvailable: false,
    topics: ["Workflow Scheduling", "Cloud Computing", "Metaheuristics", "Multiobjective Optimization"],
    technologies: [],
  },
] as const;

const teachingInterests = [
  "Programming",
  "Algorithms & Data Structures",
  "Artificial Intelligence",
  "Optimization",
  "Databases",
  "Cloud Computing",
  "Foundations of Computer Science",
  "Data Analysis",
] as const;

const academicActivities = [
  { year: "2024", type: "Workshop", title: "Applications of Artificial Intelligence", context: "International Day of Women and Girls in Science", detail: "Ciudad Madero, Tamaulipas", verified: true },
  { year: "2023", type: "Scientific Outreach Talk", title: "A walk through the paths of Artificial Intelligence", context: "Introductory scientific outreach on artificial intelligence for student audiences.", verified: true },
  { year: "2022", type: "Adjunct Academic Support", title: "Analysis and Design of Algorithms", context: "Computer Systems Engineering", detail: "Instituto Tecnológico de Ciudad Madero", verified: true },
] as const;

const teachingAreas = [
  { group: "Foundations", areas: ["Programming", "Object-Oriented Programming", "Algorithms", "Data Structures", "Computational Logic"] },
  { group: "Data & Intelligence", areas: ["Artificial Intelligence", "Data Analysis", "Databases", "Machine Learning Foundations"] },
  { group: "Advanced Computing", areas: ["Optimization", "Metaheuristics", "Cloud Computing", "Computational Resource Allocation"] },
] as const;

export default function PortfolioChapters({ onNavigate }: PortfolioChaptersProps) {
  const [formStatus, setFormStatus] = useState("");
  const [activeResearchTab, setActiveResearchTab] = useState(0);
  const [activeTeachingTab, setActiveTeachingTab] = useState(0);
  const [activePublicationTab, setActivePublicationTab] = useState(0);
  const [activeProjectTab, setActiveProjectTab] = useState(0);
  const researchNavigationRef = useRef<HTMLDivElement>(null);
  const teachingNavigationRef = useRef<HTMLDivElement>(null);
  const publicationNavigationRef = useRef<HTMLDivElement>(null);
  const projectNavigationRef = useRef<HTMLDivElement>(null);

  const publicationTabs = [
    { label: "Journal Article", count: publications.filter((publication) => publication.type === "journal").length },
    { label: "Book Chapters", count: 1 },
    { label: "Books", count: 1 },
    { label: "Under review", count: 1 },
    { label: "Scientific presentations", count: scientificPresentations.length },
  ] as const;

  const activePublicationPage = Math.floor(activePublicationTab / 2);

  const showNextPublicationPage = () => {
    const nextPage = (activePublicationPage + 1) % 3;
    const nextTab = nextPage * 2;
    setActivePublicationTab(nextTab);
    publicationNavigationRef.current?.children[nextTab]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const showNextTeachingPage = () => {
    const nextTab = (activeTeachingTab + 1) % 2;
    setActiveTeachingTab(nextTab);
    teachingNavigationRef.current?.children[nextTab]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const showNextResearchPage = () => {
    const nextTab = (activeResearchTab + 1) % 3;
    setActiveResearchTab(nextTab);
    researchNavigationRef.current?.children[nextTab]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const showNextProjectPage = () => {
    const nextTab = (activeProjectTab + 1) % 2;
    setActiveProjectTab(nextTab);
    projectNavigationRef.current?.children[nextTab]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus(
      "The contact form is ready for a verified delivery service. For now, please connect with me on LinkedIn."
    );
  };

  return (
    <>
      <section id="about" className={`${styles.chapter} ${styles.aboutChapter}`}>
        <span className={styles.chapterNumber} aria-hidden="true">01</span>
        <div className={styles.chapterDecor} aria-hidden="true" />
        <div className={styles.chapterInner}>
          <header className={styles.chapterHeader}>
            <p className={styles.sectionEyebrow}>01 / About me</p>
            <h2 className={styles.sectionTitle}>Research, technology and <span>purpose.</span></h2>
          </header>

          <div className={styles.aboutEditorial}>
            <div className={styles.aboutIntro}>
              <figure
                className={styles.aboutPortrait}
                data-about-portrait
                role="img"
                aria-label="Elizabeth del Ángel Franco"
              />

              <div className={styles.aboutProfile}>
                <p className={styles.microLabel}>Professional profile</p>
                <p>
                  Computer science researcher specializing in intelligent optimization,
                  multi-objective metaheuristics, and workflow scheduling in cloud computing environments.
                </p>
                <p>
                  My profile combines scientific research, software development, and data analysis
                  with the design of methods for optimization and efficient resource allocation. My
                  work focuses on applied research, university teaching, and the development of
                  computational solutions for complex problems.
                </p>
                <div className={styles.keywordRow} aria-label="Professional areas">
                  <span>Research</span><span>Software</span><span>Data</span><span>Teaching</span>
                </div>
              </div>
            </div>

            <div className={styles.academicPath} aria-label="Academic timeline">
              <p className={styles.microLabel}>Academic timeline</p>
              <ol>
                <li>
                  <time>2022 – Degree candidate</time>
                  <strong>Doctorate in Computer Science</strong>
                  <small>Instituto Tecnológico de Ciudad Madero</small>
                  <em>Research line: intelligent optimization.</em>
                </li>
                <li>
                  <time>2018 – 2020</time>
                  <strong>Master of Science in Computer Science</strong>
                  <small>Instituto Tecnológico de Ciudad Madero</small>
                  <em>Thesis: data acquisition and preprocessing module for a compensatory fuzzy logic scientific core.</em>
                </li>
                <li>
                  <time>2011 – 2017</time>
                  <strong>Computer Systems Engineering</strong>
                  <small>Instituto Tecnológico de Ciudad Madero</small>
                  <em>Professional internship in the postgraduate studies department.</em>
                </li>
                <li>
                  <time>2006 – 2010</time>
                  <strong>Programming Analyst Technician</strong>
                  <small>Instituto de Ciencias y Estudios Superiores de Tamaulipas</small>
                  <em>Graduation project: point-of-sale application development.</em>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="research" className={`${styles.chapter} ${styles.researchChapter}`}>
        <span className={styles.chapterNumber} aria-hidden="true">02</span>
        <div className={styles.chapterInner}>
          <header className={`${styles.chapterHeader} ${styles.researchContentHero}`}>
            <p className={styles.sectionEyebrow}>02 / Research</p>
          </header>

          <div ref={researchNavigationRef} className={styles.publicationOverview} role="tablist" aria-label="Research subsections">
            {[{ label: "Research journey", count: 2 }, { label: "Research areas", count: 8 }, { label: "Academic development", count: 4 }].map((tab, index) => (
              <button key={tab.label} type="button" role="tab" aria-selected={activeResearchTab === index} aria-controls={`research-panel-${index}`} className={activeResearchTab === index ? styles.activePublicationTab : undefined} onClick={(event) => { setActiveResearchTab(index); event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }} data-hand-prev={index === (activeResearchTab + 2) % 3 ? "" : undefined} data-hand-next={index === (activeResearchTab + 1) % 3 ? "" : undefined} data-hand-target data-hand-style="box"><strong>{String(tab.count).padStart(2, "0")}</strong><span>{tab.label}</span></button>
            ))}
          </div>

          <div className={styles.researchTabBody}>
          <div key={activeResearchTab} className={styles.researchTabPanel} id={`research-panel-${activeResearchTab}`} role="tabpanel">
          {activeResearchTab === 0 && <section className={styles.researchJourney} aria-labelledby="research-journey-title">
            <p className={styles.microLabel} id="research-journey-title">Research journey</p>
            <div className={styles.researchJourneyGrid}>
              <article><span className={styles.blockIndex}>01</span><p className={styles.microLabel}>Master&apos;s research</p><time>2018 – 2020</time><h3>Data Preprocessing</h3><p>Development of a data acquisition and preprocessing module for a scientific computing system, focusing on the preparation and transformation of data prior to subsequent analysis.</p></article>
              <span className={styles.journeyArrow} aria-hidden="true">→</span>
              <article><span className={styles.blockIndex}>02</span><p className={styles.microLabel}>Doctoral research</p><time>2022 – Present</time><h3>Intelligent Optimization in Cloud Environments</h3><p>Design and experimental evaluation of multi-objective metaheuristics for workflow scheduling and efficient allocation of computational resources in cloud computing environments.</p></article>
            </div>
          </section>}

          {activeResearchTab === 1 && <div className={styles.researchContentGrid}>
            <section className={styles.researchAreasContent} aria-labelledby="research-areas-title">
              <p className={styles.microLabel} id="research-areas-title">Research areas</p>
              <div>
                {[
                  ["Intelligent Optimization", "Design of algorithms for solving complex optimization problems."],
                  ["Multi-objective Metaheuristics", "Development of metaheuristic approaches for multiple conflicting objectives."],
                  ["Workflow Scheduling", "Scheduling and allocation of computational workflows under multiple objectives."],
                  ["Cloud Computing", "Efficient resource allocation and performance optimization in cloud environments."],
                  ["Computational Resource Allocation", "Strategies to allocate resources efficiently and cost-effectively."],
                  ["Data Preprocessing", "Acquisition, cleaning and preparation of data to improve quality and usability."],
                  ["Experimental Analysis", "Comparative evaluation of algorithms using experiments and statistical analysis."],
                  ["Data Analysis", "Exploratory analysis and extraction of insights from data."],
                ].map(([title, description], index) => <article key={title} data-hand-target data-hand-style="box"><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}
              </div>
            </section>

          </div>}

          {activeResearchTab === 2 && <section><p className={styles.microLabel}>Academic development</p><ul className={styles.academicDevelopmentList}>
            {[
              ["AD01", "2026", "Administración de amenazas cibernéticas", "UNAM · Julio 2026"],
              ["AD02", "2025", "Diplomado en integración de inteligencia artificial en escenarios de aprendizaje", "TecNM · Mayo 2025"],
              ["AD03", "2024", "MENDIX Developer", "mx Mendix · Abril 2024"],
              ["AD04", "2024", "Ciencias de Datos", "TecNM · Enero 2024"],
            ].map(([id, year, title, institution]) => <li key={id}><span>{id}</span><div><h3>{title}</h3><p>{institution}</p></div><time>{year}</time></li>)}
          </ul></section>}
          </div>
          <button className={styles.publicationBodyNext} type="button" onClick={showNextResearchPage} aria-label="Show next research subsection" data-hand-target data-hand-next data-hand-style="icon">›</button>
          </div>
        </div>
      </section>

      <section id="teaching" className={`${styles.chapter} ${styles.teachingChapter}`}>
        <span className={styles.chapterNumber} aria-hidden="true">03</span>
        <div className={styles.chapterInner}>
          <header className={`${styles.chapterHeader} ${styles.teachingHero}`}>
            <p className={styles.sectionEyebrow}>03 / Teaching &amp; academic engagement</p>
          </header>

          <div ref={teachingNavigationRef} className={styles.publicationOverview} role="tablist" aria-label="Teaching subsections">
            {[
              { label: "Teaching experience", count: 1 },
              { label: "Academic & scientific outreach", count: 2 },
            ].map((tab, index) => (
              <button key={tab.label} type="button" role="tab" aria-selected={activeTeachingTab === index} aria-controls={`teaching-panel-${index}`} className={activeTeachingTab === index ? styles.activePublicationTab : undefined} onClick={(event) => { setActiveTeachingTab(index); event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }} data-hand-prev={index === (activeTeachingTab + 1) % 2 ? "" : undefined} data-hand-next={index === (activeTeachingTab + 1) % 2 ? "" : undefined} data-hand-target data-hand-style="box">
                <strong>{String(tab.count).padStart(2, "0")}</strong><span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.teachingBody}>
            <div key={activeTeachingTab} className={styles.teachingPanel} id={`teaching-panel-${activeTeachingTab}`} role="tabpanel">
              {activeTeachingTab === 0 && <section><p className={styles.microLabel}>Teaching experience</p><article className={styles.publicationEntry}><div className={styles.publicationIndex}><strong>TE01</strong><time>2022</time><span>Adjunct Academic Support</span></div><div className={styles.publicationRecord}><h3>Analysis and Design of Algorithms</h3><p className={styles.publicationAuthors}>Academic support within the Computer Systems Engineering program.</p><p className={styles.publicationJournal}>Tecnológico Nacional de México · Instituto Tecnológico de Ciudad Madero</p><p className={styles.publicationMeta}>Aug — Dec 2022</p><ul className={styles.publicationTags}><li>Algorithms</li><li>Computer Science</li><li>2022</li></ul></div></article></section>}

              {activeTeachingTab === 1 && <section><p className={styles.microLabel}>Academic &amp; scientific outreach</p><div className={styles.publicationArchive}>
                <article className={styles.publicationEntry}><div className={styles.publicationIndex}><strong>01</strong><time>2024</time><span>Workshop</span></div><div className={styles.publicationRecord}><h3>Applications of Artificial Intelligence</h3><p className={styles.publicationJournal}>International Day of Women and Girls in Science</p><p className={styles.publicationMeta}>Ciudad Madero, Tamaulipas</p><ul className={styles.publicationTags}><li>Verified activity</li></ul></div></article>
                <article className={styles.publicationEntry}><div className={styles.publicationIndex}><strong>02</strong><time>2023</time><span>Scientific Outreach Talk</span></div><div className={styles.publicationRecord}><h3>A walk through the paths of Artificial Intelligence</h3><p className={styles.publicationAuthors}>Introductory scientific outreach on artificial intelligence for student audiences.</p><ul className={styles.publicationTags}><li>Verified activity</li></ul></div></article>
              </div></section>}
            </div>
            <button className={styles.publicationBodyNext} type="button" onClick={showNextTeachingPage} aria-label="Show next teaching subsection" data-hand-target data-hand-next data-hand-style="icon">›</button>
          </div>
        </div>
      </section>

      <section id="publications" className={`${styles.chapter} ${styles.publicationsChapter}`}>
        <span className={styles.chapterNumber} aria-hidden="true">04</span>
        <div className={styles.chapterInner}>
          <header className={`${styles.chapterHeader} ${styles.publicationsHero}`}>
            <p className={styles.sectionEyebrow}>04 / Publications</p>
          </header>

          <div className={styles.publicationNavigation}>
            <div ref={publicationNavigationRef} className={styles.publicationOverview} role="tablist" aria-label="Publication subsections">
              {publicationTabs.map((tab, index) => (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={activePublicationTab === index}
                  aria-controls={`publication-panel-${index}`}
                  className={activePublicationTab === index ? styles.activePublicationTab : undefined}
                  onClick={(event) => {
                    setActivePublicationTab(index);
                    event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                  }}
                  data-hand-target
                  data-hand-prev={index === (activePublicationTab + publicationTabs.length - 1) % publicationTabs.length ? "" : undefined}
                  data-hand-next={index === (activePublicationTab + 1) % publicationTabs.length ? "" : undefined}
                  data-hand-style="box"
                >
                  <strong>{String(tab.count).padStart(2, "0")}</strong>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.publicationBody}>
          <div key={activePublicationPage} className={styles.publicationsEditorial} id={`publication-panel-${activePublicationTab}`} role="tabpanel">
            {activePublicationPage === 0 && (
            <>
            <section className={styles.peerReviewed} aria-labelledby="peer-reviewed-title">
              <p className={styles.microLabel} id="peer-reviewed-title">Journal Article</p>
              <div className={styles.publicationArchive}>
                {publications.map((publication) => (
                  <article key={publication.id} className={styles.publicationEntry}>
                    <div className={styles.publicationIndex}><strong>{publication.id}</strong><time>{publication.year}</time><span>Featured publication</span></div>
                    <div className={styles.publicationRecord}>
                      <h3>{publication.title}</h3>
                      <p className={styles.publicationAuthors} aria-label={`Authors: ${publication.authors.map((author) => author.name).join(", ")}`}>
                        {publication.authors.map((author, index) => (
                          <span key={author.name} className={author.featured ? styles.featuredAuthor : undefined}>
                            {author.name}{index < publication.authors.length - 1 ? "; " : ""}
                          </span>
                        ))}
                      </p>
                      <p className={styles.publicationJournal}>{publication.journal}</p>
                      <p className={styles.publicationMeta}>Vol. {publication.volume} · No. {publication.issue} · pp. {publication.pages} · {publication.year}</p>
                      <code>{publication.doi}</code>
                      <ul>{publication.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                      <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" data-hand-target data-hand-style="box" aria-label={`Open DOI for ${publication.title}`}>DOI <span aria-hidden="true">↗</span></a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className={styles.peerReviewed}>
              <p className={styles.microLabel}>Book Chapters</p>
              <div className={styles.publicationArchive}>
                <article className={styles.publicationEntry}>
                  <div className={styles.publicationIndex}><strong>BC01</strong><time>—</time><span>Book chapter</span></div>
                  <div className={styles.publicationRecord}>
                    <h3>Book chapter details forthcoming</h3>
                    <p className={styles.publicationAuthors}>Author information will be added.</p>
                    <p className={styles.publicationJournal}>Book and publisher information forthcoming</p>
                    <p className={styles.publicationMeta}>Publication metadata will be added when available.</p>
                    <ul><li>Book Chapter</li></ul>
                  </div>
                </article>
              </div>
            </section>
            </>
            )}

            {activePublicationPage === 1 && (
              <>
              <section className={styles.peerReviewed}>
                <p className={styles.microLabel}>Books</p>
                <div className={styles.publicationArchive}>
                  <article className={styles.publicationEntry}>
                    <div className={styles.publicationIndex}><strong>B01</strong><time>—</time><span>Book</span></div>
                    <div className={styles.publicationRecord}>
                      <h3>Book details forthcoming</h3>
                      <p className={styles.publicationAuthors}>Author information will be added.</p>
                      <p className={styles.publicationJournal}>Publisher information forthcoming</p>
                      <p className={styles.publicationMeta}>Publication metadata will be added when available.</p>
                      <ul><li>Book</li></ul>
                    </div>
                  </article>
                </div>
              </section>
              <section className={styles.peerReviewed}>
                <p className={styles.microLabel}>Under review</p>
                <div className={styles.publicationArchive}>
                  <article className={styles.publicationEntry}>
                    <div className={styles.publicationIndex}><strong>UR01</strong><time>2026</time><span>Under review</span></div>
                    <div className={styles.publicationRecord}>
                      <h3>Ablation Study Based on a Factorial Analysis of the Workflow Scheduling Problem</h3>
                      <p className={styles.publicationAuthors}>
                        <span className={styles.featuredAuthor}>Elizabeth Del-Angel-Franco</span>; Claudia Guadalupe Gómez-Santillán; Laura Cruz-Reyes; Nelson Rangel-Valdez; and Gilberto Rivera-Zarate
                      </p>
                      <p className={styles.publicationJournal}><strong>Under review in</strong> Computación y Sistemas</p>
                      <p className={styles.publicationMeta}><strong>2026</strong> · JCR · IF = 0.8 in 2025–2026</p>
                      <ul><li>Under Review</li><li>Workflow Scheduling</li><li>Factorial Analysis</li></ul>
                    </div>
                  </article>
                </div>
              </section>
              </>
            )}

            {activePublicationPage === 2 && (
            <section className={styles.presentationsSection} aria-labelledby="presentations-title">
              <p className={styles.microLabel} id="presentations-title">Scientific presentations</p>
              <div className={styles.publicationArchive}>
                {scientificPresentations.map((presentation) => (
                  <article key={presentation.id} className={styles.publicationEntry}>
                    <div className={styles.publicationIndex}><strong>{presentation.id}</strong><time>{presentation.year}</time><span>{presentation.type}</span></div>
                    <div className={styles.publicationRecord}>
                      <h3>{presentation.title}</h3>
                      <p className={styles.publicationJournal}>{presentation.event}</p>
                      <p className={styles.publicationMeta}>{presentation.month}</p>
                      <ul><li>Presentation</li></ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            )}
          </div>
          <button className={styles.publicationBodyNext} type="button" onClick={showNextPublicationPage} aria-label="Show next publication information page" data-hand-target data-hand-next data-hand-style="icon">›</button>
          </div>
        </div>
      </section>

      <section id="projects" className={`${styles.chapter} ${styles.projectsChapter}`}>
        <span className={styles.chapterNumber} aria-hidden="true">05</span>
        <div className={styles.chapterInner}>
          <header className={`${styles.chapterHeader} ${styles.projectsHero}`}>
            <p className={styles.sectionEyebrow}>05 / Projects</p>
          </header>

          <div ref={projectNavigationRef} className={styles.projectOverview} role="tablist" aria-label="Project subsections">
            {[<>Research &amp;<br />Algorithms</>, <>Software &amp;<br />Systems</>].map((label, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={activeProjectTab === index}
                aria-controls={`project-panel-${index}`}
                className={activeProjectTab === index ? styles.activeProjectTab : undefined}
                onClick={(event) => {
                  setActiveProjectTab(index);
                  event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                }}
                data-hand-target
                data-hand-prev={index === (activeProjectTab + 1) % 2 ? "" : undefined}
                data-hand-next={index === (activeProjectTab + 1) % 2 ? "" : undefined}
                data-hand-style="box"
              >
                <strong>{String(projects.length).padStart(2, "0")}</strong><span>{label}</span>
              </button>
            ))}
          </div>

          <div className={styles.projectArchiveBody}>
          <section key={activeProjectTab} className={styles.selectedProjects} id={`project-panel-${activeProjectTab}`} role="tabpanel" aria-labelledby="selected-projects-title">
            <p className={styles.microLabel} id="selected-projects-title">{activeProjectTab === 0 ? "Research & Algorithms" : "Software & Systems"}</p>
            {activeProjectTab === 0 && projects.map((project) => (
              <article key={project.id} className={styles.projectEntry}>
                <aside className={styles.projectIdentity}>
                  <strong>{project.id}</strong><span>{project.type}</span><em>{project.status}</em>
                </aside>
                <div className={styles.projectBody}>
                  <div className={styles.projectHeading}>
                    <h3>{project.title}</h3>
                    <div className={styles.projectActions}>
                      {project.repositoryAvailable ? <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" data-hand-target data-hand-style="box">View repository <span aria-hidden="true">↗</span></a> : <span>Repository forthcoming</span>}
                    </div>
                  </div>
                  <p className={styles.projectSubtitle}>{project.subtitle}</p>
                  <p>{project.description}</p>
                  {project.id === "P01" && <p>The repository provides the implementation used in the published study and supports reproducibility of the experimental scheduling setup.</p>}

                  <div className={styles.projectTopics}><span>Related research</span><ul>{project.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></div>

                  {project.id === "P01" ? (
                    <div className={styles.schedulingDiagram} aria-label="Conceptual task scheduling diagram">
                      <div><span>T1</span><span>T2</span><span>T3</span><span>T4</span></div><strong>Scheduler</strong><div><span>VM1</span><span>VM2</span><span>VM3</span></div>
                    </div>
                  ) : (
                    <div className={styles.metaheuristicFlow} aria-label="Ongoing research flow"><span>Workflow</span><i>→</i><span>Metaheuristic research</span><i>→</i><span>Candidate schedules</span><i>→</i><span>Evaluation</span></div>
                  )}

                </div>

                <aside className={styles.projectTechnical}>
                  <p className={styles.microLabel}>Technical summary</p>
                  {project.id === "P01" ? (
                    <div className={styles.projectTechnicalGrid}>
                      <dl><div><dt>Problem</dt><dd>Scientific workflow scheduling</dd></div><div><dt>Objective</dt><dd>Makespan minimization</dd></div><div><dt>Environment</dt><dd>WorkflowSim 1.0</dd></div><div><dt>Language</dt><dd>Java</dd></div><div><dt>Simulation</dt><dd>CloudSim</dd></div><div><dt>Status</dt><dd>Published Research</dd></div></dl>
                      <div className={styles.projectTechnicalDetails}>
                        <div className={styles.workflowBenchmarks}><span>Workflow benchmarks</span><ul>{["Montage", "CyberShake", "Inspiral", "SIPHT", "Epigenomics"].map((workflow) => <li key={workflow}>{workflow}</li>)}</ul></div>
                        <div className={styles.reproducibility}><strong>Reproducible research</strong><p>The repository contains the scheduling implementation and workflow resources required to reproduce the experimental setup used in the associated study.</p></div>
                        <div className={styles.projectPublication}><span>Project → Publication</span><strong>Experimental Study of Optimization Algorithms for Resource Allocation in Cloud Computing</strong><small>IJCOPI · 2025 · 16(4), 399–415</small><code>10.61467/2007.1558.2025.v16i4.983</code></div>
                      </div>
                    </div>
                  ) : (
                    <><p className={styles.repositoryName}>{project.repository}</p><div className={styles.projectPath}><span>Research Software</span><i>↓</i><span>Experimental Study</span><i>↓</i><span>Ongoing Research</span></div></>
                  )}
                  {project.technologies.length > 0 && <p className={styles.projectTechLine}>Tech / {project.technologies.join(" · ")}</p>}
                </aside>
              </article>
            ))}

            {activeProjectTab === 1 && <>
              <article className={`${styles.projectEntry} ${styles.softwareProjectEntry}`}>
                <aside className={styles.projectIdentity}><strong>S01</strong><span>Interactive Web Application</span><em>Personal Project</em></aside>
                <div className={styles.projectBody}>
                  <div className={styles.projectHeading}><h3>Interactive Academic Portfolio</h3></div>
                  <p className={styles.projectSubtitle}>Interactive Web Application · Personal Project</p>
                  <p>Diseño y desarrollo de un portafolio web académico interactivo para presentar experiencia profesional, investigación, publicaciones y proyectos de software. La plataforma combina una interfaz responsiva con elementos de interacción visual y navegación mediante mouse y reconocimiento de gestos de mano, buscando una experiencia de usuario más dinámica que la de un CV web convencional.</p>
                  <p>El proyecto integra una arquitectura basada en componentes reutilizables, modos claro y oscuro, diseño adaptable a diferentes resoluciones y elementos gráficos interactivos orientados a mantener una identidad visual académica y tecnológica.</p>
                  <div className={styles.projectTopics}><span>Key features</span><ul>{["Responsive interface", "Gesture-based interaction", "Mouse navigation", "Light / dark mode", "Interactive visual components", "Modular content sections"].map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
                </div>
                <aside className={`${styles.projectTechnical} ${styles.projectEvidence}`}><p className={styles.microLabel}>Project evidence</p><figure><img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/interactive-academic-portfolio-evidence.png`} alt="Home screen of the Interactive Academic Portfolio" /><figcaption>Interactive Academic Portfolio · Home interface</figcaption></figure></aside>
              </article>

              <article className={`${styles.projectEntry} ${styles.softwareProjectEntry}`}>
                <aside className={styles.projectIdentity}><strong>S02</strong><span>Desktop Management System</span><em>Client Project</em></aside>
                <div className={styles.projectBody}>
                  <div className={styles.projectHeading}><h3>Gym Management &amp; Point-of-Sale System</h3></div>
                  <p className={styles.projectSubtitle}>Desktop Management System · Client Project</p>
                  <p>Diseño y desarrollo de un sistema de escritorio para la gestión operativa de un gimnasio, orientado a centralizar el registro de clientes, mensualidades, pagos y operaciones de punto de venta en una única aplicación.</p>
                  <p>El sistema contempla la administración del estado de las membresías, historial de pagos, métodos de pago, fechas de vencimiento y consultas administrativas, además del registro de productos y ventas realizadas dentro del gimnasio. Su diseño está enfocado en simplificar las actividades cotidianas de recepción y proporcionar al negocio un control estructurado de su información.</p>
                  <p>Desarrollado bajo una arquitectura de aplicación de escritorio utilizando JavaFX y PostgreSQL, con posibilidad de incorporar nuevos módulos conforme evolucionen las necesidades operativas del gimnasio.</p>
                  <div className={styles.projectTopics}><span>Key features</span><ul>{["Client management", "Membership tracking", "Payment records", "Expiration control", "Point of sale", "Product management", "Administrative queries"].map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
                </div>
                <aside className={`${styles.projectTechnical} ${styles.projectEvidence}`}><p className={styles.microLabel}>Project evidence</p><div className={styles.evidencePending}><span>Image forthcoming</span><small>Gym Management &amp; Point-of-Sale System</small></div></aside>
              </article>
            </>}
          </section>
          <button className={styles.projectBodyNext} type="button" onClick={showNextProjectPage} aria-label="Show next project subsection" data-hand-target data-hand-next data-hand-style="icon">›</button>
          </div>
        </div>
      </section>

      <section id="contact" className={`${styles.chapter} ${styles.contactChapter}`}>
        <span className={styles.chapterNumber} aria-hidden="true">06</span>
        <div className={styles.chapterInner}>
          <div className={styles.contactEditorial}>
            <div>
              <p className={styles.sectionEyebrow}>06 / Contact</p>
              <h2 className={styles.sectionTitle}>Let&apos;s <span>connect.</span></h2>
              <p className={styles.chapterIntro}>I welcome conversations about academic collaboration, research, university teaching, technology projects and professional opportunities.</p>
              <div className={styles.contactLinks}>
                <a href="https://www.linkedin.com/in/elizabeth-del-a-franco-2246273a9/" target="_blank" rel="noopener noreferrer" data-hand-target>LinkedIn <span>↗</span></a>
                <a href="https://github.com/ElizabethFranangel" target="_blank" rel="noopener noreferrer" data-hand-target>GitHub <span>↗</span></a>
              </div>
            </div>

            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <label>Name<input name="name" autoComplete="name" required /></label>
              <label>Email<input name="email" type="email" autoComplete="email" required /></label>
              <label>Subject<input name="subject" required /></label>
              <label>Message<textarea name="message" rows={4} required /></label>
              <button type="submit" data-hand-target data-hand-style="box">Send message <span>→</span></button>
              <p className={styles.formStatus} role="status" aria-live="polite">{formStatus}</p>
            </form>
          </div>
        </div>
        <footer className={styles.footer}>
          <span>Elizabeth del Ángel Franco</span>
          <span>© 2026 · Computer Science Researcher</span>
          <button type="button" onClick={() => onNavigate(0)} data-hand-target>Back to top ↑</button>
        </footer>
      </section>
    </>
  );
}
