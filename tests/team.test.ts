import test from "node:test";
import assert from "node:assert/strict";
import { emptyTeam, teamInputSchema, teamUrlSchema, readTeamRows, teamTimelineSchema } from "../src/lib/team-validation";
import { toPublicTeam, toTeamInput, personJsonLd, type TeamRecord } from "../src/lib/team-mapping";
const valid = { ...emptyTeam, name: "Test Leader", slug: "test-leader", title: "Director" };
test("team validation accepts both profile types and rejects invalid names, slugs, orders and unsafe URLs", () => {
  for (const profileType of ["STANDARD", "FOUNDER_PORTFOLIO"]) assert.equal(teamInputSchema.safeParse({ ...valid, profileType }).success, true);
  for (const patch of [{ name: "" }, { slug: "---" }, { slug: "Bad Slug" }, { displayOrder: -1 }, { displayOrder: 0.5 }, { published: "true" }, { profileType: "OTHER" }, { email: "invalid" }, { phone: "<script>" }]) assert.equal(teamInputSchema.safeParse({ ...valid, ...patch }).success, false);
  for (const url of ["javascript:alert(1)", "data:text/html,test", "file:///secret", "//evil.example", "https://user:password@example.com"]) assert.equal(teamUrlSchema.safeParse(url).success, false);
  assert.equal(teamUrlSchema.safeParse("https://example.com/work").success, true);
});
test("nested portfolio and timeline inputs are validated without raw JSON", () => {
  assert.equal(teamInputSchema.safeParse({ ...valid, experience: [{ title: "Engineer", organisation: "BCU", period: "2020–2026", description: "Delivery" }] }).success, true);
  assert.equal(teamInputSchema.safeParse({ ...valid, skills: [""] }).success, false);
  assert.equal(teamInputSchema.safeParse({ ...valid, portfolioProjects: [{ projectId: "", name: "", category: "", description: "", role: "", technologies: [], image: "", link: "", displayOrder: 0 }] }).success, false);
  assert.deepEqual(readTeamRows(teamTimelineSchema, [null, { title: "Incomplete" }]), []);
  assert.deepEqual(readTeamRows(teamTimelineSchema, {}), []);
});
function record(): TeamRecord {
  return { ...valid, id: "internal-team-id", email: "private@example.com", phone: "+255123456", location: "Private office", createdAt: new Date(), updatedAt: new Date(), portfolioProjects: [] };
}
test("public mapping strips internal identifiers and unapproved contact details", () => {
  const row = record(); const publicMember = toPublicTeam(row);
  assert.equal(publicMember.email, ""); assert.equal(publicMember.phone, ""); assert.equal(publicMember.location, "");
  assert.equal("id" in publicMember, false); assert.equal("publicContact" in publicMember, false);
  assert.equal(toTeamInput(row).email, "private@example.com");
  assert.equal(toPublicTeam({ ...row, publicContact: true }).email, "private@example.com");
});
test("linked BCU projects use live published content and suppress draft records", () => {
  const row = record();
  const project = {
    id: "internal-project", title: "Live project", slug: "bcu-project", companyId: "company-id", summary: "Live summary", description: "Live description", category: "Technology", status: "PUBLISHED" as const,
    featured: false, coverImageUrl: "", coverImageAlt: "", location: "", startDate: null, completionDate: null, tags: ["AI"], sortOrder: 0, seoTitle: "", seoDescription: "", createdAt: new Date(), updatedAt: new Date(),
    company: { id: "company-id", name: "BCU", slug: "bcu", shortName: "BCU", summary: "BCU summary", description: "BCU description", logoUrl: "", coverImageUrl: "", websiteUrl: "", email: "", phone: "", location: "", industry: "Technology", status: "ACTIVE" as const, featured: false, sortOrder: 0, seoTitle: "", seoDescription: "", createdAt: new Date(), updatedAt: new Date() },
  };
  row.portfolioProjects = [{ id: "portfolio-id", teamMemberId: row.id, projectId: project.id, project, name: "Old title", description: "Old summary", category: "", role: "Lead", technologies: [], image: "", link: "", displayOrder: 0 }] as TeamRecord["portfolioProjects"];
  const mapped = toPublicTeam(row).portfolioProjects[0]; assert.equal(mapped.name, "Live project"); assert.equal(mapped.link, "/companies/bcu/projects/project"); assert.deepEqual(mapped.technologies, ["AI"]); assert.equal("projectId" in mapped, false);
  row.portfolioProjects[0].project!.status = "DRAFT";
  assert.deepEqual(toPublicTeam(row).portfolioProjects, []);
});
test("Person structured data escapes HTML and excludes private contact fields", () => {
  const member = toPublicTeam({ ...record(), name: "</script><script>alert(1)</script>" });
  const json = personJsonLd(member, "https://bcu.example");
  assert.equal(json.includes("</script>"), false); assert.equal(json.includes("private@example.com"), false);
  assert.equal(JSON.parse(json)["@type"], "Person");
});
