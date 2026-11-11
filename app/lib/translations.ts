export type Language = "es" | "en";

const spanish: Record<string, string> = {
  "Download CVU": "Descargar CVU",
  "Professional profile and collaboration": "Perfil profesional y colaboración",
  "Code, projects and development": "Código, proyectos y desarrollos",
  "Direct contact": "Contacto directo", "Availability": "Disponibilidad",
  "Open to academic collaborations and technology projects.": "Abierta a colaboraciones académicas y proyectos tecnológicos.",
  "Your name": "Tu nombre", "you@example.com": "tu.correo@ejemplo.com",
  "Select a subject": "Selecciona un asunto", "Write your message...": "Escribe tu mensaje...",
  "Academic collaboration": "Colaboración académica", "University teaching": "Docencia universitaria",
  "Technology project": "Proyecto tecnológico", "Other inquiry": "Otra consulta",
  "Your message will be processed by FormSubmit and sent to eliizabeth.franco@gmail.com. Sending opens its verification and confirmation page.": "FormSubmit procesará tu mensaje y lo enviará a eliizabeth.franco@gmail.com. Al enviar se abrirá su página de verificación y confirmación.",
  "System sign-in": "Acceso al sistema", "Sign-in screen for the gym management system.": "Pantalla de acceso al sistema de gestión del gimnasio.",
  "Gym dashboard": "Resumen del gimnasio", "Overview of active clients and membership status.": "Vista general de clientes activos y estado de las membresías.",
  "Client directory": "Directorio de clientes", "Client records with search and registration controls.": "Listado de clientes con búsqueda y registro.",
  "Client record": "Expediente del cliente", "Client information and associated membership history.": "Información del cliente e historial de sus membresías.",
  "Client registration": "Registro de clientes", "New client registration form.": "Formulario de registro de nuevos clientes.",
  "Membership management": "Gestión de membresías", "Membership listing and status management.": "Listado y administración del estado de las membresías.",
  "Membership renewal": "Renovación de membresías", "Membership renewal and payment workflow.": "Proceso de renovación de membresías y pago.",
  "Attendance records": "Registro de asistencias", "Attendance registration and consultation.": "Registro y consulta de asistencias.",
  "Check-in kiosk": "Kiosco de acceso", "Client check-in interface.": "Interfaz de registro de entrada de los clientes.",
  "Sales cart": "Carrito de ventas", "Product selection and sales cart.": "Selección de productos y carrito de ventas.",
  "Sale payment": "Cobro de venta", "Payment method, received amount and change calculation.": "Método de pago, importe recibido y cálculo del cambio.",
  "Product inventory": "Inventario de productos", "Product inventory and stock management.": "Inventario de productos y control de existencias.",
  "Cash register": "Caja", "Cash register operations and movements.": "Operaciones y movimientos de caja.",
  "Cash reconciliation": "Corte de caja", "Cash register closing and reconciliation.": "Cierre y conciliación de caja.",
  "Management reports": "Reportes de gestión", "Period-based reports for sales, memberships and gym operations.": "Reportes por periodo de ventas, membresías y operaciones del gimnasio.",
  "User management": "Gestión de usuarios", "System user administration.": "Administración de usuarios del sistema.",
  "Initial client migration": "Migración inicial de clientes", "Initial client import and migration interface.": "Interfaz de importación y migración inicial de clientes.",
  "Home and navigation": "Inicio y navegación",
  "Interactive research gallery": "Galería interactiva de investigación",
  "Certificate image viewer": "Visor de reconocimientos",
  "English version": "Versión en inglés",
  "Portfolio overview with profile, navigation cards and introductory quote.": "Vista general del portafolio con perfil, tarjetas de navegación y cita de inicio.",
  "Research areas presented in an interactive carousel with dedicated illustrations.": "Áreas de investigación en un carrusel interactivo con dibujos específicos.",
  "Certificate enlargement in a translucent viewer with centered details.": "Ampliación de un reconocimiento en un visor translúcido con información centrada.",
  "The same portfolio in English, with a language preference that is remembered.": "El mismo portafolio en inglés, con una preferencia de idioma que se conserva.",
  "Expand evidence": "Ampliar evidencia",
  "Previous evidence": "Evidencia anterior",
  "Next evidence": "Evidencia siguiente",
  "Click outside or press Escape to close": "Haz clic fuera o pulsa Escape para cerrar",
  "· JCR · IF = 0.8 in 2025–2026": "· JCR · FI = 0.8 en 2025–2026",
  "; Claudia Guadalupe Gómez-Santillán; Laura Cruz-Reyes; Nelson Rangel-Valdez; and Gilberto Rivera-Zarate": "; Claudia Guadalupe Gómez-Santillán; Laura Cruz-Reyes; Nelson Rangel-Valdez; y Gilberto Rivera-Zarate",
  "Elizabeth del Ángel Franco ORCID profile": "Perfil ORCID de Elizabeth del Ángel Franco",
  "of": "de", "Illustration": "Ilustración", "Home": "Inicio", "About": "Perfil", "About Me": "Sobre mí", "About me": "Sobre mí",
  "Research": "Investigación", "Teaching": "Docencia", "Publications": "Publicaciones", "Projects": "Proyectos", "Contact": "Contacto",
  "WELCOME": "BIENVENIDA", "COMPUTER SCIENCE RESEARCHER": "INVESTIGADORA EN CIENCIAS DE LA COMPUTACIÓN", "OPTIMIZATION": "OPTIMIZACIÓN", "CLOUD COMPUTING": "COMPUTACIÓN EN LA NUBE",
  "Learn more": "Conocer más", "Download CV": "Descargar CV", "Light": "Claro", "Dark": "Oscuro",
  "Switch to dark mode": "Cambiar a modo oscuro", "Switch to light mode": "Cambiar a modo claro",
  "Learn more about my background, academic journey, and professional interests.": "Conoce mi trayectoria, formación académica e intereses profesionales.",
  "Explore my research in optimization, metaheuristics, and cloud workflow scheduling.": "Explora mi investigación en optimización, metaheurísticas y planificación de flujos de trabajo en la nube.",
  "Discover my teaching interests, academic preparation, and educational resources.": "Descubre mis intereses docentes, preparación académica y recursos educativos.",
  "Review verified publications and academic research outputs.": "Consulta mis publicaciones y resultados de investigación académica.",
  "Browse selected projects and tools developed to solve real-world computational problems.": "Explora proyectos y herramientas para resolver problemas computacionales reales.",
  "Let's connect for collaborations, academic opportunities, research, and professional projects.": "Conectemos para colaborar en investigación, oportunidades académicas y proyectos profesionales.",
  "I research intelligent optimization, metaheuristics, and workflow scheduling to design efficient, scalable, and sustainable solutions in cloud computing.": "Investigo optimización inteligente, metaheurísticas y planificación de flujos de trabajo para diseñar soluciones eficientes, escalables y sostenibles en la nube.",
  "SCIENTIFIC NETWORK": "RED CIENTÍFICA", "PARTICLES + HAND TRACKING": "PARTÍCULAS + SEGUIMIENTO DE MANOS", "SWIPE TO EXPLORE": "DESLIZA PARA EXPLORAR",
  "Efficiency is not just about speed. It is about making intelligent choices that create sustainable impact.": "La eficiencia va más allá de la velocidad. Consiste en tomar decisiones inteligentes que generen un impacto sostenible.",
  "Research, technology and": "Investigación, tecnología y", "purpose.": "propósito.", "Professional profile": "Perfil profesional", "Professional areas": "Áreas profesionales",
  "Computer science researcher specializing in intelligent optimization, multi-objective metaheuristics, and workflow scheduling in cloud computing environments.": "Investigadora en ciencias de la computación especializada en optimización inteligente, metaheurísticas multiobjetivo y planificación de flujos de trabajo en entornos de nube.",
  "My profile combines scientific research, software development, and data analysis with the design of methods for optimization and efficient resource allocation. My work focuses on applied research, university teaching, and the development of computational solutions for complex problems.": "Mi perfil combina investigación científica, desarrollo de software y análisis de datos con el diseño de métodos de optimización y asignación eficiente de recursos. Mi trabajo se centra en la investigación aplicada, la docencia universitaria y el desarrollo de soluciones computacionales para problemas complejos.",
  "Software": "Software", "Data": "Datos", "Academic timeline": "Trayectoria académica", "Degree candidate": "Candidata al grado",
  "Doctorate in Computer Science": "Doctorado en Ciencias de la Computación", "Research line: intelligent optimization.": "Línea de investigación: optimización inteligente.",
  "Master of Science in Computer Science": "Maestría en Ciencias de la Computación", "Computer Systems Engineering": "Ingeniería en Sistemas Computacionales", "Programming Analyst Technician": "Técnico Analista Programador",
  "Thesis: data acquisition and preprocessing module for a compensatory fuzzy logic scientific core.": "Tesis: módulo de adquisición y preprocesamiento de datos para un núcleo científico de lógica difusa compensatoria.",
  "Professional internship in the postgraduate studies department.": "Residencia profesional en el departamento de estudios de posgrado.", "Graduation project: point-of-sale application development.": "Proyecto de titulación: desarrollo de una aplicación de punto de venta.",
  "Research journey": "Trayectoria de investigación", "Research areas": "Áreas de investigación", "Academic development": "Formación académica", "Additional training": "Formación complementaria",
  "Master's research": "Investigación de maestría", "Doctoral research": "Investigación doctoral", "Present": "Actualidad",
  "Intelligent Optimization in Cloud Environments": "Optimización inteligente en entornos de nube",
  "Development of a data acquisition and preprocessing module for a scientific computing system, focusing on the preparation and transformation of data prior to subsequent analysis.": "Desarrollo de un módulo de adquisición y preprocesamiento de datos para un sistema de cómputo científico, enfocado en preparar y transformar los datos antes de su análisis.",
  "Design and experimental evaluation of multi-objective metaheuristics for workflow scheduling and efficient allocation of computational resources in cloud computing environments.": "Diseño y evaluación experimental de metaheurísticas multiobjetivo para planificar flujos de trabajo y asignar recursos computacionales de forma eficiente en la nube.",
  "Certifications & diplomas": "Certificaciones y diplomados", "Additional training · Entrepreneurship": "Formación complementaria · Emprendimiento",
  "Intelligent Optimization": "Optimización inteligente", "Multi-objective Metaheuristics": "Metaheurísticas multiobjetivo", "Workflow Scheduling": "Planificación de flujos de trabajo", "Cloud Computing": "Computación en la nube", "Computational Resource Allocation": "Asignación de recursos computacionales", "Data Preprocessing": "Preprocesamiento de datos", "Experimental Analysis": "Análisis experimental", "Data Analysis": "Análisis de datos",
  "Design of algorithms for solving complex optimization problems.": "Diseño de algoritmos para resolver problemas complejos de optimización.",
  "Development of metaheuristic approaches for multiple conflicting objectives.": "Desarrollo de enfoques metaheurísticos para múltiples objetivos en conflicto.",
  "Scheduling and allocation of computational workflows under multiple objectives.": "Planificación y asignación de flujos de trabajo computacionales con múltiples objetivos.",
  "Efficient resource allocation and performance optimization in cloud environments.": "Asignación eficiente de recursos y optimización del rendimiento en entornos de nube.",
  "Strategies to allocate resources efficiently and cost-effectively.": "Estrategias para asignar recursos de forma eficiente y rentable.",
  "Acquisition, cleaning and preparation of data to improve quality and usability.": "Adquisición, limpieza y preparación de datos para mejorar su calidad y utilidad.",
  "Comparative evaluation of algorithms using experiments and statistical analysis.": "Evaluación comparativa de algoritmos mediante experimentos y análisis estadístico.",
  "Exploratory analysis and extraction of insights from data.": "Análisis exploratorio y extracción de conocimiento a partir de los datos.",
  "Teaching & academic engagement": "Docencia y participación académica", "Teaching experience": "Experiencia docente", "Academic & scientific outreach": "Divulgación académica y científica", "Participation & academic service": "Participación y servicio académico",
  "Adjunct Academic Support": "Apoyo académico adjunto", "Academic support within the Computer Systems Engineering program.": "Apoyo académico en el programa de Ingeniería en Sistemas Computacionales.",
  "Algorithms": "Algoritmos", "Computer Science": "Ciencias de la computación", "Workshop": "Taller", "Verified activity": "Actividad verificada", "Scientific Outreach Talk": "Charla de divulgación científica",
  "Introductory scientific outreach on artificial intelligence for student audiences.": "Divulgación introductoria de inteligencia artificial dirigida a estudiantes.",
  "International Day of Women and Girls in Science": "Día Internacional de la Mujer y la Niña en la Ciencia",
  "Academic event organization": "Organización de evento académico", "Academic event participation": "Participación en evento académico",
  "Collaboration in the organization of the International Workshop on Artificial Intelligence and Analytics, Eureka 2024, within ENC 2024.": "Colaboración en la organización del International Workshop on Artificial Intelligence and Analytics, Eureka 2024, en el marco de ENC 2024.",
  "Participation in the interinstitutional colloquium on basic and frontier research.": "Participación en el coloquio interinstitucional de investigación básica y de frontera.",
  "Journal Article": "Artículo de revista", "Book Chapters": "Capítulos de libro", "Books": "Libros", "Under review": "En revisión", "Under Review": "En revisión", "Scientific presentations": "Ponencias científicas", "Featured publication": "Publicación destacada", "Book chapter": "Capítulo de libro", "Book Chapter": "Capítulo de libro", "Book": "Libro",
  "Book chapter details forthcoming": "Detalles del capítulo de libro próximamente", "Author information will be added.": "Se añadirá la información de autoría.", "Book and publisher information forthcoming": "Información del libro y la editorial próximamente", "Publication metadata will be added when available.": "Los datos bibliográficos se añadirán cuando estén disponibles.", "Book details forthcoming": "Detalles del libro próximamente", "Publisher information forthcoming": "Información de la editorial próximamente", "Under review in": "En revisión en",
  "Presentation": "Ponencia", "Scientific Presentation": "Ponencia científica", "Oral Presentation": "Ponencia oral", "Factorial Analysis": "Análisis factorial", "Resource Allocation": "Asignación de recursos", "Optimization": "Optimización",
  "Research &": "Investigación y", "Software &": "Software y", "Systems": "Sistemas", "Research & Algorithms": "Investigación y algoritmos", "Software & Systems": "Software y sistemas", "View repository": "Ver repositorio", "Repository forthcoming": "Repositorio próximamente",
  "Research Software": "Software de investigación", "Published Research": "Investigación publicada", "Ongoing Research": "Investigación en curso", "Research in Progress": "Investigación en desarrollo",
  "Genetic Algorithm implementation for scientific workflow scheduling in cloud computing environments.": "Implementación de un algoritmo genético para planificar flujos de trabajo científicos en entornos de nube.",
  "Implementation of a Genetic Algorithm scheduler integrated directly into WorkflowSim 1.0 for experimental evaluation of scientific workflow scheduling in cloud computing.": "Implementación de un planificador basado en algoritmos genéticos integrado en WorkflowSim 1.0 para evaluar experimentalmente la planificación de flujos de trabajo científicos en la nube.",
  "The repository provides the implementation used in the published study and supports reproducibility of the experimental scheduling setup.": "El repositorio ofrece la implementación utilizada en el estudio publicado y permite reproducir la configuración experimental de planificación.",
  "Research software for computational experimentation in cloud workflow scheduling.": "Software de investigación para experimentación computacional en la planificación de flujos de trabajo en la nube.",
  "Research repository focused on the development and experimental evaluation of metaheuristic approaches for workflow scheduling in cloud computing environments.": "Repositorio de investigación centrado en el desarrollo y la evaluación experimental de enfoques metaheurísticos para planificar flujos de trabajo en entornos de nube.",
  "Related research": "Investigación relacionada", "Scheduler": "Planificador", "Workflow": "Flujo de trabajo", "Metaheuristic research": "Investigación metaheurística", "Candidate schedules": "Planificaciones candidatas", "Evaluation": "Evaluación", "Technical summary": "Resumen técnico", "Problem": "Problema", "Scientific workflow scheduling": "Planificación de flujos de trabajo científicos", "Objective": "Objetivo", "Makespan minimization": "Minimización del tiempo total de ejecución", "Environment": "Entorno", "Language": "Lenguaje", "Simulation": "Simulación", "Status": "Estado", "Workflow benchmarks": "Flujos de trabajo de referencia", "Reproducible research": "Investigación reproducible", "Project → Publication": "Proyecto → Publicación", "Experimental Study": "Estudio experimental", "Tech /": "Tecnologías /",
  "The repository contains the scheduling implementation and workflow resources required to reproduce the experimental setup used in the associated study.": "El repositorio contiene la implementación del planificador y los recursos necesarios para reproducir la configuración experimental del estudio asociado.",
  "Genetic Algorithms": "Algoritmos genéticos", "Metaheuristics": "Metaheurísticas", "Multiobjective Optimization": "Optimización multiobjetivo",
  "Interactive Web Application": "Aplicación web interactiva", "Personal Project": "Proyecto personal", "Interactive Web Application · Personal Project": "Aplicación web interactiva · Proyecto personal", "Desktop Management System": "Sistema de gestión de escritorio", "Client Project": "Proyecto para cliente", "Desktop Management System · Client Project": "Sistema de gestión de escritorio · Proyecto para cliente", "Gym Management & Point-of-Sale System": "Sistema de gestión de gimnasio y punto de venta",
  "Key features": "Características principales", "Responsive interface": "Interfaz adaptable", "Gesture-based interaction": "Interacción mediante gestos", "Mouse navigation": "Navegación con ratón", "Light / dark mode": "Modo claro / oscuro", "Interactive visual components": "Componentes visuales interactivos", "Modular content sections": "Secciones de contenido modulares", "Project evidence": "Evidencia del proyecto", "Interactive Academic Portfolio · Home interface": "Portafolio académico interactivo · Pantalla de inicio", "Home screen of the Interactive Academic Portfolio": "Pantalla de inicio del portafolio académico interactivo", "Client management": "Gestión de clientes", "Membership tracking": "Seguimiento de membresías", "Payment records": "Registro de pagos", "Expiration control": "Control de vencimientos", "Point of sale": "Punto de venta", "Product management": "Gestión de productos", "Administrative queries": "Consultas administrativas", "Image forthcoming": "Imagen próximamente",
  "Let's": "Vamos a", "connect.": "conectar.", "Name": "Nombre", "Email": "Correo electrónico", "Subject": "Asunto", "Message": "Mensaje", "Send message": "Enviar mensaje", "Back to top ↑": "Volver al inicio ↑", "© 2026 · Computer Science Researcher": "© 2026 · Investigadora en ciencias de la computación",
  "I welcome conversations about academic collaboration, research, university teaching, technology projects and professional opportunities.": "Me interesa conversar sobre colaboración académica, investigación, docencia universitaria, proyectos tecnológicos y oportunidades profesionales.",
  "The contact form is ready for a verified delivery service. For now, please connect with me on LinkedIn.": "El formulario está preparado para integrar un servicio de envío verificado. Por ahora, puedes contactarme por LinkedIn.",
  "Control": "Control", "Mouse": "Ratón", "Hands": "Manos", "Interaction method": "Método de interacción", "Use mouse controls": "Usar el ratón", "Use hand tracking controls": "Usar seguimiento de manos",
  "Previous content page": "Página anterior", "Next content page": "Página siguiente", "Previous research area": "Área de investigación anterior", "Next research area": "Área de investigación siguiente", "Pause automatic gallery": "Pausar galería automática", "Play automatic gallery": "Reproducir galería automática", "Choose a research area": "Elegir un área de investigación",
  "Portfolio sections": "Secciones del portafolio", "Explore the portfolio": "Explora el portafolio", "Contact Elizabeth": "Contactar a Elizabeth", "Home quote": "Cita de inicio", "Research subsections": "Subsecciones de investigación", "Teaching subsections": "Subsecciones de docencia", "Publication subsections": "Subsecciones de publicaciones", "Project subsections": "Subsecciones de proyectos", "Conceptual task scheduling diagram": "Diagrama conceptual de planificación de tareas", "Ongoing research flow": "Flujo de investigación en curso",
};

const english: Record<string, string> = {
  "Formación": "Training", "Formación adicional": "Additional training", "de": "of", "Certificación": "Certification", "Diplomado": "Diploma", "Docencia": "Teaching", "Servicio académico": "Academic service", "Ponencias": "Presentations", "Divulgación": "Outreach", "Certificaciones": "Certifications", "Diplomados": "Diplomas", "Formación complementaria": "Additional training", "Administrar · Iniciar sesión": "Manage · Sign in",
  "Diseño y desarrollo de un portafolio web académico interactivo para presentar experiencia profesional, investigación, publicaciones y proyectos de software. La plataforma combina una interfaz responsiva con elementos de interacción visual y navegación mediante mouse y reconocimiento de gestos de mano, buscando una experiencia de usuario más dinámica que la de un CV web convencional.": "Design and development of an interactive academic portfolio presenting professional experience, research, publications, and software projects. The platform combines a responsive interface with visual interaction and navigation using a mouse or hand gestures, offering a more dynamic experience than a conventional online CV.",
  "El proyecto integra una arquitectura basada en componentes reutilizables, modos claro y oscuro, diseño adaptable a diferentes resoluciones y elementos gráficos interactivos orientados a mantener una identidad visual académica y tecnológica.": "The project uses reusable components, light and dark modes, responsive layouts, and interactive graphics to maintain an academic and technological visual identity.",
  "Diseño y desarrollo de un sistema de escritorio para la gestión operativa de un gimnasio, orientado a centralizar el registro de clientes, mensualidades, pagos y operaciones de punto de venta en una única aplicación.": "Design and development of a desktop system for gym operations, centralizing client records, memberships, payments, and point-of-sale operations in a single application.",
  "El sistema contempla la administración del estado de las membresías, historial de pagos, métodos de pago, fechas de vencimiento y consultas administrativas, además del registro de productos y ventas realizadas dentro del gimnasio. Su diseño está enfocado en simplificar las actividades cotidianas de recepción y proporcionar al negocio un control estructurado de su información.": "The system manages membership status, payment history, payment methods, expiration dates, and administrative queries, as well as products and sales. It simplifies everyday reception tasks and provides structured control of business information.",
  "Desarrollado bajo una arquitectura de aplicación de escritorio utilizando JavaFX y PostgreSQL, con posibilidad de incorporar nuevos módulos conforme evolucionen las necesidades operativas del gimnasio.": "Built as a desktop application using JavaFX and PostgreSQL, with room for new modules as the gym's operational needs evolve.",
};

const months: Record<string, string> = { January: "enero", February: "febrero", March: "marzo", April: "abril", May: "mayo", June: "junio", July: "julio", August: "agosto", September: "septiembre", October: "octubre", November: "noviembre", December: "diciembre", Jan: "ene", Feb: "feb", Mar: "mar", Apr: "abr", Jun: "jun", Jul: "jul", Aug: "ago", Sep: "sep", Oct: "oct", Nov: "nov", Dec: "dic" };

export function translate(value: string, language: Language): string {
  const text = value.replace(/\s+/g, " ").trim();
  const catalog = language === "es" ? spanish : english;
  let result = catalog[text];
  if (!result && language === "es") {
    const key = Object.keys(spanish).find(key => key.toLowerCase() === text.toLowerCase());
    if (key) result = spanish[key];
    const numbered = text.match(/^(\d{2}\s*\/\s*|\d{4}\s*[–—-]\s*)(.+)$/);
    if (!result && numbered) result = numbered[1] + translate(numbered[2], language);
    for (const [prefix, localized] of [["View certificate:", "Ver certificado:"], ["Expand certificate:", "Ampliar certificado:"], ["Certificate preview:", "Vista previa del certificado:"], ["Certificate:", "Certificado:"], ["Original certificate:", "Certificado original:"], ["Go to ", "Ir a "]] as const) {
      if (text.startsWith(prefix)) { result = localized + (prefix.endsWith(" ") ? translate(text.slice(prefix.length), language) : text.slice(prefix.length)); break; }
    }
    if (!result) result = text.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, month => months[month]).replace(/\bhours\b/g, "horas");
  }
  if (!result && language === "en") {
    const reverseMonths = Object.fromEntries(Object.entries(months).slice(0, 12).map(([en, es]) => [es, en]));
    result = text.replace(/\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/gi, month => reverseMonths[month.toLowerCase()]).replace(/\bhoras\b/g, "hours");
  }
  if (!result) result = text;
  return (value.startsWith(" ") ? " " : "") + result + (value.endsWith(" ") ? " " : "");
}
