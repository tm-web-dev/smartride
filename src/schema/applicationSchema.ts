import { z } from "zod";

// Create a standard type mapping for the form
export type GenderType = "male" | "female" | "other";

export const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),

  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),

  address: z.string().min(5, "Address is required"),
  district: z.string().min(2, "District is required"),

  pinCode: z
    .string()
    .min(6, "PIN must be 6 digits")
    .max(6, "PIN must be 6 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),

  // FIX: z.custom passes validation schemas perfectly directly into react-hook-form
  gender: z.custom<GenderType>((val) => {
    return typeof val === "string" && ["male", "female", "other"].includes(val);
  }, {
    message: "Please select your gender",
  }),

  dateOfBirth: z.string().min(1, "DOB is required"),

  aadharNumber: z
    .string()
    .length(12, "Identity verification must be 12 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),

  photoUrl: z.string().min(1, "Passport photo upload is required").url("Invalid photo URL link"),
  signatureUrl: z.string().min(1, "Signature upload is required").url("Invalid signature URL link"),
  aadharDocumentUrl: z.string().min(1, "Document upload is required").url("Invalid document URL link"),
});

export type ApplicationFormType = z.infer<typeof applicationSchema>;