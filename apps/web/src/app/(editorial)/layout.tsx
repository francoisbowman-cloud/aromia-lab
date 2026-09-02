import type { Metadata } from "next";
import "./editorial-sharp.css";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

const RETIRE_DUPLICATE_CHROME = `
.ev1 > .ev1-nav,
.ev1 > .ev1-footer {
  display: none !important;
}
`;

export default function EditorialLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RETIRE_DUPLICATE_CHROME }} />
      {children}
    </>
  );
}
