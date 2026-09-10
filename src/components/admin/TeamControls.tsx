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
  return <div><fieldset disabled={busy} style={{ border: 0, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}><button className="admin-secondary-button" onClick={() => change({ action: "publish", published: !published })}>{published ? "Unpublish" : "Publish"}</button><label>Display order <input aria-label="Display order" type="number" min={0} max={100000} value={order} onChange={e => setOrder(Number(e.target.value))} style={{ width: 85, background: "#171717", color: "white", padding: 8 }} /></label><button className="admin-secondary-button" onClick={() => change({ action: "order", displayOrder: order })}>Save order</button><button className="admin-secondary-button" onClick={() => { if (window.confirm("Delete this team member permanently?")) void change({ action: "delete" }, true); }}>Delete</button></fieldset>{error && <p role="alert">{error}</p>}</div>;
}
