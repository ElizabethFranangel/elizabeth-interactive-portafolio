export const site = {
  url: "https://elizabethfranangel.github.io/elizabeth-interactive-portafolio/",
  name: "Elizabeth del Ángel Franco",
  title: "Elizabeth del Ángel Franco | Investigación y desarrollo de software",
  description: "Portafolio de Elizabeth del Ángel Franco: investigación en ciencias de la computación, optimización y computación en la nube, publicaciones, docencia y desarrollo de software.",
};

export const profileStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}#person`,
      name: site.name,
      alternateName: ["Elizabeth del Angel Franco", "Elizabeth Del-Angel-Franco"],
      url: site.url,
      image: `${site.url}images/elizabeth-photo.jpg`,
      description: site.description,
      jobTitle: "Investigadora en ciencias de la computación",
      sameAs: [
        "https://www.linkedin.com/in/elizabeth-del-a-franco-2246273a9/",
        "https://github.com/ElizabethFranangel",
        "https://orcid.org/0009-0006-1800-9996",
      ],
      knowsAbout: ["Optimización inteligente", "Metaheurísticas", "Computación en la nube", "Planificación de flujos de trabajo", "Desarrollo de software"],
    },
    {
      "@type": "ProfilePage",
      "@id": `${site.url}#profile`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: ["es", "en"],
      mainEntity: { "@id": `${site.url}#person` },
    },
  ],
};
