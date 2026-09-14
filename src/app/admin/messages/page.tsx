import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const query = await searchParams; const page = Math.max(1, Number(query.page) || 1); const take = 20;
  const status = ["NEW", "READ", "IN_PROGRESS", "RESOLVED", "ARCHIVED"].includes(query.status ?? "") ? query.status as "NEW"|"READ"|"IN_PROGRESS"|"RESOLVED"|"ARCHIVED" : undefined;
  const where = { ...(status ? { status } : {}), ...(query.q ? { OR: [{ name: { contains: query.q, mode: "insensitive" as const } }, { email: { contains: query.q, mode: "insensitive" as const } }, { subject: { contains: query.q, mode: "insensitive" as const } }] } : {}) };
  const [messages, total] = await Promise.all([prisma.contactMessage.findMany({ where, take, skip: (page - 1) * take, orderBy: { createdAt: "desc" } }), prisma.contactMessage.count({ where })]);
  return <div className="admin-dashboard"><section className="admin-page-intro"><div><p>Inbox</p><h2>Contact messages</h2><p>Review, assign and resolve public enquiries.</p></div><Link className="admin-secondary-button" href="/api/admin/messages/export">Export CSV</Link></section>
    <section className="admin-data-panel"><form className="admin-data-panel__toolbar"><label className="admin-search-field"><span>Search</span><input name="q" defaultValue={query.q}/></label><label className="admin-select-field"><span>Status</span><select name="status" defaultValue={query.status}><option value="">All</option>{["NEW","READ","IN_PROGRESS","RESOLVED","ARCHIVED"].map(item=><option key={item}>{item}</option>)}</select></label><button className="admin-primary-button">Filter</button></form>
      <div className="admin-inbox-list">{messages.map(message=><Link key={message.id} className="admin-inbox-row" href={`/admin/messages/${message.id}`}><div><strong>{message.subject}</strong><p>{message.name} · {message.email}</p></div><span className={`admin-status-badge admin-status-badge--${message.status.toLowerCase()}`}><i/>{message.status.replace("_"," ")}</span><time>{message.createdAt.toLocaleDateString()}</time></Link>)}</div>
      {!messages.length && <div className="admin-empty-state"><span>No messages</span><h3>No enquiries match these filters.</h3></div>}
      <div className="admin-table-footer"><p>Showing {messages.length} of {total}</p><div>{page > 1 && <Link href={`?page=${page-1}`}>Previous</Link>} {page*take < total && <Link href={`?page=${page+1}`}>Next</Link>}</div></div>
    </section></div>;
}
