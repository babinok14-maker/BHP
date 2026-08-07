// Single shared Prisma client instance (avoids exhausting DB connections
// in dev when files are hot-reloaded).
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
