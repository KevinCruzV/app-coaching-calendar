import "server-only";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { SECRET_KEY, MAX_AGE_SECONDS, COOKIE_NAME } from "@/constants";

export async function createSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    sameSite: "lax",
  });
}

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  let payload: jwt.JwtPayload | null = null;

  if (!token?.value) return null;
  if (!SECRET_KEY) return null;

  try {
    payload = jwt.verify(token.value, SECRET_KEY!) as jwt.JwtPayload;
    const userId = payload?.userId;
    if (typeof userId !== "string" || !userId) return null;
    return { userId };
  } catch {
    return null;
  }
}

export async function clearSessions(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
}
