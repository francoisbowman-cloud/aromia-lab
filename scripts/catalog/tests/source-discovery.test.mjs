import test from "node:test";
import assert from "node:assert/strict";
import { parseRobotsSitemaps, parseSitemapXml, scoreUrlForCandidate, sameRegistrableHost, discoverOfficialUrls } from "../source-discovery.mjs";

test("robots and sitemap parsers preserve official URLs", () => {
  assert.deepEqual(parseRobotsSitemaps("User-agent: *\nSitemap: https://brand.test/sitemap.xml\nSitemap: https://brand.test/products.xml"), ["https://brand.test/sitemap.xml","https://brand.test/products.xml"]);
  assert.deepEqual(parseSitemapXml("<urlset><url><loc>https://brand.test/a&amp;b</loc></url></urlset>"), ["https://brand.test/a&b"]);
});

test("host guard allows subdomains but rejects unrelated redirects", () => {
  assert.equal(sameRegistrableHost("https://www.brand.test/p/x", "brand.test"), true);
  assert.equal(sameRegistrableHost("https://shop.brand.test/p/x", "brand.test"), true);
  assert.equal(sameRegistrableHost("https://evil.test/brand.test", "brand.test"), false);
});

test("URL scoring favors identity tokens and product paths", () => {
  const candidate = { brand: "Maison Test", name: "Amber Moon", concentration: "EDP" };
  assert.ok(scoreUrlForCandidate("https://brand.test/products/amber-moon-eau-de-parfum", candidate) > scoreUrlForCandidate("https://brand.test/collections/gifts", candidate));
});

test("discovery walks sitemap index without leaving official domain", async () => {
  const pages = new Map([
    ["https://brand.test/robots.txt", "Sitemap: https://brand.test/sitemap.xml"],
    ["https://brand.test/sitemap.xml", "<sitemapindex><sitemap><loc>https://brand.test/products.xml</loc></sitemap><sitemap><loc>https://evil.test/foreign.xml</loc></sitemap></sitemapindex>"],
    ["https://brand.test/products.xml", "<urlset><url><loc>https://brand.test/products/amber-moon-edp</loc></url><url><loc>https://brand.test/collections/gifts</loc></url></urlset>"],
  ]);
  const fetchImpl = async (url) => ({ ok: pages.has(url), status: pages.has(url) ? 200 : 404, url, headers: { get: () => "text/xml" }, text: async () => pages.get(url) ?? "" });
  const result = await discoverOfficialUrls({ brand: "Brand", name: "Amber Moon", concentration: "EDP", official_domain: "brand.test" }, { fetchImpl, timeoutMs: 1000 });
  assert.equal(result.status, "FOUND");
  assert.equal(result.urls[0].url, "https://brand.test/products/amber-moon-edp");
  assert.equal(result.sitemapCount, 2);
});
