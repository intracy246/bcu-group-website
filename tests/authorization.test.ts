import test from "node:test";
import assert from "node:assert/strict";
import { canManageContent, canManageOperations, canManageUsers, mayDisableSuperAdmin } from "../src/lib/authorization";
test("roles enforce the expected privilege boundaries", () => {
  assert.equal(canManageUsers("SUPER_ADMIN"), true);
  assert.equal(canManageUsers("ADMIN"), false);
  assert.equal(canManageOperations("EDITOR"), false);
  assert.equal(canManageContent("EDITOR"), true);
});
test("the final active super administrator is protected", () => {
  assert.equal(mayDisableSuperAdmin("SUPER_ADMIN", 1), false);
  assert.equal(mayDisableSuperAdmin("SUPER_ADMIN", 2), true);
  assert.equal(mayDisableSuperAdmin("ADMIN", 1), true);
});
