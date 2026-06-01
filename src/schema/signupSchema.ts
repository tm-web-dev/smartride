import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required")
      .max(150, "Email cannot exceed 150 characters")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]+$/,
        "Password must contain at least one letter and one number"
      ),
  })
  .strict();