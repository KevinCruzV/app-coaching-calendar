"use client";
import { loginAction } from "@/action/auth/login";
import { useActionState } from "react";
import { FormState } from "@/types/auth/login";
import Link from "next/link";
import { register } from "@/action/auth/register";

export default function LoginForm() {
  const initialState: FormState = {
    fieldErrors: {},
    formError: null,
    success: false,
  };
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  return (
    <div className="w-full">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-black mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border border-gray-700 text-black px-2"
            required
          />
          {state.fieldErrors?.email && (
            <p className="text-red-500 mt-1">{state.fieldErrors?.email}</p>
          )}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="password" className="text-black mb-1">
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border border-gray-700 text-black px-2"
            required
          />
          {state.fieldErrors?.password && (
            <p className="text-red-500 mt-1">{state.fieldErrors?.password}</p>
          )}
          <p className="font-normal text-sm text-black">
            Don&apos;t have an account ?{" "}
            <Link href="/register" className="text-blue-500 underline">
              Register.
            </Link>
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="text-white block bg-blue-500 text-sm mx-auto border box-border border-transparent rounded-sm transition hover:bg-brand-strong py-2 px-6 cursor-pointer self-start focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base"
        >
          Submit
        </button>
        {state.formError && <p className="text-red-500">{state.formError}</p>}
      </form>
    </div>
  );
}
