import test from "node:test";
import assert from "node:assert/strict";
import { heroMode } from "../src/motion/hero-policy";
test("CSS supplies the entrance; delayed JS only enhances a readable hero", () => {
  const initial = {
    sincePaint: 50,
    scrollY: 0,
    visible: true,
    restored: false,
  };
  for (const sincePaint of [0, 50, 200, 801, 5000])
    assert.equal(heroMode({ ...initial, sincePaint }), "enhance");
  assert.equal(heroMode({ ...initial, visible: false }), "none");
  assert.equal(heroMode({ ...initial, scrollY: 100 }), "none");
  assert.equal(heroMode({ ...initial, restored: true }), "none");
});
