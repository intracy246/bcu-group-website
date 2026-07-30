import type { UserRole } from "@prisma/client";
export function canManageUsers(role: UserRole) { return role === "SUPER_ADMIN"; }
export function canManageOperations(role: UserRole) { return role === "SUPER_ADMIN" || role === "ADMIN"; }
export function canManageContent(role: UserRole) { return role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR"; }
export function mayDisableSuperAdmin(targetRole: UserRole, activeSuperAdmins: number) {
  return targetRole !== "SUPER_ADMIN" || activeSuperAdmins > 1;
}
