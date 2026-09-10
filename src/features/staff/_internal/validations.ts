import { z } from "zod";

export const staffProfileSchema = z.object({
  departmentId: z.string().uuid("department_required"),
  prefixTh: z.string().min(1, "prefix_th_required").max(50),
  prefixEn: z.string().min(1, "prefix_en_required").max(50),
  firstNameTh: z.string().min(1, "first_name_th_required").max(100),
  lastNameTh: z.string().min(1, "last_name_th_required").max(100),
  firstNameEn: z.string().min(1, "first_name_en_required").max(100),
  lastNameEn: z.string().min(1, "last_name_en_required").max(100),
  positionTh: z.string().min(1, "position_th_required").max(255),
  positionEn: z.string().min(1, "position_en_required").max(255),
  email: z.string().email("invalid_email").max(255),
  phoneExt: z.string().max(50).optional().nullable(),
  roomNumber: z.string().max(50).optional().nullable(),
  avatarUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  expertises: z.array(z.string()).default([]),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const createStaffProfileSchema = staffProfileSchema;

export const updateStaffProfileSchema = staffProfileSchema.extend({
  id: z.string().uuid(),
});

export const departmentSchema = z.object({
  code: z.string().min(1).max(50),
  nameTh: z.string().min(1).max(255),
  nameEn: z.string().min(1).max(255),
  isAcademic: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type CreateStaffProfileInput = z.infer<typeof createStaffProfileSchema>;
export type UpdateStaffProfileInput = z.infer<typeof updateStaffProfileSchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
