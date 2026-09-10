import TeamForm from "@/components/admin/TeamForm";
import { getTeamFormOptions } from "@/lib/team-service";
export default async function NewTeamPage() { return <TeamForm {...await getTeamFormOptions()} />; }
