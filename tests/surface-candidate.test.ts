import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { ribbonGeometry } from "../src/motion/geometry";
import { silkSurface } from "../src/motion/surface";

test("the current Sculpted Silk geometry remains byte stable during the candidate study", () => {
  const surfaces = ribbonGeometry({ x: 0, y: 0 }, { x: 0, y: 0 }).curves.map(
    (c, i) => {
      const { outline, face, edge, sheen, highlight, widths } = silkSurface(
        c,
        i,
      );
      return { outline, face, edge, sheen, highlight, widths };
    },
  );
  assert.equal(
    createHash("sha256").update(JSON.stringify(surfaces)).digest("hex"),
    "165f1e44badd95af1a796e0909bf58e800b7d025f81fc15968e40a8aa03a87cb",
  );
});
test("the twist candidate has a distinct closed surface and a finite following rim", () => {
  for (const x of [-64, 0, 64])
    for (const y of [-64, 0, 64]) {
      const curves = ribbonGeometry({ x, y }, { x: -x, y: -y }).curves;
      for (let i = 0; i < 2; i++) {
        const base = silkSurface(curves[i], i),
          candidate = silkSurface(curves[i], i, false, "twist");
        assert.notEqual(candidate.outline, base.outline);
        for (const d of [candidate.outline, candidate.rim]) {
          assert.ok(d.startsWith("M") && d.endsWith("Z"));
          assert.ok(!/NaN|Infinity/.test(d));
          assert.ok(
            d
              .match(/-?\d+(?:\.\d+)?/g)!
              .map(Number)
              .every((n) => n >= 0 && n <= 500),
          );
        }
      }
    }
});
test("tiny identity silhouettes do not inherit experimental surface detail", () => {
  const curves = ribbonGeometry({ x: 0, y: 0 }, { x: 0, y: 0 }).curves;
  for (let i = 0; i < 2; i++)
    assert.equal(
      silkSurface(curves[i], i, true, "twist").outline,
      silkSurface(curves[i], i, true).outline,
    );
});
