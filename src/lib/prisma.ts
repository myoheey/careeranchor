import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DATABASE_URL_ENV_KEYS = [
  "DATABASE_URL",
  "DIRECT_DATABASE_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_URL",
] as const;

function resolveDatabaseUrl() {
  for (const key of DATABASE_URL_ENV_KEYS) {
    const raw = process.env[key];
    if (!raw) continue;

    const normalized = raw.trim().replace(/^['\"]|['\"]$/g, "");
    if (normalized) return normalized;
  }

  return "postgresql://placeholder:placeholder@localhost:5432/placeholder";
}

function createPrismaClient() {
  const adapter = new PrismaNeon({
    connectionString: resolveDatabaseUrl() as string,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
