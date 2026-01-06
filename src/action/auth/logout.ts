"use server";
import { redirect } from "next/navigation";
import { clearSessions } from "@/lib/auth/session";

export async function logout() {
  await clearSessions();
  redirect("/");
}
