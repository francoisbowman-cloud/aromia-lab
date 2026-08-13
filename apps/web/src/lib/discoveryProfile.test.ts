import { describe, expect, it } from "vitest";
import { emptyDiscoveryProfile, parseDiscoveryProfile, topSignals } from "./discoveryProfile";

describe("discovery profile", () => {
  it("returns an empty v2 profile for invalid JSON", () => {
    expect(parseDiscoveryProfile("not-json").version).toBe(2);
    expect(parseDiscoveryProfile("not-json").families).toEqual({});
  });

  it("sanitizes and caps numeric signals", () => {
    const profile = parseDiscoveryProfile(JSON.stringify({ families: { amaderado: 80, floral: 4, bad: -2 }, notes: { vetiver: 3 } }));
    expect(profile.families.amaderado).toBe(50);
    expect(profile.families.floral).toBe(4);
    expect(profile.families.bad).toBeUndefined();
    expect(profile.notes.vetiver).toBe(3);
  });

  it("orders top signals deterministically", () => {
    expect(topSignals({ floral: 2, amaderado: 5, citrico: 5 }, 2)).toEqual([["amaderado", 5], ["citrico", 5]]);
  });

  it("keeps the empty profile shape stable", () => {
    const profile = emptyDiscoveryProfile();
    expect(profile.quizProfiles).toEqual({});
    expect(profile.perfumers).toEqual({});
  });
});
