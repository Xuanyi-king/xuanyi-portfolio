import test from "node:test";
import assert from "node:assert/strict";
import { createCurveOwner } from "../src/motion/curve-owner";

test("CSS owns every path write until both ribbons have finished; early input is replayed once", () => {
  const events: string[] = [];
  const owner = createCurveOwner(true, (v) => events.push(`paint:${v[0]}`));
  owner.paint([0, 0, 0, 0]);
  owner.paint([1, 0, 0, 0]);
  owner.input(() => events.push("old pointer"));
  owner.input(() => events.push("latest pointer"));
  assert.deepEqual(events, []);
  owner.complete();
  assert.deepEqual(events, ["paint:1", "latest pointer"]);
  owner.complete();
  owner.paint([2, 0, 0, 0]);
  assert.deepEqual(events, ["paint:1", "latest pointer", "paint:2"]);
});

test("pointer exit replaces queued input; unmount ignores canceled CSS promises and stale paints", () => {
  const events: string[] = [];
  const owner = createCurveOwner(true, () => events.push("paint"));
  owner.input(() => events.push("pull"));
  owner.input(() => events.push("release"));
  owner.complete();
  assert.deepEqual(events, ["release"]);
  owner.dispose();
  owner.complete();
  owner.paint([0]);
  owner.input(() => events.push("stale"));
  assert.deepEqual(events, ["release"]);
});

test("late hydration, returning visits and static fallbacks hand input straight to the spring", () => {
  let count = 0;
  const owner = createCurveOwner(false, () => count++);
  owner.paint([0]);
  owner.input(() => count++);
  assert.equal(count, 2);
});
