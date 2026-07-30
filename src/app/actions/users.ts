"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailSchema } from "@/lib/validation";

const passwordSchema = z
  .string()
  .min(12)
  .max(200)
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[0-9]/, "Password must include a number.");

const userSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
});

export async function createUserAction(form: FormData) {
  const actor = await requireUser(["SUPER_ADMIN"]);
  const parsed = userSchema
    .extend({ password: passwordSchema })
    .parse(Object.fromEntries(form));

  try {
    const passwordHash = await bcrypt.hash(parsed.password, 12);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: parsed.name,
          email: parsed.email,
          role: parsed.role,
          passwordHash,
        },
      });
      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: "CREATE",
          entityType: "User",
          entityId: created.id,
          summary: `Created administrator ${created.email}`,
        },
      });
      return created;
    });
    revalidatePath("/admin/users");
    void user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("That email is already in use.");
    }
    throw new Error("The administrator could not be created.");
  }
}

export async function updateUserAction(form: FormData) {
  const actor = await requireUser(["SUPER_ADMIN"]);
  const parsed = userSchema
    .extend({
      id: z.string().cuid(),
      status: z.enum(["ACTIVE", "DISABLED"]),
    })
    .parse(Object.fromEntries(form));
  const target = await prisma.user.findUnique({ where: { id: parsed.id } });
  if (!target) throw new Error("User not found.");
  if (parsed.status === "DISABLED" && target.id === actor.id) {
    throw new Error("You cannot disable your active account.");
  }
  if (
    target.role === "SUPER_ADMIN" &&
    (parsed.role !== "SUPER_ADMIN" || parsed.status === "DISABLED")
  ) {
    const activeSuperAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN", status: "ACTIVE" },
    });
    if (activeSuperAdmins <= 1) {
      throw new Error("The final active SUPER_ADMIN cannot be changed or disabled.");
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name,
        email: parsed.email,
        role: parsed.role,
        status: parsed.status,
      },
    });
    if (parsed.status === "DISABLED") {
      await tx.session.deleteMany({ where: { userId: parsed.id } });
    }
    await tx.auditLog.create({
      data: {
        userId: actor.id,
        action: "UPDATE",
        entityType: "User",
        entityId: parsed.id,
        summary: `Updated administrator ${parsed.email}`,
      },
    });
  });
  revalidatePath("/admin/users");
}

export async function resetPasswordAction(form: FormData) {
  const actor = await requireUser(["SUPER_ADMIN"]);
  const parsed = z
    .object({ id: z.string().cuid(), password: passwordSchema })
    .parse(Object.fromEntries(form));
  const passwordHash = await bcrypt.hash(parsed.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: parsed.id },
      data: { passwordHash },
    }),
    prisma.session.deleteMany({ where: { userId: parsed.id } }),
    prisma.auditLog.create({
      data: {
        userId: actor.id,
        action: "PASSWORD_RESET",
        entityType: "User",
        entityId: parsed.id,
        summary: "Reset administrator password",
      },
    }),
  ]);
  revalidatePath("/admin/users");
}

export async function deleteUserAction(form: FormData) {
  const actor = await requireUser(["SUPER_ADMIN"]);
  const id = z.string().cuid().parse(form.get("id"));
  if (id === actor.id) throw new Error("You cannot delete your active account.");
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new Error("User not found.");
  if (target.role === "SUPER_ADMIN" && target.status === "ACTIVE") {
    const activeSuperAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN", status: "ACTIVE" },
    });
    if (activeSuperAdmins <= 1) {
      throw new Error("The final active SUPER_ADMIN cannot be deleted.");
    }
  }

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
    prisma.auditLog.create({
      data: {
        userId: actor.id,
        action: "DELETE",
        entityType: "User",
        entityId: id,
        summary: `Deleted administrator ${target.email}`,
      },
    }),
  ]);
  revalidatePath("/admin/users");
}
