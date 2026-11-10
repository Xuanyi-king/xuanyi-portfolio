#!/usr/bin/env node
/**
 * Preview-only build adapter for GitHub project Pages.
 * Runs on an isolated Actions checkout; production source is untouched.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
const base = "/xuanyi-portfolio";
const site = "https://xuanyi-king.github.io" + base;
const action = process.argv[2];
const root = process.cwd();
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const location = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(location) : [location];
  });
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function prepare() {
  const nextConfig = path.join(root, "next.config.ts");
  let config = readFileSync(nextConfig, "utf8");
  const anchor = '  output: "export",';
  assert(config.includes(anchor), "Next config changed; update preview adapter rather than guessing");
  config = config.replace(anchor, anchor + "\n  basePath: process.env.NEXT_PUBLIC_PREVIEW_BASE_PATH || undefined,");
  writeFileSync(nextConfig, config);

  let modified = 0;
  for (const file of walk(path.join(root, "src"))) {
    if (!/\.(tsx?|css)$/.test(file)) continue;
    const previous = readFileSync(file, "utf8");
    let text = previous;
    // Public assets are not automatically prefixed by Next.js basePath.
    text = text.replace(/(["'\x60])\/(fonts|projects|covers|brand)\//g,
      (_match, quote, folder) => quote + base + "/" + folder + "/");
    text = text.replace(/url\(\s*\/(fonts|projects|covers|brand)\//g,
      (_match, folder) => "url(" + base + "/" + folder + "/");
    // BackLink is a custom component that renders a native anchor (not next/link).
    text = text.replace(/(<BackLink\b[^>]*?\bhref\s*=\s*)(["'])\/(?!\/|xuanyi-portfolio\/)/g,
      (_match, start, quote) => start + quote + base + "/");
    // Only native anchors need prefixing. Next.js Link already handles basePath.
    text = text.replace(/(<a\b[^>]*?\bhref\s*=\s*)(["'])\/(?!\/|xuanyi-portfolio\/)/g,
      (_match, start, quote) => start + quote + base + "/");
    text = text.replace(/(<a\b[^>]*?\bhref\s*=\s*\{\s*\x60)\/(?!xuanyi-portfolio\/)/g,
      (_match, start) => start + base + "/");
    text = text.replace("location.pathname==='/'",
      "location.pathname==='" + base + "/'");
    text = text.replaceAll("https://xuanyi-curiosity.astutebook516.chatgpt.site", site);
    if (text !== previous) { writeFileSync(file, text); modified++; }
  }
  console.log("Prepared independent preview under " + base + " (" + modified + " files adapted)");
}
function finalize() {
  const out = path.join(root, "out");
  assert(existsSync(path.join(out, "index.html")), "Missing static export");
  const marker = '<meta name="robots" content="noindex,nofollow"><meta name="xuanyi-preview-commit" content="' +
    String(process.env.GITHUB_SHA || "local") + '">';
  for (const file of walk(out).filter((f) => f.endsWith(".html"))) {
    const html = readFileSync(file, "utf8");
    assert(html.includes("</head>"), "Missing closing head in " + file);
    writeFileSync(file, html.replace("</head>", marker + "</head>"));
  }
  writeFileSync(path.join(out, "robots.txt"), "User-agent: *\nDisallow: /\n");
  writeFileSync(path.join(out, ".nojekyll"), "");
  writeFileSync(path.join(out, "preview-version.json"), JSON.stringify({
    purpose: "independent XUANYI 2.3 preview",
    source_sha: process.env.PREVIEW_SOURCE_SHA || "unknown",
    preview_build_sha: process.env.GITHUB_SHA || "local",
    pages_base_path: base,
    built_at: new Date().toISOString()
  }, null, 2));
  console.log("Added noindex metadata and preview-version.json");
}
function verify() {
  const out = path.join(root, "out");
  const routes = ["index.html","work/index.html","notes/index.html","about/index.html",
    "lab/index.html","lab/motion-direction/index.html"];
  for (const route of routes) assert(existsSync(path.join(out, route)), "Missing exported route: " + route);
  const home = readFileSync(path.join(out, "index.html"), "utf8");
  assert(home.includes(base + "/_next/"), "Missing prefixed Next.js assets in homepage");
  assert(home.includes('name="xuanyi-preview-commit"'), "Preview version marker absent");
  for (const htmlFile of walk(out).filter((f) => f.endsWith(".html"))) {
    const html = readFileSync(htmlFile, "utf8");
    const bad = html.match(/(?:href|src|poster)="\/(?:_next|fonts|projects|covers|brand|work|notes|about|lab|now|rss)/);
    assert(!bad, "Unprefixed asset/link in " + htmlFile + ": " + bad);
  }
  assert(existsSync(path.join(out,"preview-version.json")), "Missing version file");
  console.log("Preview subpaths and routes verified");
}
if (action === "prepare") prepare();
else if (action === "finalize") finalize();
else if (action === "verify") verify();
else throw new Error("Usage: node scripts/prepare-pages-preview.mjs prepare|finalize|verify");
