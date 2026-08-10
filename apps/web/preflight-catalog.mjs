const EXPECTED_PUBLISHED = 125;
const BASES = [
  "http://api.railway.internal:4000",
  "https://api-production-fe2f.up.railway.app",
];
const ATTEMPTS = 6;
const DELAY_MS = 1500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readCatalog(base) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${base}/api/perfumes`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };
    const data = await response.json();
    if (!Array.isArray(data)) return { ok: false, reason: "non-array payload" };
    return {
      ok: true,
      count: data.length,
      complete: data.length === EXPECTED_PUBLISHED,
      reason: data.length === EXPECTED_PUBLISHED ? "ok" : `expected ${EXPECTED_PUBLISHED}, got ${data.length}`,
    };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
  for (const base of BASES) {
    const result = await readCatalog(base);
    const source = base.includes("railway.internal") ? "private" : "public";
    if (result.ok) {
      if (result.complete) {
        console.log(`[web-catalog-preflight] PASS source=${source} count=${result.count}`);
      } else {
        console.warn(`[web-catalog-preflight] DEGRADED source=${source} count=${result.count} ${result.reason}; web startup will continue`);
      }
      process.exit(0);
    }
    console.warn(`[web-catalog-preflight] attempt=${attempt}/${ATTEMPTS} source=${base} unavailable=${result.reason}`);
  }
  if (attempt < ATTEMPTS) await sleep(DELAY_MS);
}

console.warn("[web-catalog-preflight] DEGRADED: Aromia API is temporarily unavailable; web startup will continue and use its runtime recovery path");
process.exit(0);
