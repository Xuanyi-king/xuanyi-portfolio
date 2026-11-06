import test from "node:test";
import assert from "node:assert/strict";
import { heroMode } from "../src/motion/hero-policy";
test("late mobile hydration settles artwork without hiding already-painted text", () => {
  const initial = {
    sincePaint: 50,
    scrollY: 0,
    visible: true,
    restored: false,
  };
  assert.equal(heroMode(initial), "entrance");
  for (const sincePaint of [200, 799, 801, 2000, 5000])
    assert.equal(heroMode({ ...initial, sincePaint }), "settle");
  assert.equal(heroMode({ ...initial, visible: false }), "none");
  assert.equal(heroMode({ ...initial, scrollY: 100 }), "none");
  assert.equal(heroMode({ ...initial, restored: true }), "none");
});
