import test from "node:test";
import assert from "node:assert/strict";
import { safeParagraphArray, safeStringArray, toISOStringOrNull } from "../src/lib/json-safety";

test("missing and malformed project arrays map to safe empty arrays", () => {
  assert.deepEqual(safeStringArray(undefined), []);
  assert.deepEqual(safeStringArray({ tags: ["bad shape"] }), []);
  assert.deepEqual(safeParagraphArray({ invalid: true }), []);
});
test("valid string and paragraph arrays are preserved without non-string entries", () => {
  assert.deepEqual(safeStringArray(["one", 2, "three"]), ["one", "three"]);
  assert.deepEqual(safeParagraphArray({ paragraphs: ["first", null, "second"] }), ["first", "second"]);
});
test("dates serialize safely", () => {
  assert.equal(toISOStringOrNull(null), null);
  assert.equal(toISOStringOrNull(new Date("2026-07-30T00:00:00.000Z")), "2026-07-30T00:00:00.000Z");
});
