import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function TastePreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
