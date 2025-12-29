export type User = {
    id: string;
    email: string;
    name: string;
    surename: string;
    passwordHash: string;
    role: "COACH" | "CLIENT";
    createdAt: Date;
}

export type UserMe = Omit<User, "passwordHash">;