// Seeds a single admin account using SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD from .env
// Run with: npm run prisma:seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = "nati@gmail.com";
  const password = "nati@123!";

  console.log(`Seeding admin user: ${email}`);

  // Delete existing admin if it exists
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists. Deleting and recreating...`);
    await prisma.admin.delete({ where: { email } });
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: { email, password: hashed },
  });

  console.log(`Created admin: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
