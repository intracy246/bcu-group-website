"use client";

import { useState } from "react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Section = { id: string; key: string; type: string; sortOrder: number; visible: boolean; content: JsonValue };
type Props = { section: Section; action: (formData: FormData) => void | Promise<void> };

const labelFor = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").replace(/^./, (character) => character.toUpperCase());

function ContentFields({ value, onChange, label = "Content" }: { value: JsonValue; onChange: (next: JsonValue) => void; label?: string }) {
  if (typeof value === "boolean") return <label className="admin-toggle"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /><span>{labelFor(label)}</span></label>;
  if (typeof value === "number") return <label className="admin-form-field"><span>{labelFor(label)}</span><input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
  if (typeof value === "string") return <label className="admin-form-field"><span>{labelFor(label)}</span>{/(body|description|text|intro|content)/i.test(label) ? <textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
  if (value === null) return <label className="admin-form-field"><span>{labelFor(label)}</span><input value="" onChange={(event) => onChange(event.target.value)} /></label>;
  if (Array.isArray(value)) return <div className="admin-repeatable-list"><h4>{labelFor(label)}</h4>{value.map((item, index) => <div className="admin-repeatable-row admin-repeatable-row--content" key={index}><ContentFields label={`Item ${index + 1}`} value={item} onChange={(next) => onChange(value.map((current, currentIndex) => currentIndex === index ? next : current))} /><button type="button" className="admin-danger-button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div>)}<button type="button" className="admin-secondary-button" onClick={() => onChange([...value, ""])}>Add item</button></div>;
  return <div className="admin-content-fields">{Object.entries(value).map(([key, item]) => <ContentFields key={key} label={key} value={item} onChange={(next) => onChange({ ...value, [key]: next })} />)}</div>;
}

export default function PageSectionEditor({ section, action }: Props) {
  const [content, setContent] = useState<JsonValue>(section.content);
  return <form action={action} className="admin-form-card admin-section-editor"><input type="hidden" name="id" value={section.id} /><input type="hidden" name="content" value={JSON.stringify(content)} /><div className="admin-section-editor__heading"><div><p>{section.type}</p><h3>{labelFor(section.key)}</h3></div><label className="admin-toggle"><input name="visible" type="checkbox" defaultChecked={section.visible} /><span>Visible</span></label></div><div className="admin-form-grid"><label className="admin-form-field"><span>Section key</span><input name="key" defaultValue={section.key} required /></label><label className="admin-form-field"><span>Section type</span><input name="type" defaultValue={section.type} required /></label><label className="admin-form-field"><span>Display order</span><input name="sortOrder" type="number" min="0" defaultValue={section.sortOrder} /></label></div><div className="admin-content-fields"><ContentFields value={content} onChange={setContent} /></div><button className="admin-primary-button">Save section</button></form>;
}