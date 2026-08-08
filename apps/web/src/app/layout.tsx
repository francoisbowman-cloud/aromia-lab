import type { Metadata } from "next";
import localFont from "next/font/local";
import { Archivo, Cormorant_Garamond, IBM_Plex_Sans } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
// Reemplaza a Jost (ver GUIA-VISUAL-aromia.md) — fuente de nav/labels/botones
// y cuerpo de texto en ambas variantes del ticket de adaptación visual.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
// Cuerpo de texto largo en la variante oscura (Grafito) del ticket — se
// expone como familia separada (`font-plex`) en vez de reemplazar Archivo,
// para no forzar una reescritura masiva de párrafos fuera del alcance del
// ticket (ver sección 6 del ticket original).
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Aromia",
  description: "Comparador y recomendador de perfumes",
  openGraph: {
    siteName: "Aromia",
    title: "Aromia",
    description: "Comparador y recomendador de perfumes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem('aromia_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light">
      <head>
        {/* Las 50 fotos de catálogo son hotlinks directos a estos 3 dominios
            de retailer (ver docs/images/CURRENT-STATE-AUDIT.md, sección 5) —
            preconectar adelanta DNS+TLS antes de que el navegador descubra
            la URL de la imagen, sin cambiar nada del hotlinking en sí. */}
        <link rel="preconnect" href="https://m.media-amazon.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.notinoimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://media.douglas.de" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <GoogleAnalytics />
      </head>
      <body
        className={`flex min-h-screen flex-col ${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${archivo.variable} ${ibmPlexSans.variable} antialiased`}
      >
        <NavBar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
