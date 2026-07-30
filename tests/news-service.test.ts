import test from "node:test";
import assert from "node:assert/strict";
import { mapContentStatus } from "../src/lib/content-status";
test("news status mapping preserves publication visibility state", () => {
  assert.equal(mapContentStatus("Published"), "PUBLISHED");
  assert.equal(mapContentStatus("Draft"), "DRAFT");
  assert.equal(mapContentStatus("Archived"), "ARCHIVED");
});
