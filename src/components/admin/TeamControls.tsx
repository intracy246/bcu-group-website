"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeTeamAction } from "@/app/actions/team";
export default function TeamControls({ id, published, displayOrder }: { id: string; published: boolean; displayOrder: number }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [order, setOrder] = useState(displayOrder);
  async function change(input: unknown, deleted = false) {
    setBusy(true); setError("");
    try { const result = await changeTeamAction(id, input); if (!result.ok) setError(result.error); else { if (deleted) router.push("/admin/team"); router.refresh(); } } catch { setError("Unable to update member. Please try again."); } finally { setBusy(false); }
  }
  return <div className="admin-team-row__controls"><fieldset disabled={busy}><label className="admin-order-field"><span>Display order</span><input aria-label="Display order" type="number" min={0} max={100000} value={order} onChange={e => setOrder(Number(e.target.value))} /></label><button type="button" className="admin-secondary-button" onClick={() => change({ action: "order", displayOrder: order })}>Save Order</button></fieldset><div className="admin-management-row__actions"><a href={`/admin/team/${id}`}>View</a><a href={`/admin/team/${id}/edit`}>Edit</a><button type="button" className="admin-secondary-button" onClick={() => change({ action: "publish", published: !published })}>{published ? "Unpublish" : "Publish"}</button><button type="button" className="admin-danger-button" onClick={() => { if (window.confirm("Delete this team member permanently?")) void change({ action: "delete" }, true); }}>Delete</button></div>{error && <p role="alert" className="admin-form-error">{error}</p>}</div>;
}
