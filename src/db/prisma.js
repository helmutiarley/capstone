import prismaClientPackage from "@prisma/client";
import prismaPgPackage from "@prisma/adapter-pg";

const { PrismaClient } = prismaClientPackage;
const { PrismaPg } = prismaPgPackage;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
