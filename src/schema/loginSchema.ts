import {z} from "zod";

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase().max(150).regex(/\S+@\S+\.\S+/, "Please use a valid email address"),

  password: z.string().min(6).max(100),
})
.strict();