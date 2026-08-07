import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AdminTokenPayload {
  id: string;
  email: string;
}

export function signToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): AdminTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AdminTokenPayload;
}
