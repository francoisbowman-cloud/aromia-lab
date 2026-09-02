export interface SiteNavItem {
  href: string;
  label: string;
  match: string[];
}

export const SITE_NAV: SiteNavItem[] = [
  { href: "/magazine", label: "Historias", match: ["/magazine", "/historias"] },
  { href: "/academia", label: "Saber", match: ["/academia"] },
  { href: "/perfumistas", label: "Personas", match: ["/perfumistas"] },
  { href: "/descubrir", label: "Discovery", match: ["/descubrir", "/quiz"] },
  { href: "/club", label: "Club", match: ["/club"] },
];

export function navItemIsActive(pathname: string, item: SiteNavItem) {
  return item.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
