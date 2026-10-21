"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveCompanyAction, type CompanyInput } from "@/app/actions/companies";
import type { CompanyDTO } from "@/lib/company-service";

type ImageField = "logoUrl" | "coverImageUrl";

const makeSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function CompanyForm({ company }: { company?: CompanyDTO }) {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<ImageField | null>(null);
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [form, setForm] = useState<CompanyInput>({
    name: company?.name ?? "",
    slug: company?.slug ?? "",
    shortName: company?.shortName ?? "",
    summary: company?.summary ?? "",
    description: company?.description ?? "",
    logoUrl: company?.logoUrl ?? "",
    coverImageUrl: company?.coverImageUrl ?? "",
    websiteUrl: company?.websiteUrl ?? "",
    email: company?.email ?? "",
    phone: company?.phone ?? "",
    location: company?.location ?? "",
    industry: company?.industry ?? "",
    status: company?.status ?? "Draft",
    featured: company?.featured ?? false,
    sortOrder: company?.sortOrder ?? 0,
    seoTitle: company?.seoTitle ?? "",
    seoDescription: company?.seoDescription ?? "",
  });

  const set = <K extends keyof CompanyInput>(key: K, value: CompanyInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function uploadImage(field: ImageField, file?: File) {
    if (!file) return;
    setError("");
    setUploadMessage("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Chagua picha ya JPG, PNG au WEBP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Picha imezidi 10 MB. Chagua picha ndogo zaidi.");
      return;
    }

    setUploading(field);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", field === "logoUrl" ? "company-logos" : "company-covers");
      body.append("altText", field === "logoUrl" ? `${form.name || "Company"} logo` : `${form.name || "Company"} cover image`);
      body.append("imageOnly", "true");

      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = (await response.json()) as {
        error?: string;
        asset?: { url?: string };
      };

      if (!response.ok || !result.asset?.url) {
        throw new Error(result.error || "Upload haikufanikiwa. Jaribu tena.");
      }

      set(field, result.asset.url);
      setUploadMessage(field === "logoUrl" ? "Logo imepakiwa. Hifadhi Company ili ionekane kwenye website." : "Cover image imepakiwa. Hifadhi Company ili mabadiliko yahifadhiwe.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Imeshindikana kupakia picha.");
    } finally {
      setUploading(null);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setUploadMessage("");
    try {
      const result = await saveCompanyAction(company?.id ?? null, form);
      if (!result.ok) {
        setError(result.error);
        setBusy(false);
        return;
      }
      router.push(`/admin/companies/${result.id}`);
      router.refresh();
    } catch {
      setError("Company haijahifadhiwa. Kagua muunganisho kisha ujaribu tena.");
      setBusy(false);
    }
  }

  return (
    <form className="admin-news-form admin-company-edit-form" onSubmit={submit}>
      <div className="admin-news-form__header admin-company-edit-form__header">
        <div>
          <p>Company Management</p>
          <h2>{company ? `Edit ${company.name}` : "Add Company"}</h2>
          <span>Simamia taarifa, nembo na picha za kampuni katika BCU Group.</span>
        </div>
        <div className="admin-news-form__header-actions">
          <Link className="admin-secondary-button" href="/admin/companies">Cancel</Link>
          <button type="submit" disabled={busy || uploading !== null} className="admin-primary-button">
            {busy ? "Saving…" : "Save Company"}
          </button>
        </div>
      </div>

      {error && <div className="admin-form-error" role="alert">{error}</div>}
      {uploadMessage && <div className="admin-company-upload-success" role="status">{uploadMessage}</div>}

      <section className="admin-form-card admin-company-edit-form__section">
        <div className="admin-company-edit-form__section-heading">
          <span>01</span>
          <div><h3>Company identity</h3><p>Jina, URL ya kampuni na taarifa za msingi.</p></div>
        </div>
        <div className="admin-form-grid">
          {([
            ["name", "Company name"],
            ["slug", "Slug"],
            ["shortName", "Short name"],
            ["industry", "Industry"],
            ["location", "Location"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["websiteUrl", "Website URL"],
          ] as const).map(([key, label]) => (
            <label className="admin-form-field" key={key}>
              <span>{label}</span>
              <input
                type={key === "email" ? "email" : key === "websiteUrl" ? "url" : "text"}
                value={String(form[key])}
                onChange={(event) => set(key, key === "slug" ? makeSlug(event.target.value) : event.target.value)}
                required={["name", "slug", "shortName"].includes(key)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="admin-form-card admin-company-edit-form__section">
        <div className="admin-company-edit-form__section-heading">
          <span>02</span>
          <div><h3>Brand images</h3><p>Pakia picha kutoka kwenye kompyuta. Logo iliyohifadhiwa ndiyo itakayoonekana kwenye company card.</p></div>
        </div>
        <div className="admin-company-image-grid">
          <div className="admin-company-image-field">
            <div className="admin-company-image-field__heading">
              <div><h4>Company logo</h4><p>PNG inapendekezwa kwa logo yenye background transparent.</p></div>
              <span className="admin-company-image-field__badge">Public logo</span>
            </div>
            <div className="admin-company-image-preview admin-company-image-preview--logo">
              {form.logoUrl ? (
                <Image unoptimized src={form.logoUrl} alt={`${form.name || "Company"} logo preview`} width={600} height={360} />
              ) : <div className="admin-company-image-preview__empty"><span>LOGO</span><p>Hakuna logo iliyochaguliwa</p></div>}
            </div>
            <label className="admin-form-field">
              <span>Logo URL</span>
              <input type="url" value={form.logoUrl} onChange={(event) => set("logoUrl", event.target.value)} placeholder="Pakia picha au weka URL ya picha" />
            </label>
            <input ref={logoInputRef} className="admin-company-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { void uploadImage("logoUrl", event.target.files?.[0]); event.currentTarget.value = ""; }} />
            <button type="button" className="admin-company-upload-button" disabled={uploading !== null} onClick={() => logoInputRef.current?.click()}>
              {uploading === "logoUrl" ? "Inapakia logo…" : "↑ Upload company logo"}
            </button>
          </div>

          <div className="admin-company-image-field">
            <div className="admin-company-image-field__heading">
              <div><h4>Cover image</h4><p>Picha pana ya utambulisho wa kampuni, ikiwa inahitajika.</p></div>
              <span className="admin-company-image-field__badge">Optional</span>
            </div>
            <div className="admin-company-image-preview admin-company-image-preview--cover">
              {form.coverImageUrl ? (
                <Image unoptimized src={form.coverImageUrl} alt={`${form.name || "Company"} cover preview`} width={600} height={360} />
              ) : <div className="admin-company-image-preview__empty"><span>COVER</span><p>Hakuna cover image</p></div>}
            </div>
            <label className="admin-form-field">
              <span>Cover image URL</span>
              <input type="url" value={form.coverImageUrl} onChange={(event) => set("coverImageUrl", event.target.value)} placeholder="Pakia picha au weka URL ya picha" />
            </label>
            <input ref={coverInputRef} className="admin-company-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { void uploadImage("coverImageUrl", event.target.files?.[0]); event.currentTarget.value = ""; }} />
            <button type="button" className="admin-company-upload-button admin-company-upload-button--secondary" disabled={uploading !== null} onClick={() => coverInputRef.current?.click()}>
              {uploading === "coverImageUrl" ? "Inapakia cover…" : "↑ Upload cover image"}
            </button>
          </div>
        </div>
      </section>

      <section className="admin-form-card admin-company-edit-form__section">
        <div className="admin-company-edit-form__section-heading">
          <span>03</span>
          <div><h3>Company profile</h3><p>Maelezo yatakayoonekana kwa wageni wa website.</p></div>
        </div>
        <div className="admin-form-grid">
          <label className="admin-form-field admin-form-field--full">
            <span>Summary</span>
            <textarea rows={3} value={form.summary} onChange={(event) => set("summary", event.target.value)} required />
          </label>
          <label className="admin-form-field admin-form-field--full">
            <span>Description</span>
            <textarea rows={7} value={form.description} onChange={(event) => set("description", event.target.value)} required />
          </label>
          <label className="admin-form-field">
            <span>Status</span>
            <select value={form.status} onChange={(event) => set("status", event.target.value as CompanyInput["status"])}>
              <option>Draft</option><option>Active</option><option>Inactive</option><option>Archived</option>
            </select>
          </label>
          <label className="admin-form-field">
            <span>Sort order</span>
            <input type="number" min="0" value={form.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} />
          </label>
          <label className="admin-form-field admin-form-field--full">
            <span>SEO title</span>
            <input type="text" value={form.seoTitle} onChange={(event) => set("seoTitle", event.target.value)} />
          </label>
          <label className="admin-form-field admin-form-field--full">
            <span>SEO description</span>
            <textarea rows={3} value={form.seoDescription} onChange={(event) => set("seoDescription", event.target.value)} />
          </label>
          <label className="admin-checkbox-field">
            <input type="checkbox" checked={form.featured} onChange={(event) => set("featured", event.target.checked)} />
            <span><strong>Featured company</strong><small>Onyesha kampuni kama kampuni inayosisitizwa.</small></span>
          </label>
        </div>
      </section>

      <div className="admin-company-edit-form__bottom-actions">
        <Link className="admin-secondary-button" href="/admin/companies">Cancel</Link>
        <button type="submit" disabled={busy || uploading !== null} className="admin-primary-button">
          {busy ? "Saving…" : "Save Company"}
        </button>
      </div>
    </form>
  );
}
