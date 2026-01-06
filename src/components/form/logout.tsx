"use server";
import { logout } from "@/action/auth/logout";
import LogoutButton from "../button/logoutButton";

export default async function Logout() {
  return (
    <form action={logout}>
      <LogoutButton />
    </form>
  );
}
