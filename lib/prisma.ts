// lib/prisma.ts
import { PrismaClient } from "@/lib/generated/prisma"; // ✅ use correct custom output path

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}