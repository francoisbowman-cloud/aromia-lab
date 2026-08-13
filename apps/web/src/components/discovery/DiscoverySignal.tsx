"use client";

import { useEffect } from "react";
import type { Perfume } from "@/lib/types";
import { recordPerfumeInterest, recordPerfumerInterest } from "@/lib/discoveryProfile";

export function DiscoverySignal({ perfume, perfumerSlug }: { perfume?: Perfume; perfumerSlug?: string }) {
  useEffect(() => {
    if (perfume) recordPerfumeInterest(perfume, 1);
    if (perfumerSlug) recordPerfumerInterest(perfumerSlug, 2);
  }, [perfume, perfumerSlug]);
  return null;
}
