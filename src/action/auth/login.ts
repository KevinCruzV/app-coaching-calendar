"use server";
import { FormState, loginSchema } from "@/types/auth/login";
import { redirect } from "next/navigation";
import { loginWithEmailPassword } from "@/lib/auth/login";
import { createSession } from "@/lib/auth/session";

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    return {
      ...prevState,
      fieldErrors: {
        email: errors.fieldErrors.email?.[0],
        password: errors.fieldErrors.password?.[0],
      },
      formError: "Please correct the errors in the form.",
      success: false,
    };
  }

  const { email, password } = parsed.data;

  const result = await loginWithEmailPassword(email, password);

  if (!result.ok) {
    return {
      ...prevState,
      formError: "Login failed. Please check your credentials and try again.",
      success: false,
    };
  }

  await createSession(result.token);

  redirect("/coach/appointments");
}
