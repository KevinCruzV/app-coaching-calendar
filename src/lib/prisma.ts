"use server"; 
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function makePrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");

  // Avec driverAdapters, PrismaClient DOIT recevoir un adapter
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
