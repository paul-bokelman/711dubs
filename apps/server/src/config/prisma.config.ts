import { PrismaClient } from "@prisma/client";

interface Global {
  prisma: PrismaClient;
}

const prisma =
  (global as unknown as Global).prisma ||
  (new PrismaClient({
    log: ["warn", "error"],
    datasources: {
      db: { url: "postgresql://paulb@localhost:8432/paulb" },
    },
  }) as PrismaClient);

// if (!isProduction) (global as unknown as Global).prisma = prisma;
(global as unknown as Global).prisma = prisma;

export { prisma };
