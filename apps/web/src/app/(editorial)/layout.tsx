import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

const HIDE_GLOBAL_CHROME = `
body > header,
body > footer {
  display: none !important;
}
`;

export default function EditorialLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_GLOBAL_CHROME }} />
      {children}
    </>
  );
}
