
import { expect, test, vi, beforeEach } from "vitest";

const setMock = vi.fn();
const fakeCookieStore = {
  get: vi.fn(),
  set: setMock,
};

vi.mock("next/headers", () => {
  return {
    cookies: async () => fakeCookieStore,
  };
});

vi.mock("next/navigation", () => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

import { logout } from "@/action/auth/logout";

test("logout", async () => {

  await expect(logout()).rejects.toThrow(
    "NEXT_REDIRECT:/"
  );
  expect(setMock).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "auth_token",
      value: "",
      path: '/',
      maxAge: 0,
    })
  );
});
