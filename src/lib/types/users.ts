import { z } from "zod";

//login schema
export const LoginSchema = z.object({
  email: z.string().email().min(5, "too weak email!").max(50, "too long email!").optional(),
  password: z.string().min(5, "too weak password!"),
});
export type TypeLoginSchema = z.infer<typeof LoginSchema>;

//users schema
export const UserSchema = z
  .object({
    id: z.number().optional(),
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
  id: z.number().optional(), //as its autoIncremented in the database, will be used for updating
  total_permissions: z.number().optional(), //only used for the get_all_roles endpoint
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(5, "Role name must be at least 5 characters"),
});
export type TypeRoleSchema = z.infer<typeof RoleSchema>;

