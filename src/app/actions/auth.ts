"use server";
import { redirect } from "next/navigation";
import { authenticate, logout } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
export type LoginState = { error?: string };
export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const input = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!input.success) return { error: "Enter a valid email and password." };
  try {
    if (!(await authenticate(input.data.email, input.data.password))) return { error: "Invalid credentials or disabled account." };
  } catch { return { error: "Sign in is temporarily unavailable." }; }
  redirect("/admin");
}
export async function logoutAction() { await logout(); redirect("/admin/login"); }
