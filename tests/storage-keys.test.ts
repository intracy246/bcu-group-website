import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { generateSafeStorageKey, resolveStoragePath } from "../src/lib/storage-keys";

test("storage keys are collision safe and retain safe extensions", () => {
  const first = generateSafeStorageKey("News Images", "Cover.Final.PNG", "public");
  const second = generateSafeStorageKey("News Images", "Cover.Final.PNG", "public");
  assert.match(first, /^public\/news-images\/[0-9a-f-]+\.png$/);
  assert.notEqual(first, second);
});

test("private storage keys remain under their visibility prefix", () => {
  assert.match(generateSafeStorageKey("CVs", "resume.pdf", "private"), /^private\/cvs\//);
});

test("storage path resolution rejects traversal and absolute paths", () => {
  const root = path.resolve(".test-storage");
  assert.throws(() => resolveStoragePath(root, "../secret"));
  assert.throws(() => resolveStoragePath(root, "private/../../secret"));
  assert.throws(() => resolveStoragePath(root, "/private/file.pdf"));
  assert.throws(() => resolveStoragePath(root, "other/file.pdf"));
});

test("storage path resolution stays inside the configured root", () => {
  const root = path.resolve(".test-storage");
  const resolved = resolveStoragePath(root, "public/media/file.webp");
  assert.equal(resolved, path.join(root, "public", "media", "file.webp"));
});
