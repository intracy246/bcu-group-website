"use client";
/* eslint-disable @next/next/no-img-element */
import { useId, useRef, useState } from "react";

type MediaOption = { url: string; fileName: string };
type Props = {
  label: string;
  value: string;
  mediaOptions: MediaOption[];
  onChange: (value: string) => void;
  onUploaded?: (asset: MediaOption) => void;
  uploadLabel: string;
  folder: string;
  aspectRatio?: string;
  allowRemove?: boolean;
};

type UploadResponse = { success: true; asset: MediaOption } | { error?: string };

export default function ImageMediaField({ label, value, mediaOptions, onChange, onUploaded, uploadLabel, folder, aspectRatio = "4 / 5", allowRemove = true }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const selectedFile = mediaOptions.find(option => option.url === value);

  async function upload(file: File) {
    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      body.append("imageOnly", "true");
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = await response.json() as UploadResponse;
      if (!response.ok || !("success" in result) || !result.success) {
        setError("error" in result ? result.error || "Image upload failed." : "Image upload failed.");
        return;
      }
      onUploaded?.(result.asset);
      onChange(result.asset.url);
    } catch {
      setError("Image upload failed. Your existing form values are unchanged.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return <div className="admin-form-field image-media-field">
    <span>{label}</span>
    <select aria-label={label} value={value} onChange={event => onChange(event.target.value)} disabled={uploading}>
      <option value="">No image selected</option>
      {mediaOptions.map(option => <option key={option.url} value={option.url}>{option.fileName}</option>)}
    </select>
    <div className="image-media-field__actions">
      <input ref={inputRef} id={inputId} type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={uploading} onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
      <label htmlFor={inputId} className="admin-secondary-button">{uploading ? "Uploading..." : uploadLabel}</label>
      {allowRemove && value && <button type="button" className="admin-secondary-button" disabled={uploading} onClick={() => onChange("")}>Remove image</button>}
    </div>
    {value && <div className="image-media-field__preview" style={{ aspectRatio }}><img src={value} alt={selectedFile?.fileName || `${label} preview`} /></div>}
    {value && <p className="image-media-field__status">Image selected{selectedFile ? `: ${selectedFile.fileName}` : ""}</p>}
    {error && <p role="alert" className="admin-form-error">{error}</p>}
  </div>;
}
