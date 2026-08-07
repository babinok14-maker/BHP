import { prisma } from "../config/db";
import { AppError } from "../utils/AppError";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/token";

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await comparePassword(password, admin.password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ id: admin.id, email: admin.email });
  return { token, admin: { id: admin.id, email: admin.email } };
}

export async function getAdminById(id: string) {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: { id: true, email: true, createdAt: true },
  });
  if (!admin) throw new AppError("Admin not found", 404);
  return admin;
}
