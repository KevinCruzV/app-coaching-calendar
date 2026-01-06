import z from "zod";

export type LoginInput = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long" })
    .regex(/[a-zA-Z]/, { error: "Password must contain at least one letter" })
    .trim(),
});

export type FormState = {
  fieldErrors?: { email?: string; password?: string };
  formError?: string | null;
  success?: boolean;
};

export type LoginResult =
  | { ok: true; token: string; expiresIn: number }
  | { ok: false; message: string };
