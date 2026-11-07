import test from "node:test";
import assert from "node:assert/strict";
import { createCompactPoseGate } from "../src/motion/compact-pose";
test("tiny identities skip invisible updates but paint the exact canonical rest again", () => {
  const next = createCompactPoseGate();
  assert.deepEqual(next([0, 0, 0, 0]), [0, 0, 0, 0]);
  assert.equal(next([0.1, -0.1, 0.2, -0.2]), null);
  assert.deepEqual(next([12.3, 3.9, -9.8, -2.3]), [12, 4, -10, -2]);
  assert.equal(next([12.4, 4.1, -10.1, -2.2]), null);
  assert.deepEqual(next([0, 0, 0, 0]), [0, 0, 0, 0]);
});
test("compact pose rounding is bounded to half an SVG unit and never propagates invalid geometry", () => {
  for (let x = -64; x <= 64; x += 0.13) {
    const next = createCompactPoseGate();
    const values = [x, x * 0.32, -x * 0.8, -x * 0.2];
    const out = next(values)!;
    assert.ok(out.every((n, i) => Math.abs(n - values[i]) <= 0.500001));
  }
  assert.deepEqual(
    createCompactPoseGate()([NaN, Infinity, 1000, -1000]),
    [0, 0, 64, -64],
  );
});
