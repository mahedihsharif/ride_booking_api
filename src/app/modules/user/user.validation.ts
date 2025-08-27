import z from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(30, { message: "Name cannot exceed 30 characters." }),

  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .min(6, { message: "Password must be at least 6 characters long." }),
  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(/^(?:\+880|0)?1[3-9][0-9]{8}$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
  role: z.enum([Role.RIDER, Role.DRIVER], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either rider or driver",
  }),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(30, { message: "Name cannot exceed 30 characters." })
    .optional(),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." })
    .optional(),
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .min(6, { message: "Password must be at least 6 characters long." })
    .optional(),

  role: z
    .enum([Role.RIDER, Role.DRIVER], {
      required_error: "Role is required",
      invalid_type_error: "Role must be either rider or driver",
    })
    .optional(),
  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(/^(?:\+880|880)?1[3-9][0-9]{8}$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  isBlocked: z
    .boolean({ invalid_type_error: "isBlocked must be true or false" })
    .optional(),
  isApproved: z
    .boolean({ invalid_type_error: "isApproved must be true or false" })
    .optional(),
  isAvailable: z
    .boolean({ invalid_type_error: "isAvailable must be true or false" })
    .optional(),
});
