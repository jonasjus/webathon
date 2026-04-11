import type { ReactNode } from "react";
import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Geist_Mono,
  Manrope,
  Newsreader,
} from "next/font/google";
import Script from "next/script";
import { getThemeInitScript } from "@/lib/theme";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venue",
  description: "Sosial app for arrangementer og fellesskap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="nb"
      suppressHydrationWarning
      data-theme="light"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${newsreader.variable} ${geistMono.variable} ${bricolageGrotesque.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {getThemeInitScript()}
        </Script>
        {children}
      </body>
    </html>
  );
}
