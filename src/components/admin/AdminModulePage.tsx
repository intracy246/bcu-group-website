import Link from "next/link";

type Props = { eyebrow: string; title: string; description: string; actions?: { label: string; href: string }[] };
export default function AdminModulePage({ eyebrow, title, description, actions = [] }: Props) {
  return <div className="admin-dashboard">
    <section className="admin-dashboard__welcome"><div><p>{eyebrow}</p><h2>{title}</h2><p>{description}</p></div>
      {actions[0] && <Link className="admin-primary-button" href={actions[0].href}>{actions[0].label}</Link>}
    </section>
    <section className="admin-panel"><div className="admin-empty-state"><span>{eyebrow}</span><h3>No records yet</h3><p>Records saved through this module will appear here.</p></div></section>
  </div>;
}
