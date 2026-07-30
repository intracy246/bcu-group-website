"use client";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";
const initialState: LoginState = {};
export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return <form action={action} className="admin-login__form">
    <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
    <label><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
    {state.error && <p role="alert">{state.error}</p>}
    <button className="admin-primary-button" disabled={pending} type="submit">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
