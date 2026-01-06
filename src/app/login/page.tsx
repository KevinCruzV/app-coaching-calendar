"use client";
import LoginForm from "@/components/form/login";
export const runtime = "nodejs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-500">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
