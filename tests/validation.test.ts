import test from "node:test";
import assert from "node:assert/strict";
import { applicationSchema, contactMessageSchema, slugSchema } from "../src/lib/validation";

test("slug normalization is deterministic", () => {
  assert.equal(slugSchema.parse("  BCU Group: Africa's Future! "), "bcu-group-africa-s-future");
});
test("contact messages reject invalid email and short messages", () => {
  assert.equal(contactMessageSchema.safeParse({ name: "A", email: "bad", subject: "x", message: "short" }).success, false);
});
test("contact honeypot accepts only an empty value", () => {
  const base = { name: "Jane Doe", email: "jane@example.com", subject: "Partnership", message: "A sufficiently detailed enquiry." };
  assert.equal(contactMessageSchema.safeParse({ ...base, website: "" }).success, true);
  assert.equal(contactMessageSchema.safeParse({ ...base, website: "spam" }).success, false);
});
test("career applications require a valid CV URL and cover letter", () => {
  assert.equal(applicationSchema.safeParse({ careerId: "bad", applicantName: "Jane Doe", email: "jane@example.com", coverLetter: "short", cvUrl: "file" }).success, false);
});
