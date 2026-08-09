import test from "node:test";
import assert from "node:assert/strict";
import { parseRobotsSitemaps, parseSitemapXml, scoreUrlForCandidate, sameRegistrableHost, discoverOfficialUrls, tokenizeIdentity, extractInternalLinks, isFragranceNavigationUrl } from "../source-discovery.mjs";

test("robots and sitemap parsers preserve official URLs", () => {
  assert.deepEqual(parseRobotsSitemaps("User-agent: *\nSitemap: https://brand.test/sitemap.xml\nSitemap: https://brand.test/products.xml"), ["https://brand.test/sitemap.xml","https://brand.test/products.xml"]);
  assert.deepEqual(parseSitemapXml("<urlset><url><loc>https://brand.test/a&amp;b</loc></url></urlset>"), ["https://brand.test/a&b"]);
});

test("host guard allows subdomains but rejects unrelated redirects", () => {
  assert.equal(sameRegistrableHost("https://www.brand.test/p/x", "brand.test"), true);
  assert.equal(sameRegistrableHost("https://shop.brand.test/p/x", "brand.test"), true);
  assert.equal(sameRegistrableHost("https://evil.test/brand.test", "brand.test"), false);
});

test("identity URL tokens exclude brand-wide noise", () => {
  assert.deepEqual(tokenizeIdentity({ brand: "Bvlgari", name: "Man in Black", concentration: "EDP" }), ["man","black"]);
  assert.equal(scoreUrlForCandidate("https://www.bulgari.com/heritage/bulgari-history", { brand: "Bvlgari", name: "Man in Black" }), 0);
});

test("URL scoring favors identity tokens and product paths", () => {
  const candidate = { brand: "Maison Test", name: "Amber Moon", concentration: "EDP" };
  assert.ok(scoreUrlForCandidate("https://brand.test/products/amber-moon-eau-de-parfum", candidate) > scoreUrlForCandidate("https://brand.test/collections/amber-moon-gifts", candidate));
});

test("landing-page fallback extracts only internal non-sitemap links", () => {
  const html = `<a href="/products/amber-moon">Product</a><a href="https://evil.test/amber-moon">Bad</a><a href="/products.xml">XML</a>`;
  assert.deepEqual(extractInternalLinks(html, "https://brand.test", "brand.test"), ["https://brand.test/products/amber-moon"]);
});

test("fragrance navigation classifier remains bounded to relevant categories", () => {
  assert.equal(isFragranceNavigationUrl("https://brand.test/beauty/fragrances"), true);
  assert.equal(isFragranceNavigationUrl("https://brand.test/fragrance/women"), true);
  assert.equal(isFragranceNavigationUrl("https://brand.test/blog/fragrance-history"), false);
});

test("discovery prioritizes product sitemaps and never ranks XML as product pages", async () => {
  const pages = new Map([
    ["https://brand.test/robots.txt", "Sitemap: https://brand.test/sitemap.xml"],
    ["https://brand.test/sitemap.xml", "<sitemapindex><sitemap><loc>https://brand.test/news.xml</loc></sitemap><sitemap><loc>https://brand.test/products.xml</loc></sitemap><sitemap><loc>https://evil.test/foreign.xml</loc></sitemap></sitemapindex>"],
    ["https://brand.test/products.xml", "<urlset><url><loc>https://brand.test/products/amber-moon-edp</loc></url><url><loc>https://brand.test/collections/gifts</loc></url></urlset>"],
    ["https://brand.test/news.xml", "<urlset><url><loc>https://brand.test/blog/amber-moon-launch</loc></url></urlset>"],
  ]);
  const fetchImpl = async (url) => ({ ok: pages.has(url), status: pages.has(url) ? 200 : 404, url, headers: { get: () => "text/xml" }, text: async () => pages.get(url) ?? "" });
  const result = await discoverOfficialUrls({ brand: "Brand", name: "Amber Moon", concentration: "EDP", official_domain: "brand.test" }, { fetchImpl, timeoutMs: 1000 });
  assert.equal(result.status, "FOUND");
  assert.equal(result.urls[0].url, "https://brand.test/products/amber-moon-edp");
  assert.ok(result.urls.every((x) => !x.url.endsWith(".xml")));
  assert.equal(result.sitemapCount, 3);
});

test("when sitemap misses, discovery follows one official fragrance navigation depth", async () => {
  const pages = new Map([
    ["https://brand.test/robots.txt", ""],
    ["https://brand.test/sitemap.xml", "<urlset><url><loc>https://brand.test/about</loc></url></urlset>"],
    ["https://brand.test", `<a href="/fragrances">Fragrances</a><a href="/about">About</a>`],
    ["https://brand.test/fragrances", `<a href="/fragrances/amber-moon-eau-de-parfum">Amber Moon</a><a href="https://evil.test/amber-moon">Bad</a>`],
  ]);
  const fetchImpl = async (url) => ({ ok: pages.has(url), status: pages.has(url) ? 200 : 404, url, headers: { get: () => "text/html" }, text: async () => pages.get(url) ?? "" });
  const result = await discoverOfficialUrls({ brand: "Brand", name: "Amber Moon", concentration: "EDP", official_domain: "brand.test" }, { fetchImpl, timeoutMs: 1000 });
  assert.equal(result.status, "FOUND");
  assert.equal(result.urls[0].url, "https://brand.test/fragrances/amber-moon-eau-de-parfum");
  assert.ok(result.urls.every((x) => x.url.startsWith("https://brand.test/")));
});
