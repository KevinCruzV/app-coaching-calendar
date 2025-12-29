"use server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(): Promise<NextResponse> {
    const cookieStore =  await cookies();
    cookieStore.set({
        name: 'auth_token',
        path: '/',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
    });
    return NextResponse.json({ ok: true });
}