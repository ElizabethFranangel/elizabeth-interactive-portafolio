import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elizabeth del Ángel Franco | Computer Science Researcher",
  description:
    "Academic portfolio focused on optimization, metaheuristics, workflow scheduling, and cloud computing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
