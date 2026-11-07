import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { ribbonGeometry } from "../src/motion/geometry";
import { silkSurface } from "../src/motion/surface";
const samples = [
  [
    -64,
    -64,
    "d299bda77f3a4aaa4810208d6210b2f02ecd2f8b22b7c0412d500279f0251be7",
  ],
  [-64, 0, "537937754268f6cae12dff1002a68cdd974e256cfd022df840d23fe30253a993"],
  [-64, 64, "dc50a16d408258fb6703bf047287aaa7187422f611c4fed35994f6807be9b6fb"],
  [0, -64, "d77666326f746dce0908460235fdee516599366cf0ff66c644a630e1c1bc0c51"],
  [0, 0, "165f1e44badd95af1a796e0909bf58e800b7d025f81fc15968e40a8aa03a87cb"],
  [0, 64, "bdac85f92dcf819321906b7f64eeb720f5f1ef81360b749463c189c6e32cab6d"],
  [64, -64, "bddb3d892c753c605582dd770328b163455fbce7863577d6f440128a5d3e7d40"],
  [64, 0, "7bdc3b2aff8a78e5123457fe570a4c4a699ccb8d4321816d2d74794eaf1c9bc2"],
  [64, 64, "84126e0e7c2555ddf723b6d56d7af7a4cc7610732c6416a981a2e06c355c7761"],
];
test("surface optimization preserves exact baseline outputs at nine extreme poses", () => {
  for (const [x, y, hash] of samples) {
    const surfaces = ribbonGeometry(
      { x: Number(x), y: Number(y) },
      { x: -Number(x), y: -Number(y) },
    ).curves.map((c, i) => {
      const { outline, face, edge, sheen, highlight, widths } = silkSurface(
        c,
        i,
      );
      return { outline, face, edge, sheen, highlight, widths };
    });
    assert.equal(
      createHash("sha256").update(JSON.stringify(surfaces)).digest("hex"),
      hash,
    );
  }
});

test("compact identities build the silhouette without unused material paths", () => {
  const curve = ribbonGeometry({ x: 12, y: -8 }, { x: -5, y: 7 }).curves[0];
  const s = silkSurface(curve, 0, true);
  assert.ok(s.outline.length > 100);
  assert.ok(
    [s.face, s.edge, s.sheen, s.highlight, s.rim].every((d) => d === ""),
    "Tiny marks should not build invisible material layers",
  );
});
test("the unselected twist study adds no rim output to the formal surface", () => {
  const curve = ribbonGeometry({ x: 0, y: 0 }, { x: 0, y: 0 }).curves[1];
  assert.ok(
    silkSurface(curve, 1).rim === "",
    "Candidate-only geometry stays out of the formal renderer",
  );
});
