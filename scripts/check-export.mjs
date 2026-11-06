import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root = path.resolve("out");
const expected = [
  "",
  "work",
  "work/adaptive-router",
  "work/knowledge-film",
  "work/zhihu-multiverse",
  "notes",
  "notes/making-xuanyi",
  "about",
  "lab",
  "now",
];
let count = 0;
for (const route of expected) {
  const file = path.join(root, route, "index.html");
  assert.ok(fs.existsSync(file), `Missing route: /${route}`);
  const html = fs.readFileSync(file, "utf8");
  assert.match(html, /<html[^>]+lang="zh-CN"/, "Document language");
  assert.match(html, /<title>[^<]+<\/title>/, "Page title");
  assert.match(
    html,
    /<meta name="description" content="[^"]+"/,
    "Page description",
  );
  assert.match(html, /<link rel="canonical" href="[^"]+"/, "Canonical URL");
  assert.match(html, /id="main-content"/, "Skip link target");
  assert.ok(!html.includes("Lorem ipsum"), "No placeholder copy");
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const [, target] of html.matchAll(/(?:href|src)="(\/[^"]*|#[^"]*)"/g)) {
    const url = new URL(target, `https://example.test/${route}/`);
    if (target.startsWith("#")) {
      assert.ok(
        ids.has(decodeURIComponent(url.hash.slice(1))),
        `Broken anchor in ${route}: ${target}`,
      );
      continue;
    }
    const local = path.join(root, decodeURIComponent(url.pathname));
    assert.ok(
      fs.existsSync(local) || fs.existsSync(path.join(local, "index.html")),
      `Missing asset / route: ${target} from ${route}`,
    );
  }
  count++;
}
const article = fs.readFileSync(
  path.join(root, "notes/making-xuanyi/index.html"),
  "utf8",
);
assert.match(
  article,
  /data-rehype-pretty-code-figure/,
  "Code highlighting is rendered",
);
for (const [, anchor] of article.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(
    article.includes(`id="${decodeURIComponent(anchor)}"`),
    `TOC target missing: ${anchor}`,
  );
}
for (const resource of [
  "og.png",
  "robots.txt",
  "sitemap.xml",
  "rss.xml",
  "404.html",
  "fonts/OFL-Manrope.txt",
  "brand/x-mark.svg",
])
  assert.ok(
    fs.existsSync(path.join(root, resource)),
    `Missing resource ${resource}`,
  );
assert.match(
  fs.readFileSync(path.join(root, "rss.xml"), "utf8"),
  /<item>/,
  "RSS contains real note",
);
assert.match(
  fs.readFileSync(path.join(root, "sitemap.xml"), "utf8"),
  /\/notes\/making-xuanyi\//,
  "Sitemap includes note",
);
console.log(
  `Export verified: ${count} content routes, internal links, assets, TOC, highlighted code, SEO, RSS, sitemap and 404.`,
);
