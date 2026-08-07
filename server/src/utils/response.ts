import { Response } from "express";

// Keeps every endpoint's success shape consistent and minimal.
export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}
