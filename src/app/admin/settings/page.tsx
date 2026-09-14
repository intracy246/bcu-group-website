import { saveSettingsAction } from "@/app/actions/settings";
import { requireUser } from "@/lib/auth";
import { getPublicSiteSettings } from "@/lib/site-settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  await requireUser(["SUPER_ADMIN"]);
  const settings = await getPublicSiteSettings();
  return <div className="admin-dashboard">
    <section className="admin-page-intro"><div><p>Configuration</p><h2>Site settings</h2><p>Public branding, contact information, navigation and metadata. Secret environment values are never shown here.</p></div></section>
    <SettingsForm action={saveSettingsAction} settings={settings} />
  </div>;
}
