import { savePageSectionAction } from "@/app/actions/content";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      {page.sections.length === 0 ? <p>No sections have been seeded.</p> : page.sections.map((section) =>
        <form action={savePageSectionAction} className="admin-form-card" key={section.id}>
          <input type="hidden" name="id" value={section.id} />
          <div className="admin-form-grid">
            <label>Section key<input name="key" defaultValue={section.key} required /></label>
            <label>Section type<input name="type" defaultValue={section.type} required /></label>
            <label>Order<input name="sortOrder" type="number" min="0" defaultValue={section.sortOrder} /></label>
            <label><input name="visible" type="checkbox" defaultChecked={section.visible} /> Visible</label>
          </div>
          <label>Structured JSON<textarea name="content" rows={12} defaultValue={JSON.stringify(section.content, null, 2)} required /></label>
          <button className="admin-primary-button">Save section</button>
        </form>)}
    </section>)}
  </div>;
}
