const EXPECTED_PUBLISHED = 125;
const BASES = [
  "http://api.railway.internal:4000",
  "https://api-production-fe2f.up.railway.app",
];
const ATTEMPTS = 24;
const DELAY_MS = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readCatalog(base) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(`${base}/api/perfumes`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };
    const data = await response.json();
    if (!Array.isArray(data)) return { ok: false, reason: "non-array payload" };
    return { ok: data.length === EXPECTED_PUBLISHED, count: data.length, reason: data.length === EXPECTED_PUBLISHED ? "ok" : `expected ${EXPECTED_PUBLISHED}, got ${data.length}` };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
  for (const base of BASES) {
    const result = await readCatalog(base);
    if (result.ok) {
      console.log(`[web-catalog-preflight] PASS source=${base.includes("railway.internal") ? "private" : "public"} count=${result.count}`);
      process.exit(0);
    }
    console.error(`[web-catalog-preflight] attempt=${attempt}/${ATTEMPTS} source=${base} failed=${result.reason}`);
  }
  if (attempt < ATTEMPTS) await sleep(DELAY_MS);
}

console.error(`[web-catalog-preflight] FAIL: web cannot read exactly ${EXPECTED_PUBLISHED} published perfumes from Aromia API`);
process.exit(1);
