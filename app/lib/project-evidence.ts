export type ProjectEvidence = { image: string; title: string; description: string; position?: string };

export const projectEvidence: Record<"portfolio" | "gym", ProjectEvidence[]> = {
  portfolio: [
    { image: "home.jpg", title: "Home and navigation", description: "Portfolio overview with profile, navigation cards and introductory quote.", position: "42% center" },
    { image: "research.jpg", title: "Interactive research gallery", description: "Research areas presented in an interactive carousel with dedicated illustrations.", position: "50% center" },
    { image: "certificates.jpg", title: "Certificate image viewer", description: "Certificate enlargement in a translucent viewer with centered details.", position: "50% center" },
    { image: "english.jpg", title: "English version", description: "The same portfolio in English, with a language preference that is remembered.", position: "42% center" },
  ],
  gym: [
    { image: "gym/02-resumen.png", title: "Gym dashboard", description: "Overview of active clients and membership status." },
    { image: "gym/06-membresias.png", title: "Membership management", description: "Membership listing and status management." },
    { image: "gym/09-kiosco.png", title: "Check-in kiosk", description: "Client check-in interface." },
    { image: "gym/13-caja.png", title: "Cash register", description: "Cash register operations and movements." },
  ],
};
