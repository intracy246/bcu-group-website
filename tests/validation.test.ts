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
test("career applications accept opaque production career IDs", () => {
  const base = {
    applicantName: "Jane Doe",
    email: "jane@example.com",
    coverLetter: "I am applying for this role because my experience closely matches the stated requirements.",
    cvUrl: "https://example.com/jane-doe.pdf",
  };
  assert.equal(applicationSchema.safeParse({ ...base, careerId: "legacy-career-id-001" }).success, true);
  assert.equal(applicationSchema.safeParse({ ...base, careerId: "550e8400-e29b-41d4-a716-446655440000" }).success, true);
  assert.equal(applicationSchema.safeParse({ ...base, careerId: "" }).success, false);
});
test("career applications require a valid CV URL and cover letter", () => {
  assert.equal(applicationSchema.safeParse({ careerId: "career-1", applicantName: "Jane Doe", email: "jane@example.com", coverLetter: "short", cvUrl: "file" }).success, false);
});
