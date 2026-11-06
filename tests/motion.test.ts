import test from "node:test";
import assert from "node:assert/strict";
import { ribbonPaths, springStep } from "../src/motion/geometry";
test("rest shape preserves brand curves; deformations keep endpoints and finite geometry", () => {
  assert.deepEqual(ribbonPaths({ x: 0, y: 0 }, { x: 0, y: 0 }), [
    "M112 110 C258 102 244 366 390 378",
    "M390 103 C246 112 254 367 110 382",
  ]);
  const paths = ribbonPaths({ x: Infinity, y: 1e8 }, { x: -1e8, y: NaN });
  assert.ok(paths.every((p) => !p.includes("NaN") && !p.includes("Infinity")));
  assert.ok(paths[0].endsWith("390 378"));
});
test("spring settles after release and stays stable after suspended frame", () => {
  let p = 60,
    v = 0;
  for (let i = 0; i < 600; i++) {
    const next = springStep(p, v, 0, i === 1 ? 20 : 1 / 60);
    p = next.position;
    v = next.velocity;
    assert.ok(Math.abs(p) < 100);
  }
  assert.ok(Math.abs(p) < 0.01 && Math.abs(v) < 0.01);
});
