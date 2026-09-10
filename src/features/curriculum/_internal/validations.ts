import { z } from "zod";

export const programSchema = z.object({
  departmentId: z.string().uuid("department_required"),
  code: z
    .string()
    .min(1, "code_required")
    .max(50)
    .regex(/^[A-Za-z0-9-]+$/, "code_format_invalid"),
  degreeLevel: z.enum(["BACHELOR", "MASTER", "DOCTORAL"]).default("BACHELOR"),
  studyType: z.enum(["REGULAR", "SPECIAL", "INTERNATIONAL"]).default("REGULAR"),
  nameTh: z.string().min(1, "name_th_required").max(255),
  nameEn: z.string().min(1, "name_en_required").max(255),
  degreeNameTh: z.string().min(1, "degree_name_th_required").max(255),
  degreeNameEn: z.string().min(1, "degree_name_en_required").max(255),
  totalCredits: z.coerce.number().int().min(1).default(120),
  tuitionFee: z.string().max(255).optional().nullable(),
  durationYears: z.coerce.number().min(0.5).max(10).default(4.0),
  descriptionTh: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  philosophyTh: z.string().optional().nullable(),
  philosophyEn: z.string().optional().nullable(),
  careerPaths: z.array(z.string()).default([]),
  coverImageUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  brochureUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  curriculumPdfUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  applicationUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  isOpenAdmissions: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const createProgramSchema = programSchema;

export const updateProgramSchema = programSchema.extend({
  id: z.string().uuid(),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
