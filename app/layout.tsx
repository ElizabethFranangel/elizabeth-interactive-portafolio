import type { Metadata } from "next";
import { Cabin, Newsreader } from "next/font/google";
import "./globals.css";

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elizabeth del Ángel Franco | Computer Science Researcher",
  description:
    "Academic portfolio focused on optimization, metaheuristics, workflow scheduling, and cloud computing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cabin.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
