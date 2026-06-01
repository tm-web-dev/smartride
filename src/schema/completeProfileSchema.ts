import { z } from "zod";

export const userProfileSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  aadharNumber: z.string().regex(/^\d{12}$/),
  address: z.string().trim().min(5).max(200),
  pinCode: z.string().regex(/^\d{6}$/),
  district: z.string(),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string(),
})
.strict();