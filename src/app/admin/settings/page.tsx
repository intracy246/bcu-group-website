import { saveSettingsAction } from "@/app/actions/settings";
import { requireUser } from "@/lib/auth";
import { getPublicSiteSettings } from "@/lib/site-settings";

export default async function SettingsPage() {
  await requireUser(["SUPER_ADMIN"]);
  const settings = await getPublicSiteSettings();
  return <div className="admin-dashboard">
    <section className="admin-page-intro"><div><p>Configuration</p><h2>Site settings</h2><p>Public branding, contact information, navigation and metadata. Secret environment values are never shown here.</p></div></section>
    <form action={saveSettingsAction} className="admin-form-card">
      <div className="admin-form-grid">
        <label>Site name<input name="siteName" defaultValue={settings.siteName} required /></label>
        <label>Public website URL<input name="publicWebsiteUrl" type="url" defaultValue={settings.publicWebsiteUrl} required /></label>
        <label>Main email<input name="mainEmail" type="email" defaultValue={settings.mainEmail} /></label>
        <label>Main phone<input name="mainPhone" defaultValue={settings.mainPhone} /></label>
        <label>Office address<input name="officeAddress" defaultValue={settings.officeAddress} /></label>
        <label>Organisation name<input name="organisationName" defaultValue={settings.organisationName} /></label>
        <label>Organisation logo<input name="organisationLogo" defaultValue={settings.organisationLogo} /></label>
        <label>Open Graph image<input name="defaultOpenGraphImage" defaultValue={settings.defaultOpenGraphImage} /></label>
      </div>
      <label>Site description<textarea name="siteDescription" defaultValue={settings.siteDescription} /></label>
      <label>Default SEO title<input name="defaultSeoTitle" defaultValue={settings.defaultSeoTitle} /></label>
      <label>Default SEO description<textarea name="defaultSeoDescription" defaultValue={settings.defaultSeoDescription} /></label>
      <label>Header JSON<textarea name="header" rows={10} defaultValue={JSON.stringify(settings.header, null, 2)} /></label>
      <label>Footer JSON<textarea name="footer" rows={7} defaultValue={JSON.stringify(settings.footer, null, 2)} /></label>
      <label>Social links JSON<textarea name="socialLinks" rows={5} defaultValue={JSON.stringify(settings.socialLinks, null, 2)} /></label>
      <label><input name="maintenanceMode" type="checkbox" defaultChecked={settings.maintenanceMode} /> Maintenance mode</label>
      <button className="admin-primary-button">Save settings</button>
    </form>
  </div>;
}
