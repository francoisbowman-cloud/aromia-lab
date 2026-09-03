import type { Metadata } from "next";
import "./editorial-sharp.css";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

/**
 * The editorial home and the story template no longer render their own
 * `.ev1-nav` / `.ev1-footer` — they inherit the global shell. The locked
 * `el-coleccionista` story still carries a bespoke `.ev1-nav`; keep hiding it
 * here until that page is refactored under Publisher direction.
 */
const RETIRE_DUPLICATE_CHROME = `
.ev1 > .ev1-nav {
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
