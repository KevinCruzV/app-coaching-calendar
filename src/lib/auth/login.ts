"use server";
import { SECRET_KEY, TOKEN_EXPIRATION_IN } from "@/constants";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginResult } from "@/types/auth/login";

export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<LoginResult> {
  if (!SECRET_KEY) return { ok: false, message: "JWT secret missing" };

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return { ok: false, message: "Invalid credentials" };

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return { ok: false, message: "Invalid credentials" };

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRATION_IN}s` });

  return { ok: true, token, expiresIn: TOKEN_EXPIRATION_IN };
}
