"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const page = `${pathname}${query ? `?${query}` : ""}`;
    if (lastPage.current === page) return;
    lastPage.current = page;

    trackEvent("page_view", {
      page_path: page,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
