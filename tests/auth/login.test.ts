import {vi, beforeEach, test, expect} from "vitest";

vi.mock('@/lib/prisma');

vi.mock('bcrypt');  
import prisma from "@/lib/prisma";
import { POST } from "@/app/api/auth/login/route";
import bcrypt from "bcrypt";

beforeEach(() => {
    vi.clearAllMocks();
});

test('return 200 and set cookie for valid credentials', async () => {
    prisma.user.findUnique = vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'john.doe@gmail.com',
        passwordHash: 'hashed',
        role: 'COACH',
        name: 'John',
        surname: 'Doe',
    });

    bcrypt.compare = vi.fn().mockResolvedValue(true);

    const req = {
        json: async () => ({
            email: 'john.doe@gmail.com',
            password: 'dsfgdf',
        }),
    } as Request;

    const res = await POST(req);
    const body = await res.json();
    const setCookie = res.headers.get("set-cookie");

    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('expiresIn', 3600);

    expect(res.status).toBe(200);
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("auth_token=");
    expect(setCookie).toMatch(/HttpOnly/i);
});

test('return 401 for invalid credentials', async () => {
    prisma.user.findUnique = vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'john.doe@gmail.com',
        passwordHash: 'hashed',
        role: 'COACH',
        name: 'John',
        surname: 'Doe',
    });

    bcrypt.compare = vi.fn().mockResolvedValue(false);

    const req = {
        json: async () => ({
            email: 'john.doe@gmail.com',
            password: 'wrong-password',
        }),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ message: 'Invalid credentials' });

});

test('return 400 for missing email or password', async () => {
    const req = {
        json: async () => ({
            email: '',
            password: '',
        }),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ message: 'Email or pasword is missing' });
});

test('return 401 for non-existing user', async () => {
    prisma.user.findUnique = vi.fn().mockResolvedValue(null);

    const req = {
        json: async () => ({
            email: 'john.doe@gmail.com',
            password: 'wrong-password',
        }),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ message: 'Invalid credentials' });
});    