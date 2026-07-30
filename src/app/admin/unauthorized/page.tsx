import Link from "next/link";
export default function UnauthorizedPage() {
  return <div className="admin-empty-state"><span>Access denied</span><h3>Your role cannot access this area.</h3><Link href="/admin">Return to dashboard</Link></div>;
}
