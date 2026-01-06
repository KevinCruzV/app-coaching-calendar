import { vi, beforeEach, test, expect, describe } from "vitest";
import { COOKIE_NAME, MAX_AGE_SECONDS } from "@/constants";

vi.mock("bcrypt");

const setMock = vi.fn();
const fakeCookieStore = {
  get: vi.fn(),
  set: setMock
};

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));



vi.mock("next/headers", () => {
  return {
    cookies: async() => fakeCookieStore,
  }
});

vi.mock("next/navigation", () => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));


vi.mock("jsonwebtoken", () => ({
  default: { sign: vi.fn(() => "token") },
  sign: vi.fn(() => "token"),
}));

import { prisma } from "@/lib/prisma";
import { loginAction } from "@/action/auth/login";
import bcrypt from "bcrypt";
import * as session from "@/lib/auth/session";
import { redirect } from "next/navigation";

beforeEach(() => {
  vi.clearAllMocks();
});

function makeFormData(values: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

const user1 = {
    id: "user-1",
    email: "john.doe@gmail.com",
    passwordHash: "hashed",
    role: "COACH" as const,
    name: "John",
    surename: "Doe",
    createdAt: new Date(),
}

describe("loginAction", () => {
  const initialState = {
    fieldErrors: {},
    formError: null,
    success: false,
  };

  test("create session", async () => {

    vi.spyOn(session, "createSession");

    const fd = makeFormData({ email: "john.doe@gmail.com", password: "goodpass" });

    (bcrypt.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(true);


    vi.mocked(prisma.user.findUnique).mockResolvedValue(user1);

    await expect(loginAction(initialState, fd)).rejects.toThrow(
      "NEXT_REDIRECT:/coach/appointments"
    );
    expect(setMock).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/coach/appointments");
    expect(session.createSession).toHaveBeenCalledWith("token");
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: COOKIE_NAME,
        value: "token",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: MAX_AGE_SECONDS,
        sameSite: "lax",
      })
    );
  });

test("invalid credentials", async () => {
  const fd = makeFormData({
    email: "john.doe@gmail.com",
    password: "wrongpass",
  });

  vi.mocked(prisma.user.findUnique).mockResolvedValue(user1);
  
  (bcrypt.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(false);

  const result = await loginAction(initialState, fd);

  expect(result.success).toBe(false);
  expect(result.formError).toBe(
    "Login failed. Please check your credentials and try again."
  );

  expect(setMock).not.toHaveBeenCalled();
  expect(redirect).not.toHaveBeenCalled();
});


test("missing email or password", async () => {
  const fd = makeFormData({
    email: "john.doe@gmail.com",
  });

  const result = await loginAction(initialState, fd);

  expect(result.success).toBe(false);
  expect(result.formError).toBe(
    "Please correct the errors in the form."
  );

  expect(prisma.user.findUnique).not.toHaveBeenCalled();
  expect(setMock).not.toHaveBeenCalled();
  expect(redirect).not.toHaveBeenCalled();
});

test("non-existing user", async () => {
  const fd = makeFormData({
    email: "john.doe@gmail.com",
    password: "goodpass",
  });

  vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

  const result = await loginAction(initialState, fd);

  expect(result.success).toBe(false);
  expect(result.formError).toBe(
    "Login failed. Please check your credentials and try again."
  );

  expect(bcrypt.compare).not.toHaveBeenCalled();
  expect(setMock).not.toHaveBeenCalled();
  expect(redirect).not.toHaveBeenCalled();
});


})