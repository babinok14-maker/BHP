import { NextFunction, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/token";
import { AuthenticatedRequest } from "../types";

// Protects admin-only routes. Expects "Authorization: Bearer <token>".
export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Not authenticated", 401));
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.admin = { id: payload.id, email: payload.email };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
