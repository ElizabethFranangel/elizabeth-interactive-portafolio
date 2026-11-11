import type { Metadata } from "next";
import "./globals.css";
import { site } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
  verification: { google: "P9jcbCPixMRQDjv_s_oy58Z1pXrm2lb9hjt0xqYAUGU" },
  openGraph: {
    type: "profile",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: "es_MX",
    images: [{ url: `${site.url}images/elizabeth-photo.jpg`, alt: site.name }],
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
    images: [`${site.url}images/elizabeth-photo.jpg`],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
