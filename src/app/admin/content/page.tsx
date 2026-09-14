import { savePageSectionAction } from "@/app/actions/content";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageSectionEditor from "@/components/admin/PageSectionEditor";

export default async function WebsiteContentPage() {
  await requireUser(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const pages = await prisma.sitePage.findMany({
    where: { key: { in: ["home", "about", "impact", "contact", "header", "footer"] } },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
    orderBy: { title: "asc" },
  });
  return <div className="admin-dashboard">
    <section className="admin-page-intro"><div><p>Website</p><h2>Website content</h2><p>Edit validated structured page sections, visibility and display order.</p></div></section>
    {pages.map((page) => <section className="admin-data-panel" key={page.id}>
      <h3>{page.title}</h3>
      {page.sections.length === 0 ? <div className="admin-empty-state"><span>No sections</span><h3>No sections have been seeded.</h3></div> : page.sections.map((section) => <PageSectionEditor action={savePageSectionAction} key={section.id} section={{ ...section, content: section.content as never }} />)}
    </section>)}
  </div>;
}
