import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

const HIDE_GLOBAL_CHROME = `
body > header,
body > footer {
  display: none !important;
}
`;

export default function EditorialV1Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_GLOBAL_CHROME }} />
      {children}
    </>
  );
}
