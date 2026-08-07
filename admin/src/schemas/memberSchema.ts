import { z } from "zod";

export const memberFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  passportNumber: z.string().trim().min(3, "Passport number is required"),
  jobPosition: z.string().trim().min(2, "Job position is required"),
  age: z.number().int().min(0, "Age must be 0 or greater").max(120, "Age must be 120 or less"),
  status: z.enum(["Accepted", "Pending", "Rejected"]).default("Accepted"),
});

export type MemberFormSchemaValues = z.infer<typeof memberFormSchema>;
