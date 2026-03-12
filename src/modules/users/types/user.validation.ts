import { z } from "zod";
import { $Enums } from "../../../generated/prisma/client"; // adjust import path as needed

// Create User Schema – matches required fields and optional ones
export const createUserSchema = z
  .object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.nativeEnum($Enums.Role).optional(),
    phone: z.string().max(30).nullable().optional(),
    countryCode: z.string().length(2).nullable().optional(),
  })
  .strict();

export const updateUserSchema = z
  .object({
    username: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.nativeEnum($Enums.Role).optional(),
    phone: z.string().max(30).nullable().optional(),
    countryCode: z.string().length(2).nullable().optional(),
    refreshToken: z.string().max(255).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();
