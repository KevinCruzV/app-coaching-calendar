import { vi, beforeEach, test, expect } from "vitest";

const getMock = vi.fn();
const fakeCookieStore = {
  get: getMock,
  set: vi.fn(),
};

vi.mock("next/headers", () => {
  return {
    cookies: async () => fakeCookieStore,
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("jsonwebtoken", () => {
  return {
    default: { verify: vi.fn(() => ({ userId: "user-1" })) },
  };
});

import {prisma} from "@/lib/prisma";
import { GET } from "@/app/api/me/route";
import jwt from "jsonwebtoken";
const verifyMock = jwt.verify as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

test("get current user", async () => {
  getMock.mockReturnValueOnce({
    value: vi.fn(() => "any-token"),
  });

  prisma.user.findUnique = vi.fn().mockResolvedValue({
    id: "user-1",
    email: "john.doe@gmail.com",
    role: "COACH",
    name: "John",
    surename: "Doe",
    createdAt: new Date("2023-01-01T00:00:00Z"),
  });

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body).toEqual({
    id: "user-1",
    email: "john.doe@gmail.com",
    role: "COACH",
    name: "John",
    surename: "Doe",
    createdAt: "2023-01-01T00:00:00.000Z",
  });
});

test("return 401 if no token", async () => {
  getMock.mockReturnValueOnce(undefined);

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(401);
  expect(body).toEqual({ message: "Unauthorized" });
});

test("return 401 for invalid token", async () => {
  getMock.mockReturnValueOnce({
    value: "invalid-token",
  });

  verifyMock.mockImplementationOnce(() => {
    throw new Error("Invalid token");
  });

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(401);
  expect(body).toEqual({ message: "Unauthorized" });
});

test("return 401 if user not found", async () => {
  getMock.mockReturnValueOnce({
    value: "any-token",
  });

  prisma.user.findUnique = vi.fn().mockResolvedValue(null);

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(401);
  expect(body).toEqual({ message: "User not found" });
});
