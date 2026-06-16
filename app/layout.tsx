import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-wght.woff2", weight: "300 900", style: "normal" },
    { path: "./fonts/fraunces-wght-italic.woff2", weight: "300 900", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const instrumentSans = localFont({
  src: [{ path: "./fonts/instrument-sans-wght.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = localFont({
  src: [
    { path: "./fonts/space-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/space-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
