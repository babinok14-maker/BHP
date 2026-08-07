import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  admin?: { id: string; email: string };
}

export interface MemberDTO {
  id: string;
  fullName: string;
  passportNumber: string;
  jobPosition: string;
  photoUrl: string | null;
  status: "Accepted" | "Pending" | "Rejected";
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
