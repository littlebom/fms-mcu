import { z } from "zod";
import { PALETTE_IDS } from "@/shared/lib/palette";

export const smtpSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  host: z.string().trim().default("smtp.gmail.com"),
  port: z.coerce.number().int().min(1).max(65535).default(465),
  secure: z.boolean().default(true),
  user: z.string().trim().default(""),
  pass: z.string().trim().default(""),
  fromName: z.string().trim().default(""),
  fromEmail: z.string().trim().default(""),
});

export const testSmtpInputSchema = z.object({
  host: z.string().trim().default("smtp.gmail.com"),
  port: z.coerce.number().int().min(1).max(65535).default(465),
  secure: z.boolean().default(true),
  user: z.string().trim().min(1, "กรุณาระบุบัญชี Gmail / Please provide Gmail address"),
  pass: z.string().trim().optional().default(""),
  fromName: z.string().trim().optional().default(""),
  fromEmail: z.string().trim().optional().default(""),
  to: z.string().trim().email("อีเมลปลายทางไม่ถูกต้อง / Invalid recipient email"),
});

export const updateSettingsSchema = z.object({
  nameTh: z.string().trim().min(1).max(255),
  nameEn: z.string().trim().min(1).max(255),
  logoUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === "" || v.startsWith("/uploads/logos/") || z.string().url().safeParse(v).success,
      { message: "Must be a valid URL or an uploaded logo path" }
    )
    .default(""),
  palette: z.enum(PALETTE_IDS),
  smtp: smtpSettingsSchema.optional(),
});
export const updateProfileSchema = z.object({ name: z.string().trim().min(1).max(255), locale: z.enum(["th", "en"]) });
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SmtpSettingsInput = z.infer<typeof smtpSettingsSchema>;
export type TestSmtpInput = z.infer<typeof testSmtpInputSchema>;
