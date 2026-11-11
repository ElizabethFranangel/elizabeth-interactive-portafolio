export type ProjectEvidence = { image: string; title: string; description: string; position?: string };

export const projectEvidence: Record<"portfolio" | "gym", ProjectEvidence[]> = {
  portfolio: [
    { image: "home.jpg", title: "Home and navigation", description: "Portfolio overview with profile, navigation cards and introductory quote.", position: "42% center" },
    { image: "research.jpg", title: "Interactive research gallery", description: "Research areas presented in an interactive carousel with dedicated illustrations.", position: "50% center" },
    { image: "certificates.jpg", title: "Certificate image viewer", description: "Certificate enlargement in a translucent viewer with centered details.", position: "50% center" },
    { image: "english.jpg", title: "English version", description: "The same portfolio in English, with a language preference that is remembered.", position: "42% center" },
  ],
  gym: [
    { image: "gym/01-acceso.png", title: "System sign-in", description: "Sign-in screen for the gym management system." },
    { image: "gym/02-resumen.png", title: "Gym dashboard", description: "Overview of active clients and membership status." },
    { image: "gym/03-clientes.png", title: "Client directory", description: "Client records with search and registration controls." },
    { image: "gym/04-expediente.png", title: "Client record", description: "Client information and associated membership history." },
    { image: "gym/05-alta-cliente.png", title: "Client registration", description: "New client registration form." },
    { image: "gym/06-membresias.png", title: "Membership management", description: "Membership listing and status management." },
    { image: "gym/07-renovacion.png", title: "Membership renewal", description: "Membership renewal and payment workflow." },
    { image: "gym/08-asistencias.png", title: "Attendance records", description: "Attendance registration and consultation." },
    { image: "gym/09-kiosco.png", title: "Check-in kiosk", description: "Client check-in interface." },
    { image: "gym/10-carrito.png", title: "Sales cart", description: "Product selection and sales cart." },
    { image: "gym/11-cobro.png", title: "Sale payment", description: "Payment method, received amount and change calculation." },
    { image: "gym/12-inventario.png", title: "Product inventory", description: "Product inventory and stock management." },
    { image: "gym/13-caja.png", title: "Cash register", description: "Cash register operations and movements." },
    { image: "gym/14-corte.png", title: "Cash reconciliation", description: "Cash register closing and reconciliation." },
    { image: "gym/15-reportes.png", title: "Management reports", description: "Period-based reports for sales, memberships and gym operations." },
    { image: "gym/16-usuarios.png", title: "User management", description: "System user administration." },
    { image: "gym/17-migracion.png", title: "Initial client migration", description: "Initial client import and migration interface." },
  ],
};
