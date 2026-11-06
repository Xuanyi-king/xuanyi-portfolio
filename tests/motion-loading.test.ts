import test from "node:test";
import assert from "node:assert/strict";
import { watchMotionPreference } from "../src/motion/preference";
function preference(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  return {
    get matches() {
      return matches;
    },
    addEventListener: (_name: string, fn: () => void) => {
      listeners.add(fn);
    },
    removeEventListener: (_name: string, fn: () => void) => {
      listeners.delete(fn);
    },
    set(value: boolean) {
      matches = value;
      listeners.forEach((fn) => fn());
    },
    get count() {
      return listeners.size;
    },
  };
}
test("reduced motion does not load animation modules and toggling reverts active animation", async () => {
  const media = preference(false);
  let loaded = 0,
    started = 0,
    reverted = 0;
  const stop = watchMotionPreference(
    media as unknown as MediaQueryList,
    async () => {
      loaded++;
      return () => {
        started++;
        return () => {
          reverted++;
        };
      };
    },
  );
  assert.equal(loaded, 0);
  media.set(true);
  await Promise.resolve();
  assert.equal(started, 1);
  media.set(false);
  assert.equal(reverted, 1);
  media.set(true);
  await Promise.resolve();
  assert.equal(started, 2);
  stop();
  assert.equal(reverted, 2);
  assert.equal(media.count, 0);
});
test("navigation/unmount and rapid preference switches discard pending module loads", async () => {
  const media = preference(true);
  let started = 0;
  const pending: Array<(setup: () => () => void) => void> = [];
  const stop = watchMotionPreference(
    media as unknown as MediaQueryList,
    () => new Promise((resolve) => pending.push(resolve)),
  );
  media.set(false);
  media.set(true);
  pending[0](() => {
    started++;
    return () => {};
  });
  await Promise.resolve();
  assert.equal(started, 0);
  stop();
  pending[1](() => {
    started++;
    return () => {};
  });
  await Promise.resolve();
  assert.equal(started, 0);
  assert.equal(media.count, 0);
});
