
import { POST } from "@/app/api/auth/logout/route";
import { expect, test, vi, beforeEach } from "vitest";

const setMock = vi.fn();
const fakeCookieStore = {
  get: vi.fn(),
  set: setMock,
};

vi.mock('next/headers', () => {
    return {
        cookies: async () => fakeCookieStore,
    };
});

beforeEach(() => {
    vi.clearAllMocks();
});


test('logout', async () => {
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(setMock).toHaveBeenCalledTimes(1);
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "auth_token",
        value: "",
        httpOnly: true,
        maxAge: 0,
      })
    );
});