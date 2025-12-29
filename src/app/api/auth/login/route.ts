import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { LoginInput, loginSchema } from "@/types/authentication/login";
import prisma from "@/lib/prisma";


export async function POST(request: Request) {
    const { email, password }: LoginInput = await request.json();

    const body = loginSchema.safeParse({ email, password })

    // valid input
    if(!body.success) {
        return NextResponse.json({message: 'Email or pasword is missing'}, { status: 400});
    };

    // find user
    const user = await prisma.user.findUnique({
        where: { email: body.data.email },
    });

    if(!user) {
        return NextResponse.json({ message: 'Invalid credentials'}, { status: 401 });
    };

    // check password
    const isPasswordValid = await bcrypt.compare(body.data.password, user.passwordHash);

    if(!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid credentials'}, { status: 401 });
    };

    // create token
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '3600s' }
    );

    const response = NextResponse.json(
        { token, expiresIn: 3600 },
        { status: 200 }
    );

    response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
    });

    return response;    
}