import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

// Must be registered LAST in app.ts (Express identifies error middleware
// by its 4-argument signature).
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({ success: false, message: "Internal server error" });
}

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Route not found" });
}
