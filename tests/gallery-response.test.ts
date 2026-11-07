import test from "node:test";
import assert from "node:assert/strict";
import { createGalleryResponse } from "../src/motion/gallery-response";

test("gallery response follows continuous travel, not wrapped project indices", () => {
  const response = createGalleryResponse();
  const values: number[] = [];
  response.subscribe((force) => values.push(force));
  response.sample(2.98, 100);
  response.sample(3.03, 116);
  assert.ok(values.at(-1)! < 0);
  response.sample(2.98, 132);
  assert.ok(values.at(-1)! > 0);
  assert.ok(values.every((n) => Math.abs(n) <= 28));
});
test("fast inputs are bounded and invalid or stale samples cannot produce a spike", () => {
  const response = createGalleryResponse();
  const values: number[] = [];
  response.subscribe((force) => values.push(force));
  response.sample(0, 0);
  response.sample(100, 1);
  assert.equal(values.at(-1), -28);
  response.sample(Infinity, 20);
  response.sample(-100, 3000);
  assert.equal(values.at(-1), 0);
  assert.ok(values.every(Number.isFinite));
});
test("settling restores rest and subscribers can leave and remount without duplicate updates", () => {
  const response = createGalleryResponse();
  let writes = 0,
    force = 0;
  const off = response.subscribe((v) => {
    writes++;
    force = v;
  });
  response.sample(0, 100);
  response.sample(1, 116);
  assert.notEqual(force, 0);
  response.reset();
  assert.equal(force, 0);
  off();
  const count = writes;
  response.sample(5, 132);
  assert.equal(writes, count);
  response.reset();
  const off2 = response.subscribe((v) => {
    writes++;
    force = v;
  });
  assert.equal(force, 0);
  const before = writes;
  response.sample(5, 200);
  response.sample(5.1, 216);
  assert.equal(writes, before + 1);
  off2();
});
