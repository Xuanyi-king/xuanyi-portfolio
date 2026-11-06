import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { XMark } from "../src/components/x-mark";
Object.assign(globalThis, { React });
test("Sculpted Silk has an actual rear thickness layer and front crossing order", () => {
  const html = renderToStaticMarkup(
    React.createElement(XMark, { material: "sculpted" }),
  );
  assert.ok(html.includes('data-material="sculpted"'));
  assert.match(html, /data-thickness="true"/);
  assert.ok(html.indexOf("silk-a") < html.indexOf("silk-b"));
  assert.match(html, /clipPath/);
});
test("Translucent Fold cuts backface color at the crossing instead of stacking dirty alpha", () => {
  const html = renderToStaticMarkup(
    React.createElement(XMark, { material: "translucent" }),
  );
  assert.ok(html.includes('data-material="translucent"'));
  assert.match(html, /<mask/);
  assert.match(html, /mask="url\(/);
  assert.doesNotMatch(html, /data-thickness="true"/);
});
test("compact identity omits material complexity and remains a solid silhouette", () => {
  const html = renderToStaticMarkup(
    React.createElement(XMark, { compact: true }),
  );
  assert.doesNotMatch(html, /data-thickness="true"/);
  assert.doesNotMatch(html, /data-surface="[ab]-face"/);
  assert.match(html, /data-surface="a-outline"/);
  assert.match(html, /data-surface="b-outline"/);
});
