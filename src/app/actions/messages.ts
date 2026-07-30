"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  id: z.string().cuid(), status: z.enum(["NEW", "READ", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]),
  assignedUserId: z.string().cuid().optional().or(z.literal("")),
  internalNotes: z.string().trim().max(5000).optional().or(z.literal("")),
});
export async function updateMessageAction(formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid message update.");
  if (parsed.data.assignedUserId && !(await prisma.user.findFirst({ where: { id: parsed.data.assignedUserId, status: "ACTIVE" }, select: { id: true } }))) throw new Error("Assigned administrator is unavailable.");
  await prisma.$transaction([
    prisma.contactMessage.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status, assignedUserId: parsed.data.assignedUserId || null, internalNotes: parsed.data.internalNotes || null } }),
    prisma.auditLog.create({ data: { userId: user.id, action: "UPDATE", entityType: "ContactMessage", entityId: parsed.data.id, summary: `Updated contact message status to ${parsed.data.status}` } }),
  ]);
  revalidatePath("/admin/messages"); revalidatePath(`/admin/messages/${parsed.data.id}`);
}
export async function deleteMessageAction(formData: FormData) {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN"]);
  const id = z.string().cuid().parse(formData.get("id"));
  await prisma.$transaction([
    prisma.contactMessage.delete({ where: { id } }),
    prisma.auditLog.create({ data: { userId: user.id, action: "DELETE", entityType: "ContactMessage", entityId: id, summary: "Deleted contact message" } }),
  ]);
  revalidatePath("/admin/messages");
}
