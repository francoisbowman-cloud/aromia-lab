import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "apps", "web", "src", "app");
const SOURCE_DIR = path.join(ROOT, "apps", "web", "src");

function walk(dir, predicate = () => true) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function routeFromPageFile(file) {
  const rel = path.relative(APP_DIR, path.dirname(file));
  const parts = rel
    .split(path.sep)
    .filter(Boolean)
    .filter((part) => !(part.startsWith("(") && part.endsWith(")")));

  if (!parts.length) return "/";

  return (
    "/" +
    parts
      .map((part) => {
        if (/^\[\.\.\..+\]$/.test(part)) return "*";
        if (/^\[.+\]$/.test(part)) return ":dynamic";
        return part;
      })
      .join("/")
  );
}

function escapeRegex(value) {
  return value.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
}

function routeRegex(route) {
  if (route === "/") return /^\/$/;
  const pattern = route
    .split("/")
    .filter(Boolean)
    .map((part) => {
      if (part === "*") return ".+";
      if (part === ":dynamic") return "[^/]+";
      return escapeRegex(part);
    })
    .join("/");
  return new RegExp("^/" + pattern + "/?$");
}

const pageFiles = walk(
  APP_DIR,
  (file) => file.endsWith(path.sep + "page.tsx") || file.endsWith(path.sep + "page.ts"),
);
const routes = Array.from(new Set(pageFiles.map(routeFromPageFile))).sort();
const routeMatchers = routes.map((route) => ({ route, regex: routeRegex(route) }));

const sourceFiles = walk(SOURCE_DIR, (file) => /\.(tsx?|jsx?)$/.test(file));
const failures = [];
let checked = 0;

const patterns = [
  /href\s*=\s*"([^"]+)"/g,
  /href\s*=\s*'([^']+)'/g,
  /href\s*=\s*\{\s*"([^"]+)"\s*\}/g,
  /href\s*=\s*\{\s*'([^']+)'\s*\}/g,
];

function normalizeHref(href) {
  return href.split("#")[0].split("?")[0] || "/";
}

function validInternalPath(href) {
  const normalized = normalizeHref(href);
  return routeMatchers.some(({ regex }) => regex.test(normalized));
}

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  const literalHrefs = new Set();

  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source))) literalHrefs.add(match[1]);
  }

  for (const href of literalHrefs) {
    if (!href) continue;

    if (href === "#" || href.startsWith("javascript:")) {
      failures.push({ file, href, reason: "placeholder/dead link" });
      continue;
    }

    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      continue;
    }

    if (!href.startsWith("/")) continue;
    if (href.startsWith("/api/")) continue;

    checked += 1;
    if (!validInternalPath(href)) {
      failures.push({ file, href, reason: "no matching App Router page" });
    }
  }
}

if (failures.length) {
  console.error("Aromia internal-link audit failed: " + failures.length + " issue(s).");
  for (const failure of failures) {
    console.error(
      "- " +
        path.relative(ROOT, failure.file) +
        " -> " +
        failure.href +
        " (" +
        failure.reason +
        ")",
    );
  }
  process.exit(1);
}

console.log(
  "Aromia internal-link audit PASS: " +
    checked +
    " literal internal href(s) checked against " +
    routes.length +
    " App Router route(s).",
);
