import test from "node:test";
import assert from "node:assert/strict";
import { introPose, playIdentityIntro } from "../src/motion/identity-intro";
test("identity starts and ends at the canonical mark; the ribbons answer at different times", () => {
  assert.deepEqual(introPose(0).values, [0, 0, 0, 0]);
  assert.deepEqual(introPose(20000).values, [0, 0, 0, 0]);
  assert.equal(introPose(20000).done, true);
  const early = introPose(120).values;
  assert.ok(early[0] > 0);
  assert.equal(early[2], 0);
  for (let time = 0; time < 1700; time += 16)
    assert.ok(
      introPose(time).values.every(
        (n) => Number.isFinite(n) && Math.abs(n) <= 36,
      ),
    );
});
test("intro cancellation restores rest once and late scheduled callbacks cannot paint", () => {
  const queued = new Map<number, (time: number) => void>();
  let id = 0,
    finished = 0;
  const output: number[][] = [];
  const intro = playIdentityIntro(
    (v) => output.push([...v]),
    () => finished++,
    {
      request(fn) {
        queued.set(++id, fn);
        return id;
      },
      cancel(key) {
        queued.delete(key);
      },
    },
  );
  const late = [...queued.values()][0];
  intro.cancel(true);
  assert.deepEqual(output, [[0, 0, 0, 0]]);
  assert.equal(finished, 1);
  assert.equal(queued.size, 0);
  late(1000);
  intro.cancel(true);
  assert.equal(output.length, 1);
  assert.equal(finished, 1);
});
test("unmount and returning visits never replay an entrance or leave a frame running", () => {
  let callback: ((t: number) => void) | undefined,
    paints = 0,
    finished = 0,
    canceled = 0;
  const scheduler = {
    request(fn: (t: number) => void) {
      callback = fn;
      return 1;
    },
    cancel() {
      canceled++;
    },
  };
  const intro = playIdentityIntro(
    () => paints++,
    () => finished++,
    scheduler,
  );
  intro.cancel(false);
  callback!(20);
  assert.equal(paints, 0);
  assert.equal(finished, 0);
  assert.equal(canceled, 1);
  playIdentityIntro(
    () => paints++,
    () => finished++,
    scheduler,
    () => false,
  );
  callback!(50);
  assert.equal(paints, 1);
  assert.equal(finished, 1);
});
