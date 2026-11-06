import test from "node:test";
import assert from "node:assert/strict";
import { foldFrame } from "../src/motion/folding";
const metrics = {
  centerX: 245,
  centerY: 380,
  start: 83,
  distance: 578,
  navX: 45,
  navY: 42,
  scale: 30 / 310,
  width: 390,
};
test("folding preserves canonical start and exact navigation destination", () => {
  for (const width of [320, 390, 768, 1440]) {
    const m = { ...metrics, width };
    const a = foldFrame(0, m),
      b = foldFrame(1, m);
    assert.deepEqual(a, { x: 0, y: 0, scale: 1, rotation: 0 });
    assert.ok(Math.abs(b.x - (m.navX - m.centerX)) < 0.001);
    assert.ok(
      Math.abs(b.y - (m.navY - m.centerY + m.start + m.distance)) < 0.001,
    );
    assert.equal(b.scale, m.scale);
    assert.equal(b.rotation, 9);
  }
});
test("phone fold keeps its center below header until lateral arrival, and reverses exactly", () => {
  for (const p of [0.4, 0.5, 0.65, 0.75, 0.85, 0.9]) {
    const f = foldFrame(p, metrics),
      screenY = metrics.centerY - metrics.start - metrics.distance * p + f.y;
    assert.ok(screenY > 90, `visible at ${p}`);
    assert.deepEqual(f, foldFrame(p, metrics));
  }
  const mid = foldFrame(0.5, metrics);
  assert.ok(metrics.centerX + mid.x > 300);
});
