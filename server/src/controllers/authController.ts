import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import { sendSuccess } from "../utils/response";
import { AuthenticatedRequest } from "../types";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginAdmin(email, password);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

// Stateless JWT: "logout" is handled client-side by discarding the token.
// This endpoint exists for a consistent API surface / future token-blacklisting.
export async function logout(_req: Request, res: Response) {
  sendSuccess(res, { message: "Logged out" });
}

export async function me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const admin = await authService.getAdminById(req.admin!.id);
    sendSuccess(res, admin);
  } catch (err) {
    next(err);
  }
}
