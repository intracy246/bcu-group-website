import { notFound } from "next/navigation";
import TeamForm from "@/components/admin/TeamForm";
import { prisma } from "@/lib/prisma";
import { toTeamInput } from "@/lib/team-mapping";
import { getTeamFormOptions, teamInclude } from "@/lib/team-service";
export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, options] = await Promise.all([prisma.teamMember.findUnique({ where: { id }, include: teamInclude }), getTeamFormOptions()]);
  if (!member) notFound();
  return <TeamForm id={id} initial={toTeamInput(member)} {...options} />;
}
