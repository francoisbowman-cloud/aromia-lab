import { describe, expect, it } from "vitest";
import { officialProductPage } from "./officialProductPage";
describe("official packshot variant selection", () => {
  it.each([undefined, null, "", "parfum", "unknown", "not eau de toilette"])("does not invent Chance concentration for %s", value => {
    expect(officialProductPage("chance-eau-tendre", value)).toBeNull();
  });
  it.each(["EDT", " Eau de Toilette "])("selects explicit EDT %s", value => {
    expect(officialProductPage("chance-eau-tendre", value)).toContain("/126320/");
  });
  it.each(["EDP", " Eau de Parfum "])("selects explicit EDP %s", value => {
    expect(officialProductPage("chance-eau-tendre", value)).toContain("/126260/");
  });
});
