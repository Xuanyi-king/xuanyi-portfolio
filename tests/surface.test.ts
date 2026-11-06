import test from "node:test";
import assert from "node:assert/strict";
import { ribbonGeometry } from "../src/motion/geometry";
import { silkSurface } from "../src/motion/surface";

test("silk is a closed tapered surface, with smooth edges and real width variation", () => {
  const curve = ribbonGeometry({ x: 0, y: 0 }, { x: 0, y: 0 }).curves[0];
  const surface = silkSurface(curve, 0, "cloud");
  assert.ok(surface.outline.startsWith("M") && surface.outline.endsWith("Z"));
  assert.ok(surface.outline.includes("C"));
  assert.ok(Math.max(...surface.widths) - Math.min(...surface.widths) > 12);
  assert.ok(Math.min(...surface.widths) >= 12);
  assert.notEqual(surface.face, surface.outline);
  assert.equal(typeof surface.sheen, "string");
});

test("deformation updates all faces without changing the brand centerline endpoints", () => {
  const rest = ribbonGeometry({ x: 0, y: 0 }, { x: 0, y: 0 });
  const pulled = ribbonGeometry({ x: 40, y: -30 }, { x: -20, y: 35 });
  for (let i = 0; i < 2; i++) {
    assert.deepEqual(rest.curves[i][0], pulled.curves[i][0]);
    assert.deepEqual(rest.curves[i][3], pulled.curves[i][3]);
    const a = silkSurface(rest.curves[i], i, "cloud");
    const b = silkSurface(pulled.curves[i], i, "cloud");
    for (const key of [
      "outline",
      "face",
      "edge",
      "sheen",
      "highlight",
    ] as const)
      assert.notEqual(a[key], b[key]);
  }
});

test("extreme Lab offsets produce finite bounded surfaces for both prototype profiles", () => {
  for (const variant of ["cloud", "bias"] as const)
    for (const x of [-64, 0, 64])
      for (const y of [-64, 0, 64]) {
        const geometry = ribbonGeometry({ x, y }, { x: -x, y: -y });
        geometry.curves.forEach((curve, i) => {
          const surface = silkSurface(curve, i, variant);
          for (const key of ["outline", "face", "edge", "highlight"] as const) {
            assert.ok(!/NaN|Infinity/.test(surface[key]));
            const numbers = surface[key].match(/-?\d+(?:\.\d+)?/g)!.map(Number);
            assert.ok(numbers.every((n) => n >= 0 && n <= 500));
          }
        });
      }
});
