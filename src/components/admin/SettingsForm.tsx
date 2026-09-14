"use client";

import { useState } from "react";

type NavigationItem = { label: string; href: string; visible: boolean };
type SettingsFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  settings: {
    siteName: string; siteDescription: string; publicWebsiteUrl: string; mainEmail: string; mainPhone: string; officeAddress: string;
    defaultSeoTitle: string; defaultSeoDescription: string; defaultOpenGraphImage: string; organisationName: string; organisationLogo: string; maintenanceMode: boolean;
    header: { logo: string; siteLabel: string; contactLabel: string; contactUrl: string; navigation: NavigationItem[] };
    footer: { description: string; copyright: string }; socialLinks: Record<string, string>;
  };
};

export default function SettingsForm({ action, settings }: SettingsFormProps) {
  const [navigation, setNavigation] = useState(settings.header.navigation);
  const [socialLinks, setSocialLinks] = useState(Object.entries(settings.socialLinks));
  const [footer, setFooter] = useState(settings.footer);
  const [header, setHeader] = useState(settings.header);
  const updateNavigation = (index: number, key: keyof NavigationItem, value: string | boolean) => setNavigation((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const moveNavigation = (index: number, offset: number) => setNavigation((items) => { const target = index + offset; if (target < 0 || target >= items.length) return items; const copy = [...items]; [copy[index], copy[target]] = [copy[target], copy[index]]; return copy; });

  return <form action={action} className="admin-settings-form">
    <input type="hidden" name="header" value={JSON.stringify({ ...header, navigation })} />
    <input type="hidden" name="footer" value={JSON.stringify(footer)} />
    <input type="hidden" name="socialLinks" value={JSON.stringify(Object.fromEntries(socialLinks.filter(([platform]) => platform.trim())))} />
    <section className="admin-form-card"><h3>General</h3><div className="admin-form-grid">
      <label className="admin-form-field"><span>Site name</span><input name="siteName" defaultValue={settings.siteName} required /></label><label className="admin-form-field"><span>Organisation name</span><input name="organisationName" defaultValue={settings.organisationName} /></label>
      <label className="admin-form-field"><span>Public website URL</span><input name="publicWebsiteUrl" type="url" defaultValue={settings.publicWebsiteUrl} required /></label><label className="admin-form-field"><span>Main email</span><input name="mainEmail" type="email" defaultValue={settings.mainEmail} /></label>
      <label className="admin-form-field"><span>Main phone</span><input name="mainPhone" defaultValue={settings.mainPhone} /></label><label className="admin-form-field"><span>Office address</span><input name="officeAddress" defaultValue={settings.officeAddress} /></label>
      <label className="admin-form-field admin-form-field--full"><span>Site description</span><textarea name="siteDescription" defaultValue={settings.siteDescription} rows={3} /></label>
    </div></section>
    <section className="admin-form-card"><h3>Branding and SEO</h3><div className="admin-form-grid">
      <label className="admin-form-field"><span>Organisation logo URL</span><input name="organisationLogo" defaultValue={settings.organisationLogo} /></label><label className="admin-form-field"><span>Open Graph image URL</span><input name="defaultOpenGraphImage" defaultValue={settings.defaultOpenGraphImage} /></label>
      <label className="admin-form-field"><span>Default SEO title</span><input name="defaultSeoTitle" defaultValue={settings.defaultSeoTitle} /></label><label className="admin-form-field admin-form-field--full"><span>Default SEO description</span><textarea name="defaultSeoDescription" defaultValue={settings.defaultSeoDescription} rows={3} /></label>
    </div></section>
    <section className="admin-form-card"><h3>Header</h3><div className="admin-form-grid">
      <label className="admin-form-field"><span>Site label</span><input value={header.siteLabel} onChange={(event) => setHeader((current) => ({ ...current, siteLabel: event.target.value }))} /></label><label className="admin-form-field"><span>Contact label</span><input value={header.contactLabel} onChange={(event) => setHeader((current) => ({ ...current, contactLabel: event.target.value }))} /></label><label className="admin-form-field"><span>Contact URL</span><input value={header.contactUrl} onChange={(event) => setHeader((current) => ({ ...current, contactUrl: event.target.value }))} /></label><label className="admin-form-field"><span>Header logo URL</span><input value={header.logo} onChange={(event) => setHeader((current) => ({ ...current, logo: event.target.value }))} /></label>
    </div><div className="admin-repeatable-list"><h4>Navigation items</h4>{navigation.map((item, index) => <div className="admin-repeatable-row" key={`${item.label}-${index}`}><label><span>Label</span><input value={item.label} onChange={(event) => updateNavigation(index, "label", event.target.value)} /></label><label><span>URL</span><input value={item.href} onChange={(event) => updateNavigation(index, "href", event.target.value)} /></label><label className="admin-toggle"><input type="checkbox" checked={item.visible} onChange={(event) => updateNavigation(index, "visible", event.target.checked)} /><span>Visible</span></label><div className="admin-inline-actions"><button type="button" onClick={() => moveNavigation(index, -1)} aria-label="Move navigation item up">Up</button><button type="button" onClick={() => moveNavigation(index, 1)} aria-label="Move navigation item down">Down</button><button type="button" className="admin-danger-button" onClick={() => setNavigation((items) => items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div></div>)}<button type="button" className="admin-secondary-button" onClick={() => setNavigation((items) => [...items, { label: "", href: "/", visible: true }])}>Add navigation item</button></div></section>
    <section className="admin-form-card"><h3>Footer and social links</h3><div className="admin-form-grid"><label className="admin-form-field admin-form-field--full"><span>Footer description</span><textarea value={footer.description} rows={3} onChange={(event) => setFooter((current) => ({ ...current, description: event.target.value }))} /></label><label className="admin-form-field admin-form-field--full"><span>Copyright</span><input value={footer.copyright} onChange={(event) => setFooter((current) => ({ ...current, copyright: event.target.value }))} /></label></div><div className="admin-repeatable-list"><h4>Social links</h4>{socialLinks.map(([platform, url], index) => <div className="admin-repeatable-row" key={`${platform}-${index}`}><label><span>Platform</span><input value={platform} onChange={(event) => setSocialLinks((links) => links.map((link, linkIndex) => linkIndex === index ? [event.target.value, link[1]] : link))} /></label><label><span>URL</span><input type="url" value={url} onChange={(event) => setSocialLinks((links) => links.map((link, linkIndex) => linkIndex === index ? [link[0], event.target.value] : link))} /></label><button type="button" className="admin-danger-button" onClick={() => setSocialLinks((links) => links.filter((_, linkIndex) => linkIndex !== index))}>Remove</button></div>)}<button type="button" className="admin-secondary-button" onClick={() => setSocialLinks((links) => [...links, ["", ""]])}>Add social link</button></div></section>
    <section className="admin-form-card"><label className="admin-toggle"><input name="maintenanceMode" type="checkbox" defaultChecked={settings.maintenanceMode} /><span>Maintenance mode</span></label><button className="admin-primary-button">Save settings</button></section>
  </form>;
}