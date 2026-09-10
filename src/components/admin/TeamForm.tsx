"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveTeamAction } from "@/app/actions/team";
import { emptyTeam, type TeamInput } from "@/lib/team-validation";
import ImageMediaField from "./ImageMediaField";

type Props = { id?: string; initial?: TeamInput; media: { url: string; fileName: string }[]; projects: { id: string; title: string }[] };
type StringKey = { [K in keyof TeamInput]: TeamInput[K] extends string ? K : never }[keyof TeamInput];
const labels: Partial<Record<StringKey, string>> = { name: "Full name", slug: "URL slug", title: "Primary title", secondaryTitle: "Secondary title", shortBio: "Short biography", biography: "Full biography", linkedinUrl: "LinkedIn", githubUrl: "GitHub", websiteUrl: "Personal website", seoTitle: "SEO title", seoDescription: "SEO description", technology: "Technology & development", vision: "Vision / philosophy" };
const label = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);
export default function TeamForm({ id, initial, media, projects }: Props) {
  const [form, setForm] = useState<TeamInput>(initial || emptyTeam);
  const [mediaOptions, setMediaOptions] = useState(media);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  function update<K extends keyof TeamInput>(key: K, value: TeamInput[K]) { setForm(old => ({ ...old, [key]: value })); }
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const input = { ...form, portfolioProjects: form.portfolioProjects.map(p => ({ ...p, technologies: p.technologies.map(t => t.trim()).filter(Boolean) })) };
      const result = await saveTeamAction(id || null, input);
      if (!result.ok) { setError(result.error); return; }
      router.push(`/admin/team/${result.id}`); router.refresh();
    } catch { setError("The member could not be saved. Please try again."); } finally { setBusy(false); }
  }
  function field(key: StringKey, multiline = false) {
    const props = { value: form[key], required: ["name", "slug", "title"].includes(key), onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (key === "name" && !id && (!form.slug || form.slug === slugify(form.name))) setForm(old => ({ ...old, name: value, slug: slugify(value) }));
      else update(key, value);
    } };
    return <label className="admin-form-field" key={key}><span>{labels[key] || label(key)}</span>{multiline ? <textarea {...props} rows={5} /> : <input {...props} type={key === "email" ? "email" : "text"} />}</label>;
  }
  function imagePicker(value: string, onChange: (value: string) => void, title: string, folder: string, aspectRatio = "4 / 5") {
    return <ImageMediaField label={title} value={value} mediaOptions={mediaOptions} onChange={onChange} onUploaded={asset => setMediaOptions(options => [asset, ...options.filter(option => option.url !== asset.url)])} uploadLabel={`Upload ${title}`} folder={folder} aspectRatio={aspectRatio} />;
  }
  return <form onSubmit={submit} className="admin-news-form">
    <div className="admin-news-form__header"><div><p>Our Team</p><h1>{id ? "Edit team member" : "Add team member"}</h1><p>Profile content and professional links become public when published. Contact details require separate consent below.</p></div><Link href="/admin/team" className="admin-secondary-button">Back to team</Link></div>
    {error && <p role="alert" className="admin-form-error">{error}</p>}
    <fieldset disabled={busy} style={{ border: 0, display: "grid", gap: 24 }}>
      <section className="admin-form-card"><h2>Profile details</h2><div className="admin-form-grid">{(["name", "slug", "title", "secondaryTitle", "company", "department"] as const).map(k => field(k))}{imagePicker(form.photo, v => update("photo", v), "Profile photo", "team-profiles")}<div><Link href="/admin/media" target="_blank">Open Media Library ↗</Link><p><button type="button" className="admin-secondary-button" onClick={() => router.refresh()}>Refresh media choices</button></p></div>{field("shortBio", true)}{field("biography", true)}</div></section>
      <section className="admin-form-card"><h2>Contact & professional links</h2><div className="admin-form-grid">{(["email", "phone", "location", "linkedinUrl", "githubUrl", "websiteUrl"] as const).map(k => field(k))}</div><label className="admin-checkbox-field"><input type="checkbox" checked={form.publicContact} onChange={e => update("publicContact", e.target.checked)} /><span>Display email, phone and location publicly</span></label>
        {form.otherSocialLinks.map((s, i) => <div className="admin-form-grid" key={i}>{(["label", "url"] as const).map(key => <label className="admin-form-field" key={key}><span>Social {key} {i + 1}</span><input value={s[key]} onChange={e => update("otherSocialLinks", form.otherSocialLinks.map((r, j) => j === i ? { ...r, [key]: e.target.value } : r))} /></label>)}<button type="button" onClick={() => update("otherSocialLinks", form.otherSocialLinks.filter((_, j) => j !== i))}>Remove social link {i + 1}</button></div>)}<button type="button" className="admin-secondary-button" onClick={() => update("otherSocialLinks", [...form.otherSocialLinks, { label: "", url: "" }])}>Add social link</button>
      </section>
      {(["skills", "expertise"] as const).map(key => <section className="admin-form-card" key={key}><h2>{label(key)}</h2>{form[key].map((value, i) => <div className="admin-form-grid" key={i}><label className="admin-form-field"><span>{label(key)} {i + 1}</span><input required value={value} onChange={e => update(key, form[key].map((v, j) => j === i ? e.target.value : v))} /></label><button type="button" onClick={() => update(key, form[key].filter((_, j) => j !== i))}>Remove {key} {i + 1}</button></div>)}<button type="button" className="admin-secondary-button" onClick={() => update(key, [...form[key], ""])}>Add {key}</button></section>)}
      {(["leadership", "experience", "education", "achievements"] as const).map(key => <section className="admin-form-card" key={key}><h2>{label(key)}</h2>{form[key].map((row, i) => <fieldset className="admin-form-card" key={i}><legend>{label(key)} {i + 1}</legend><div className="admin-form-grid">{(["title", "organisation", "period", "description"] as const).map(k => <label className="admin-form-field" key={k}><span>{label(key)} {label(k)} {i + 1}</span>{k === "description" ? <textarea value={row[k]} onChange={e => update(key, form[key].map((r, j) => j === i ? { ...r, [k]: e.target.value } : r))} /> : <input required={k === "title"} value={row[k]} onChange={e => update(key, form[key].map((r, j) => j === i ? { ...r, [k]: e.target.value } : r))} />}</label>)}</div><button type="button" onClick={() => update(key, form[key].filter((_, j) => j !== i))}>Remove {key} {i + 1}</button><button type="button" disabled={i === 0} onClick={() => { const rows = [...form[key]]; [rows[i - 1], rows[i]] = [rows[i], rows[i - 1]]; update(key, rows); }}>Move {key} {i + 1} up</button></fieldset>)}<button type="button" className="admin-secondary-button" onClick={() => update(key, [...form[key], { title: "", organisation: "", period: "", description: "" }])}>Add {key}</button></section>)}
      <section className="admin-form-card"><h2>Founder portfolio</h2><div className="admin-form-grid">{field("technology", true)}{field("vision", true)}</div><p>Linked BCU projects use their current published content. Independent entries use the fields below.</p>
        {form.portfolioProjects.map((p, i) => <fieldset className="admin-form-card" key={i}><legend>Portfolio project {i + 1}</legend><div className="admin-form-grid"><label className="admin-form-field"><span>Existing BCU project {i + 1}</span><select value={p.projectId} onChange={e => update("portfolioProjects", form.portfolioProjects.map((r, j) => j === i ? { ...r, projectId: e.target.value } : r))}><option value="">Independent portfolio entry</option>{projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>
          {(["name", "category", "description", "role", "link"] as const).map(key => <label className="admin-form-field" key={key}><span>Project {label(key)} {i + 1}</span><input value={p[key]} onChange={e => update("portfolioProjects", form.portfolioProjects.map((r, j) => j === i ? { ...r, [key]: e.target.value } : r))} /></label>)}
          <label className="admin-form-field"><span>Technologies {i + 1} (comma separated)</span><input value={p.technologies.join(",")} onChange={e => update("portfolioProjects", form.portfolioProjects.map((r, j) => j === i ? { ...r, technologies: e.target.value.split(",") } : r))} /></label>
          {imagePicker(p.image, value => update("portfolioProjects", form.portfolioProjects.map((r, j) => j === i ? { ...r, image: value } : r)), `Project image ${i + 1}`, "team-projects", "16 / 10")}
          <label className="admin-form-field"><span>Project display order {i + 1}</span><input type="number" min={0} max={100000} value={p.displayOrder} onChange={e => update("portfolioProjects", form.portfolioProjects.map((r, j) => j === i ? { ...r, displayOrder: Number(e.target.value) } : r))} /></label></div><button type="button" onClick={() => update("portfolioProjects", form.portfolioProjects.filter((_, j) => j !== i))}>Remove project {i + 1}</button></fieldset>)}
        <button type="button" className="admin-secondary-button" onClick={() => update("portfolioProjects", [...form.portfolioProjects, { projectId: "", name: "", category: "", description: "", role: "", technologies: [], image: "", link: "", displayOrder: form.portfolioProjects.length }])}>Add portfolio project</button>
      </section>
      <section className="admin-form-card"><h2>Publishing & SEO</h2><div className="admin-form-grid"><label className="admin-form-field"><span>Profile type</span><select aria-label="Profile type" value={form.profileType} onChange={e => update("profileType", e.target.value as TeamInput["profileType"])}><option value="STANDARD">Standard</option><option value="FOUNDER_PORTFOLIO">Founder portfolio</option></select></label><label className="admin-form-field"><span>Display order</span><input type="number" min={0} max={100000} value={form.displayOrder} onChange={e => update("displayOrder", Number(e.target.value))} /></label>{field("seoTitle")}{field("seoDescription", true)}</div>{(["featured", "published"] as const).map(key => <label className="admin-checkbox-field" key={key}><input type="checkbox" checked={form[key]} onChange={e => update(key, e.target.checked)} /><span>{label(key)}</span></label>)}</section>
      <button className="admin-primary-button" type="submit">{busy ? "Saving…" : "Save team member"}</button>
    </fieldset>
  </form>;
}
