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

const publications: Publication[] = ([
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
  { id: "P08", year: 2025, month: "24–26 November 2025", type: "Scientific Presentation", title: "Optimización aplicada a la localización de recursos en línea en nubes basadas en contenedores", event: "I Cumbre Nacional de Posgrados · 10.º Coloquio de Posgrados del IIT — Ciudad Juárez, Chihuahua" },
  { id: "P01", year: 2025, month: "August 2025", type: "Scientific Presentation", title: "Efficient Workflow Scheduling with Heterogeneous Virtual Machines Using Competitive Coevolution", event: "International Seminar of Computational Intelligence — ISCI 2025" },
  { id: "P02", year: 2024, month: "November 2024", type: "Oral Presentation", title: "Experimental Study of Optimization Algorithms for Resource Allocation in Cloud Computing", event: "Eureka International Workshop on Artificial Intelligence and Data Analytics — Eureka 2024" },
  { id: "P03", year: 2024, month: "August 2024", type: "Scientific Presentation", title: "Comparative Study of Algorithms for Optimal Resource Allocation in Cloud Computing", event: "International Seminar of Computational Intelligence — ISCI 2024" },
  { id: "P07", year: 2023, month: "27–29 November 2023", type: "Scientific Presentation", title: "A literature analysis to encourage decision-making on strategies to enhance energy efficiency in the cloud computing environment", event: "International Workshop on Artificial Intelligence and Analytics — Eureka 2023 · Jaén, Spain" },
  { id: "P06", year: 2023, month: "25–26 October 2023", type: "Scientific Presentation", title: "La computación en la nube como un reto ambiental y la computación evolutiva al rescate", event: "Seminario de Cómputo Inteligente e Ingeniería 2023 · Instituto Tecnológico de Ciudad Madero" },
  { id: "P05", year: 2023, month: "4–5 October 2023", type: "Scientific Presentation", title: "Optimización aplicada a la asignación de recursos en nubes basadas en contenedores", event: "Encuentro de Jóvenes Investigadores Tamaulipas 2023 · COTACYT" },
  { id: "P04", year: 2023, month: "30–31 August 2023", type: "Scientific Presentation", title: "Analysis of Strategies for Improving Energy Efficiency in Cloud Computing", event: "International Seminar of Computational Intelligence — ISCI 2023 · Tijuana, Mexico (online)" },
];

const academicDevelopment = [
  { id: "AD01", year: "2026", title: "Administración de Amenazas Cibernéticas", institution: "Universidad Nacional Autónoma de México · Cisco Networking Academy", date: "1 August 2026" },
  { id: "AD02", year: "2025", title: "Diplomado en integración de inteligencia artificial en escenarios de aprendizaje", institution: "Tecnológico Nacional de México", date: "January–May 2025 · 120 hours" },
  { id: "AD03", year: "2024", title: "Mendix Rapid Developer Certification", institution: "Mendix", date: "5 April 2024" },
  { id: "AD04", year: "2024", title: "Diplomado en Ciencia de Datos", institution: "Tecnológico Nacional de México", date: "September 2023–January 2024 · 120 hours" },
];

const academicService = [
  { id: "AS01", year: "2024", type: "Academic event organization", title: "Eureka 2024 · Encuentro Nacional de Computación (ENC 2024)", institution: "Instituto Tecnológico de Ciudad Madero · Sociedad Mexicana de Ciencia de la Computación", date: "23–25 September 2024", description: "Collaboration in the organization of the International Workshop on Artificial Intelligence and Analytics, Eureka 2024, within ENC 2024." },
  { id: "AS02", year: "2023", type: "Academic event participation", title: "1er Coloquio Interinstitucional de Investigación Básica y de Frontera", institution: "Universidad Autónoma de Tamaulipas · Facultad de Ingeniería Tampico", date: "13–15 June 2023", description: "Participation in the interinstitutional colloquium on basic and frontier research." },
];

const additionalTraining = [
  { id: "AT01", year: "2026", title: "Sociedad Microindustrial, Sociedad de Acciones Simplificada (SAS) y Régimen Simplificado de Confianza para Personas Morales (RESICO)", institution: "Programa de Incubación de Empresas de Base Tecnológica · Convocatoria 2026", date: "18 September 2026 · Ciudad Victoria, Tamaulipas" },
];

const researchNodes = [
  "Multiobjective Optimization",
  "Metaheuristics",
  "Resource Allocation",
  "Cloud Computing",
  "Evolutionary Algorithms",
  "Scheduling Optimization",
];

const researchPipeline = [
  "Scientific Workflow",
  "Ready Tasks",
  "Optimization Algorithm",
  "Resource Allocation",
  "Virtual Machines",
  "Execution",
  "Performance Evaluation",
];

const optimizationFamilies = [
  { family: "Evolutionary", methods: ["NSGA-II", "NSGA-III", "Genetic Algorithms"] },
  { family: "Cooperative", methods: ["Cooperative Coevolution", "Multi-species approaches"] },
  { family: "Swarm / Population-based", methods: ["ACO", "PSO", "Differential Evolution"] },
];

const workflowBenchmarks = ["CyberShake", "Epigenomics", "Montage", "LIGO Inspiral", "SIPHT"];

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
];

const teachingInterests = [
  "Programming",
  "Algorithms & Data Structures",
  "Artificial Intelligence",
  "Optimization",
  "Databases",
  "Cloud Computing",
  "Foundations of Computer Science",
  "Data Analysis",
];

const academicActivities = [
  { year: "2024", type: "Workshop", title: "Applications of Artificial Intelligence", context: "International Day of Women and Girls in Science", detail: "Ciudad Madero, Tamaulipas", verified: true },
  { year: "2023", type: "Scientific Outreach Talk", title: "A walk through the paths of Artificial Intelligence", context: "Introductory scientific outreach on artificial intelligence for student audiences.", verified: true },
  { year: "2022", type: "Adjunct Academic Support", title: "Analysis and Design of Algorithms", context: "Computer Systems Engineering", detail: "Instituto Tecnológico de Ciudad Madero", verified: true },
];

const teachingAreas = [
  { group: "Foundations", areas: ["Programming", "Object-Oriented Programming", "Algorithms", "Data Structures", "Computational Logic"] },
  { group: "Data & Intelligence", areas: ["Artificial Intelligence", "Data Analysis", "Databases", "Machine Learning Foundations"] },
  { group: "Advanced Computing", areas: ["Optimization", "Metaheuristics", "Cloud Computing", "Computational Resource Allocation"] },
];


const profile = {
firstName: "Elizabeth", lastName: "del Angel Franco",
description: "I research intelligent optimization, metaheuristics, and workflow scheduling to design efficient, scalable, and sustainable solutions in cloud computing.",
bio: "Computer science researcher specializing in intelligent optimization, multi-objective metaheuristics, and workflow scheduling in cloud computing environments.",
background: "My profile combines scientific research, software development, and data analysis with the design of methods for optimization and efficient resource allocation. My work focuses on applied research, university teaching, and the development of computational solutions for complex problems.",
linkedin: "https://www.linkedin.com/in/elizabeth-del-a-franco-2246273a9/", github: "https://github.com/ElizabethFranangel",
contact: "I welcome conversations about academic collaboration, research, university teaching, technology projects and professional opportunities.",
};
export const defaultContent = { profile, publications, scientificPresentations, academicDevelopment, academicService, additionalTraining, researchNodes, researchPipeline, optimizationFamilies, workflowBenchmarks, projects, teachingInterests, academicActivities, teachingAreas };
export type PortfolioContent = typeof defaultContent;
