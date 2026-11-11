import type { Metadata } from "next";
import { site } from "../lib/site";

export const metadata: Metadata = {
  title: "Administración del portafolio",
  robots: { index: false, follow: false },
  alternates: { canonical: `${site.url}admin/` },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
