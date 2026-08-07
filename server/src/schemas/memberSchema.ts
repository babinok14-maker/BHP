import { z } from "zod";

const memberBase = {
  fullName: z.string().trim().min(2, "Full name is required"),
  passportNumber: z.string().trim().min(3, "Passport number is required"),
  jobPosition: z.string().trim().min(2, "Job position is required"),
  age: z.number().int().min(0).max(120),
  status: z.enum(["Accepted", "Pending", "Rejected"]).default("Accepted"),
};

export const createMemberSchema = z.object({
  body: z.object(memberBase),
});

export const updateMemberSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    fullName: z.string().trim().min(2).optional(),
    passportNumber: z.string().trim().min(3).optional(),
    jobPosition: z.string().trim().min(2).optional(),
    age: z.number().int().min(0).max(120).optional(),
    status: z.enum(["Accepted", "Pending", "Rejected"]).optional(),
    published: z.boolean().optional(),
  }),
});

export const memberIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
