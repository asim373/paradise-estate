import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Paradise Estate",
  description: "Explore a considered collection of luxury residences across New York, Miami, Los Angeles, and Chicago.",
  openGraph: {
    type: "website",
    siteName: "Paradise Estate",
    title: "Paradise Estate",
    description: "Explore a considered collection of luxury residences across New York, Miami, Los Angeles, and Chicago.",
  },
  twitter: {
    card: "summary",
    title: "Paradise Estate",
    description: "Explore a considered collection of luxury residences across New York, Miami, Los Angeles, and Chicago.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col"><Header />{children}<Footer /></body>
    </html>
  );
}
