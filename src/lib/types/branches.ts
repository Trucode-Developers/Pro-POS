import { z } from "zod";

export const BranchSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(5, "Name must be at least 5 characters"),
  address: z.string(),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  email: z.string().email(),
  status: z.string().transform((val) => val === "1"),
  description: z.string(),
});

export type TypeBranchSchema = z.infer<typeof BranchSchema>;