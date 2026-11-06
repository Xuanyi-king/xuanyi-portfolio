import test from "node:test";
import assert from "node:assert/strict";
import {
  positiveModulo,
  signedDistance,
  frameFor,
} from "../src/motion/gallery-model";
import { createGalleryController } from "../src/motion/gallery-controller";
import { gestureIntent } from "../src/motion/gallery-gesture";
function clock() {
  let id = 0,
    now = 0;
  const jobs = new Map<number, (t: number) => void>();
  return {
    request(fn: (t: number) => void) {
      jobs.set(++id, fn);
      return id;
    },
    cancel(i: number) {
      jobs.delete(i);
    },
    step(n = 1) {
      for (let i = 0; i < n; i++) {
        now += 1000 / 60;
        const a = [...jobs.values()];
        jobs.clear();
        a.forEach((f) => f(now));
      }
    },
    get size() {
      return jobs.size;
    },
  };
}
test("positive indexing, signed wrap, and a readable center for 1/2/3/4/6 projects", () => {
  assert.equal(positiveModulo(-1, 3), 2);
  for (const count of [1, 2, 3, 4, 6])
    for (let p = -101; p <= 101; p += 0.125) {
      const frames = Array.from({ length: count }, (_, i) =>
        frameFor(i, p, count, 1440, false),
      );
      assert.ok(
        frames.some((f) => f.opacity > 0.6),
        `no empty frame at ${count}/${p}`,
      );
      assert.ok(
        frames.every((f) => Number.isFinite(f.x + f.z + f.yaw + f.scale)),
      );
      assert.equal(
        positiveModulo(Math.round(p), count),
        positiveModulo(Math.round(p + count * 10), count),
      );
    }
  assert.ok(Math.abs(signedDistance(0, 2.99, 3)) < 0.02);
});
test("wrap transport happens only when that card is invisible", () => {
  for (const n of [2, 3, 4, 6]) {
    const a = frameFor(0, n / 2 - 0.00001, n, 1440, false),
      b = frameFor(0, n / 2 + 0.00001, n, 1440, false);
    assert.ok(a.opacity < 0.00001 && b.opacity < 0.00001);
  }
  assert.equal(frameFor(0, 0, 3, 390, true).yaw, 0);
  assert.equal(frameFor(1, 0, 3, 390, true).opacity, 0);
});
test("100 forward and reverse steps retain all requests and the true project count", () => {
  for (const count of [1, 2, 3, 4, 6]) {
    const c = clock();
    let active = -1;
    const e = createGalleryController(
      count,
      {
        frame() {},
        active(i) {
          active = i;
        },
      },
      c,
    );
    for (let i = 0; i < 100; i++) e.step(1);
    c.step(900);
    assert.equal(active, 100 % count);
    assert.equal(c.size, 0);
    assert.equal(e.read().position, count === 1 ? 0 : 100);
    for (let i = 0; i < 100; i++) e.step(-1);
    c.step(900);
    assert.equal(active, 0);
    assert.equal(e.read().position, 0);
    e.dispose();
  }
});
test("new gesture interrupts inertia, cancel/resize/reduced/dispose do not leave RAFs", () => {
  const c = clock();
  let paints = 0;
  const e = createGalleryController(
    3,
    {
      frame() {
        paints++;
      },
      active() {},
    },
    c,
  );
  e.press();
  e.drag(1.3);
  e.release(8);
  c.step(4);
  assert.ok(e.read().moving);
  const p = e.read().position;
  e.press();
  c.step(20);
  assert.equal(e.read().position, p);
  assert.equal(c.size, 0);
  e.drag(2.2);
  e.release(-9);
  c.step(10);
  e.cancel();
  c.step(400);
  assert.ok(Number.isInteger(e.read().position));
  e.setReduced(true);
  e.step(1);
  assert.equal(c.size, 0);
  assert.ok(Number.isInteger(e.read().position));
  e.setReduced(false);
  e.step(1);
  e.dispose();
  const before = paints;
  c.step(200);
  e.step(1);
  assert.equal(paints, before);
  assert.equal(c.size, 0);
});
test("direction lock prioritizes vertical page scroll and distinguishes long presses", () => {
  assert.equal(gestureIntent(3, 5, 60), "pending");
  assert.equal(gestureIntent(30, 4, 70), "horizontal");
  assert.equal(gestureIntent(6, 40, 70), "vertical");
  assert.equal(gestureIntent(20, 20, 80), "vertical");
  assert.equal(gestureIntent(2, 1, 600), "longpress");
});
test("restored gallery starts on its saved virtual position without a flight from zero", () => {
  const c = clock();
  let first: number | undefined;
  let active = -1;
  const e = createGalleryController(
    3,
    {
      frame(p) {
        first ??= p;
      },
      active(i) {
        active = i;
      },
    },
    c,
    5,
  );
  assert.equal(first, 5);
  assert.equal(e.read().position, 5);
  assert.equal(active, 2);
  assert.equal(c.size, 0);
  e.dispose();
});
