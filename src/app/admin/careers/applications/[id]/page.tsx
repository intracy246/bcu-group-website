import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteApplicationAction, updateApplicationAction } from "@/app/actions/applications";
export default async function Page({params}:{params:Promise<{id:string}>}) {
  const id=(await params).id;
  const application=await prisma.jobApplication.findUnique({where:{id},include:{career:{select:{title:true}}}});
  if(!application)notFound();
  const cvHref=application.cvUrl.startsWith("private/")?`/api/admin/files/${application.cvUrl.split("/").map(encodeURIComponent).join("/")}`:application.cvUrl;
  return <div className="admin-dashboard"><section className="admin-page-intro"><div><p>{application.status}</p><h2>{application.applicantName}</h2><p>{application.career.title} · {application.email}</p></div><a className="admin-primary-button" href={cvHref}>Download CV</a></section><section className="admin-form-card"><p>{application.coverLetter}</p>{application.portfolioUrl&&<a href={application.portfolioUrl} target="_blank" rel="noreferrer">Open portfolio</a>}</section><form action={updateApplicationAction} className="admin-form-card"><input type="hidden" name="id" value={id}/><select name="status" defaultValue={application.status}>{["NEW","REVIEWING","SHORTLISTED","INTERVIEW","REJECTED","HIRED"].map(status=><option key={status}>{status}</option>)}</select><textarea name="internalNotes" rows={8} defaultValue={application.internalNotes??""}/><button className="admin-primary-button">Save</button></form><form action={async form=>{"use server";await deleteApplicationAction(form);redirect("/admin/careers/applications");}}><input type="hidden" name="id" value={id}/><button className="admin-secondary-button">Delete Application</button></form></div>;
}
