import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { teamInclude } from "@/lib/team-service";
import { toPublicTeam } from "@/lib/team-mapping";
import TeamControls from "@/components/admin/TeamControls";
import TeamProfile from "@/components/team/TeamProfile";
export default async function ViewTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id }, include: teamInclude });
  if (!member) notFound();
  return <><section className="admin-form-card"><p>Team member preview · {member.published ? "Published" : "Hidden"}</p><h1>{member.name}</h1><p><Link href="/admin/team">Back to team</Link> · <Link href={`/admin/team/${id}/edit`}>Edit team member</Link>{member.published && <> · <Link href={`/team/${member.slug}`} target="_blank">Open public profile</Link></>}</p><TeamControls id={id} published={member.published} displayOrder={member.displayOrder} /></section><TeamProfile member={toPublicTeam(member)} /></>;
}
