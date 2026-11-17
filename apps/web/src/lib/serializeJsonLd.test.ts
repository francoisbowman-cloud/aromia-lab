import { expect, it } from "vitest";
import { serializeJsonLd } from "./serializeJsonLd";

it("preserves JSON values without allowing an HTML script boundary", () => {
  const value = { headline: '</script><script>window.injected=true</script>', name: 'Ámbar & café' };
  const serialized = serializeJsonLd(value);
  expect(serialized).not.toContain('<');
  expect(JSON.parse(serialized)).toEqual(value);
});
