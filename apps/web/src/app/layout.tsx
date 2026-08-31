import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Archivo, IBM_Plex_Sans, Newsreader } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ChromeGate } from "@/components/ChromeGate";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { RouteAnalytics } from "@/components/RouteAnalytics";
import { WebVitals } from "@/components/WebVitals";
import "./globals.css";
import "./aromia-redesign.css";

const geistSans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900" });
const geistMono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900" });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-plex" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Aromia", template: "%s | Aromia" },
  description: "Descubre, compara y entiende perfumes a través de notas, historias y recomendaciones editoriales.",
  openGraph: { siteName: "Aromia", title: "Aromia", description: "Descubre, compara y entiende perfumes a través de notas, historias y recomendaciones editoriales.", type: "website" },
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
  return (
    <html lang="es" data-theme="light">
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
        <ChromeGate><NavBar /></ChromeGate>
        <div className="flex-1">{children}</div>
        <ChromeGate><Footer /></ChromeGate>
      </body>
    </html>
  );
}
