"use client";

import { useEffect } from "react";
import type { Perfume } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { recordPerfumeInterest, recordPerfumerInterest } from "@/lib/discoveryProfile";

export function DiscoverySignal({ perfume, perfumerSlug }: { perfume?: Perfume; perfumerSlug?: string }) {
  useEffect(() => {
    if (perfume) recordPerfumeInterest(perfume, 1);
    if (perfumerSlug) {
      recordPerfumerInterest(perfumerSlug, 2);
      trackEvent("perfumer_open", { perfumer_slug: perfumerSlug });
    }
  }, [perfume, perfumerSlug]);
  return null;
}
