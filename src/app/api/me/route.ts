import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { UserMe } from "@/types/user";

export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if(!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    let payload: JwtPayload | null = null;
    
    try {
        payload = jwt.verify(token.value, process.env.JWT_SECRET as string) as JwtPayload;
    } catch {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = payload.userId;
    
    if(!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: {
            id: userId.toString()
        }
    });

    if(!user) return NextResponse.json({message: "User not found"}, { status: 401 });

    const userMe: UserMe = {
        id: user.id,
        email: user.email,
        name: user.name,
        surename: user.surename,
        role: user.role,
        createdAt: user.createdAt,
    };

    return NextResponse.json(userMe);
}