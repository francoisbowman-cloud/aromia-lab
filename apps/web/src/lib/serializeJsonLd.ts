/** Keep author-controlled strings inside the JSON script element. */
export function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? "null").replace(/</g, "\\u003c");
}
