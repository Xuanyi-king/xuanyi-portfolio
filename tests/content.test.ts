import test from "node:test";
import assert from "node:assert/strict";
import {
  extractHeadings,
  readingMinutes,
  validSlug,
} from "../src/lib/content-utils";

test("TOC includes real headings and ignores fenced code", () => {
  assert.deepEqual(
    extractHeadings(
      "## 好奇的形状\n\n```ts\n## not a heading\n```\n### 一点细节\n## 好奇的形状",
    ),
    [
      { depth: 2, text: "好奇的形状", id: "好奇的形状" },
      { depth: 3, text: "一点细节", id: "一点细节" },
      { depth: 2, text: "好奇的形状", id: "好奇的形状-1" },
    ],
  );
});
test("reading time accounts for Chinese characters and English words", () => {
  assert.equal(readingMinutes("好".repeat(700)), 2);
  assert.equal(readingMinutes("hello ".repeat(500)), 3);
  assert.equal(readingMinutes(""), 1);
});
test("content slugs reject traversal and support readable URLs", () => {
  assert.equal(validSlug("making-xuanyi"), true);
  assert.equal(validSlug("../secrets"), false);
  assert.equal(validSlug("a/b"), false);
  assert.equal(validSlug(""), false);
});

test("TOC matches rendered Markdown IDs for links, underscores and duplicate collisions", () => {
  assert.deepEqual(
    extractHeadings(
      "## x_mark\n## [我的项目](https://example.com)\n## alpha\n## alpha\n## alpha-1",
    ),
    [
      { depth: 2, text: "x_mark", id: "x_mark" },
      { depth: 2, text: "我的项目", id: "我的项目" },
      { depth: 2, text: "alpha", id: "alpha" },
      { depth: 2, text: "alpha", id: "alpha-1" },
      { depth: 2, text: "alpha-1", id: "alpha-1-1" },
    ],
  );
});
