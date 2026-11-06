import test from "node:test";
import assert from "node:assert/strict";
import { readGalleryState, galleryStateKey } from "../src/motion/gallery-state";
test("gallery restoration accepts bounded integer positions and rejects broken storage", () => {
  assert.equal(readGalleryState("102"), 102);
  assert.equal(readGalleryState("-5"), -5);
  for (const v of ["null", "{}", '"5"', "0.5", "1e100", "bad"])
    assert.equal(readGalleryState(v), 0);
});
test("restoration is scoped to route and actual project identities", () => {
  assert.notEqual(
    galleryStateKey("/", ["a", "b"]),
    galleryStateKey("/lab/", ["a", "b"]),
  );
  assert.notEqual(
    galleryStateKey("/", ["a", "b"]),
    galleryStateKey("/", ["b", "a"]),
  );
});
