import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./prisma/generated/prisma/client";

const prismaClientSingleton = () => {
  // 1. Create the pg pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // 2. Initialize the adapter
  const adapter = new PrismaPg(pool);

  // 3. Return the Prisma Client with the adapter
  return new PrismaClient({ adapter });
};

// Setup global type for TypeScript
interface CustomGlobal {
  prisma?: ReturnType<typeof prismaClientSingleton>;
}

const globalForPrisma = globalThis as unknown as CustomGlobal;

// Export the singleton instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Save to global object in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
export default prisma;
