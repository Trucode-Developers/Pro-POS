import { z } from "zod";
//users schema
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


//branch schema
export const BranchSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(5, "Name must be at least 5 characters"),
  address: z.string(),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  email: z.string().email(),
  // status: z.string(),
  status: z.string().transform((val) => val === "1"),
  description: z.string(),
});
export type TypeBranchSchema = z.infer<typeof BranchSchema>;

//roles and permissions
export const RoleSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(5, "Role name must be at least 5 characters"),
});
export type TypeRoleSchema = z.infer<typeof RoleSchema>;