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

import { createLivingSpring } from "../src/motion/living-spring";
function harness() {
  let time = 0,
    id = 0;
  const queued = new Map<number, (t: number) => void>();
  let paints: number[][] = [];
  const engine = createLivingSpring((v) => paints.push([...v]), {
    request(fn) {
      queued.set(++id, fn);
      return id;
    },
    cancel(n) {
      queued.delete(n);
    },
  });
  return {
    engine,
    paints,
    queued,
    frame() {
      time += 1000 / 60;
      const callbacks = [...queued.values()];
      queued.clear();
      callbacks.forEach((fn) => fn(time));
    },
    get latest() {
      return paints.at(-1)!;
    },
  };
}
test("changing form preserves the current position and momentum, then settles to the new preset", () => {
  const h = harness();
  h.engine.configure({ form: "open", strength: 1 });
  for (let i = 0; i < 8; i++) h.frame();
  const before = [...h.latest],
    previous = h.paints.at(-2)!;
  h.engine.configure({ form: "fold", strength: 1 });
  assert.deepEqual(h.latest, before);
  assert.equal(h.queued.size, 1);
  h.frame();
  const velocity = (before[0] - previous[0]) / (1 / 60);
  assert.ok(
    Math.abs(
      h.latest[0] - springStep(before[0], velocity, -30, 1 / 60).position,
    ) < 1e-8,
  );
  for (let i = 0; i < 300; i++) h.frame();
  assert.deepEqual(h.latest, [-30, 25, 30, -25]);
  assert.equal(h.queued.size, 0);
});
test("strength updates during a pull retain position and scale the existing target", () => {
  const h = harness();
  h.engine.pull(0, 20, 10);
  for (let i = 0; i < 15; i++) h.frame();
  const before = [...h.latest];
  h.engine.configure({ form: "rest", strength: 1.5 });
  assert.deepEqual(h.latest, before);
  for (let i = 0; i < 300; i++) h.frame();
  assert.deepEqual(h.latest, [30, 15, 0, 0]);
  h.engine.release();
  for (let i = 0; i < 300; i++) h.frame();
  assert.deepEqual(h.latest, [0, 0, 0, 0]);
});
test("reduced motion settles immediately, reset and disposal cancel all scheduled frames", () => {
  const h = harness();
  h.engine.configure({ form: "open", strength: 1 });
  h.frame();
  h.engine.setReduced(true);
  assert.deepEqual(h.latest, [30, -35, -30, 35]);
  assert.equal(h.queued.size, 0);
  h.engine.configure({ form: "fold", strength: 0.3 });
  assert.deepEqual(h.latest, [-30, 25, 30, -25]);
  h.engine.configure({ form: "rest", strength: 1 }, true);
  assert.deepEqual(h.latest, [0, 0, 0, 0]);
  h.engine.setReduced(false);
  h.engine.pull(1, 50, 10);
  h.engine.dispose();
  assert.equal(h.queued.size, 0);
  const count = h.paints.length;
  h.frame();
  assert.equal(h.paints.length, count);
});

import { pointerTilt } from "../src/motion/pointer-geometry";
test("pointer tilt uses stable layout bounds and clamps out-of-bounds input", () => {
  const bounds = { left: 100, top: 200, width: 400, height: 300 };
  assert.deepEqual(pointerTilt(300, 350, bounds), { x: 0, y: -0 });
  assert.deepEqual(pointerTilt(500, 200, bounds), { x: 2.5, y: 2.5 });
  assert.deepEqual(pointerTilt(5000, -200, bounds), { x: 2.5, y: 2.5 });
  assert.ok(
    Object.values(
      pointerTilt(0, 0, { left: 0, top: 0, width: 0, height: 0 }),
    ).every(Number.isFinite),
  );
});

test("reset during motion returns continuously without replacing the spring", () => {
  const h = harness();
  h.engine.configure({ form: "open", strength: 1 });
  h.engine.pull(0, 20, 10);
  for (let i = 0; i < 8; i++) h.frame();
  const before = [...h.latest];
  h.engine.configure({ form: "rest", strength: 1 }, true);
  assert.deepEqual(h.latest, before);
  assert.equal(h.queued.size, 1);
  for (let i = 0; i < 300; i++) h.frame();
  assert.deepEqual(h.latest, [0, 0, 0, 0]);
  assert.equal(h.queued.size, 0);
});

test("dragging directly positions the grabbed curve; release and reset recover", () => {
  const h = harness();
  h.engine.grab(0);
  h.engine.drag(0, 25, 32);
  assert.deepEqual(h.latest, [25, 32, 0, 0]);
  h.frame();
  assert.deepEqual(h.latest, [25, 32, 0, 0]);
  h.engine.release(0);
  for (let i = 0; i < 300; i++) h.frame();
  assert.deepEqual(h.latest, [0, 0, 0, 0]);
  h.engine.grab(1);
  h.engine.drag(1, 300, -300);
  assert.deepEqual(h.latest, [0, 0, 64, -64]);
  h.engine.configure({ form: "rest", strength: 1 }, true);
  for (let i = 0; i < 300; i++) h.frame();
  assert.deepEqual(h.latest, [0, 0, 0, 0]);
});
test("keyboard nudges accumulate across presses instead of replacing the offset", () => {
  const h = harness();
  h.engine.nudge(0, 10, 0);
  h.engine.nudge(0, 10, 0);
  h.engine.nudge(0, 0, -4);
  for (let i = 0; i < 300; i++) h.frame();
  assert.deepEqual(h.latest, [20, -4, 0, 0]);
});
import { ribbonGeometry, anchorInfluence } from "../src/motion/geometry";
test("handle anchors use the same cubic geometry and invert pointer displacement", () => {
  const rest = ribbonGeometry({ x: 0, y: 0 }, { x: 0, y: 0 });
  const next = ribbonGeometry({ x: 30, y: 40 }, { x: -25, y: 20 });
  for (let i = 0; i < 2; i++) {
    const delta = i === 0 ? { x: 30, y: 40 } : { x: -25, y: 20 };
    assert.ok(
      Math.abs(
        (next.anchors[i].x - rest.anchors[i].x) / anchorInfluence(i) - delta.x,
      ) < 1e-8,
    );
    assert.ok(
      Math.abs(
        (next.anchors[i].y - rest.anchors[i].y) / anchorInfluence(i) - delta.y,
      ) < 1e-8,
    );
  }
});

test("Lab response changes release speed without breaking the pointer's direct position", () => {
  const soft = harness(),
    firm = harness();
  soft.engine.configure({ form: "rest", strength: 0.3 });
  firm.engine.configure({ form: "rest", strength: 1.5 });
  for (const h of [soft, firm]) {
    h.engine.grab(0);
    h.engine.drag(0, 40, 20);
    assert.deepEqual(h.latest, [40, 20, 0, 0]);
    h.engine.release(0);
    h.frame();
  }
  assert.ok(soft.latest[0] > firm.latest[0]);
  for (let i = 0; i < 600; i++) {
    soft.frame();
    firm.frame();
  }
  assert.deepEqual(soft.latest, [0, 0, 0, 0]);
  assert.deepEqual(firm.latest, [0, 0, 0, 0]);
});

test("grabbing again during recovery holds the current pose without snapping to the preset", () => {
  const h = harness();
  h.engine.grab(0);
  h.engine.drag(0, 40, 20);
  h.engine.release(0);
  h.frame();
  const before = [...h.latest];
  h.engine.grab(0);
  h.frame();
  assert.deepEqual(h.latest, before);
  h.frame();
  assert.deepEqual(h.latest, before);
  h.engine.release(0);
  for (let i = 0; i < 300; i++) h.frame();
  assert.deepEqual(h.latest, [0, 0, 0, 0]);
});
