import { z } from "zod";

export const UserSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    role: z.number(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
    is_active: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TypeUserSchema = z.infer<typeof UserSchema>;
