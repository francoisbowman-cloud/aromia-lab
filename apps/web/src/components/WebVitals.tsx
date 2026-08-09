"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics";

export function WebVitals() {
  useReportWebVitals((metric) => {
    trackEvent("web_vital", {
      metric_name: metric.name,
      metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
      navigation_type: metric.navigationType,
    });
  });

  return null;
}
