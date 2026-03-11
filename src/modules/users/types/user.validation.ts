import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  role: z.string().optional(),
  active: z.boolean().optional(),
  
});
