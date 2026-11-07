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
  "lab/canvas-study",
  "lab/motion-direction",
  "now",
];
let count = 0;
const sceneSources = new Map();
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
  // Native links remain usable without View Transitions or JavaScript.
  for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/work\/[^"?#]+)"/g)) {
    assert.ok(
      href.endsWith("/"),
      `Project link must use the exported directory URL: ${href}`,
    );
  }
  const scenes = [
    ...html.matchAll(
      /<div class="project-scene ([^"]+)" style="view-transition-name:(cover-[^"]+)"/g,
    ),
  ];
  if (route === "" || route === "work")
    assert.equal(scenes.length, 3, "All project scenes are present");
  for (const scene of scenes) {
    const image = html.slice(scene.index).match(/<img\b[^>]*src="([^"]+)"/);
    assert.ok(image, `Missing visible scene image: ${scene[2]}`);
    const known = sceneSources.get(scene[2]);
    if (known)
      assert.equal(image[1], known, `List/detail source mismatch: ${scene[2]}`);
    sceneSources.set(scene[2], image[1]);
  }
  assert.equal(
    new Set(scenes.map((m) => m[2])).size,
    scenes.length,
    `Duplicate transition names in ${route}`,
  );
  assert.ok(
    !/<img[^>]*view-transition-name/.test(html),
    "Never snapshot a covered backing image",
  );
  if (route.startsWith("work/")) {
    const slug = route.slice(5);
    assert.equal(scenes.length, 1, "One complete detail scene");
    assert.equal(scenes[0][2], `cover-${slug}`);
    assert.match(
      html,
      /<a class="back-link" href="\/work\/"/,
      "Native detail return link",
    );
    assert.match(
      html,
      /<a class="next-project" href="\/work\/[^"/]+\/"/,
      "Native next-project link",
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
