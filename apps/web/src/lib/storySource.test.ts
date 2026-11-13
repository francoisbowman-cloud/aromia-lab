import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import { extractStorySource } from "./storySource";

it("keeps escaped frontmatter and editorial notes out of the actual story", () => {
  const source = readFileSync(resolve(process.cwd(), "../../drafts/huele-sintetico-que-estamos-diciendo.md"), "utf8");
  const story = extractStorySource(source);
  expect(story.title).toBe('"Huele sintético": ¿qué estamos diciendo realmente?');
  expect(story.body).not.toContain("batch_100_item:");
  expect(story.body).not.toContain("**Fact-check:**");
  expect(story.body).not.toContain("EDITORIAL: READY");
});

it("refuses to render the operational preamble when a story heading is absent", () => {
  expect(() => extractStorySource("---\ntitulo: Internal draft\n---\nFact-check notes")).toThrow("story heading");
});
