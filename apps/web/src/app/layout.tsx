import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { RouteAnalytics } from "@/components/RouteAnalytics";
import { WebVitals } from "@/components/WebVitals";
import "./globals.css";
import "./aromia-redesign.css";
import "./design-tokens.css";
import "./editorial-world.css";

const geistSans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900" });
const geistMono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900" });
const newsreader = localFont({ src: [{ path: "./fonts/editorial/Newsreader.woff2", weight: "200 800", style: "normal" }, { path: "./fonts/editorial/Newsreader-Italic.woff2", weight: "200 800", style: "italic" }], variable: "--font-display", display: "swap" });
const archivo = localFont({ src: "./fonts/editorial/Archivo.woff2", weight: "100 900", variable: "--font-body", display: "swap" });
const ibmPlexSans = localFont({ src: "./fonts/editorial/IBMPlexSans.woff2", weight: "100 700", variable: "--font-plex", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_DESCRIPTION = "Historias, materias, personas y rutas para entender el perfume con más contexto y menos ruido.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Aromia", template: "%s | Aromia" },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: "Aromia", title: "Aromia", description: SITE_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem('aromia_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Browser-stored dark mode modifies this one attribute before hydration.
  // Suppress only the unavoidable root-attribute warning, not child mismatches.
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://m.media-amazon.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.notinoimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://media.douglas.de" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <GoogleAnalytics />
      </head>
      <body className={`flex min-h-screen flex-col ${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${archivo.variable} ${ibmPlexSans.variable} antialiased`}>
        <Suspense fallback={null}><RouteAnalytics /></Suspense>
        <WebVitals />
        <a href="#contenido" className="aromia-skip-link">Saltar al contenido</a>
        <NavBar />
        <div id="contenido" tabIndex={-1} className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
