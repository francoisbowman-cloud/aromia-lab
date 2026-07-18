import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Jost } from "next/font/google";
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
  variable: "--font-display",
});
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Aromia",
  description: "Comparador y recomendador de perfumes",
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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <GoogleAnalytics />
      </head>
      <body
        className={`flex min-h-screen flex-col ${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${jost.variable} antialiased`}
      >
        <NavBar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
