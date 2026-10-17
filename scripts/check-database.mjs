import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  console.error("PostgreSQL connection verification skipped: DATABASE_URL is not set.");
  process.exit(2);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

try {
  const result = await prisma.$queryRaw`SELECT 1 AS connected`;
  console.log("PostgreSQL read-only query succeeded:", result);
} catch (error) {
  console.error("PostgreSQL connection verification failed:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
