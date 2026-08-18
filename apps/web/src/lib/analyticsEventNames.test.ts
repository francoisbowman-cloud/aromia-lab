import { describe, expect, it } from "vitest";
import { ANALYTICS_EVENTS } from "./analyticsEventNames";

describe("Aromia analytics event contract", () => {
  it("keeps the product-discovery taxonomy stable and duplicate-free", () => {
    const names = Object.values(ANALYTICS_EVENTS);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain("perfumer_open");
    expect(names).toContain("olfactory_note_open");
    expect(names).toContain("similar_perfume_click");
    expect(names).toContain("quiz_progress_reveal");
    expect(names).toContain("pdp_gallery_interaction");
    expect(names).toContain("affiliate_click");
  });
});
