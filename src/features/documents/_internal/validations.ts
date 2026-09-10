import { z } from "zod";

export const documentTargetEnum = z.enum(["STUDENT", "STAFF", "PUBLIC"]);

export const createDocumentSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  code: z.string().max(50).optional().nullable(),
  titleTh: z.string().min(2, "ชื่อเอกสารภาษาไทยต้องมีอย่างน้อย 2 ตัวอักษร").max(255),
  titleEn: z.string().min(2, "Document title (EN) must be at least 2 characters").max(255),
  descriptionTh: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  fileUrl: z.string().url("กรุณากรอก URL ไฟล์ที่ถูกต้อง"),
  fileType: z.string().max(20).default("pdf"),
  fileSizeBytes: z.number().int().nonnegative().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateDocumentSchema = createDocumentSchema.extend({
  id: z.string().uuid("Invalid document ID"),
});

export const createCategorySchema = z.object({
  code: z
    .string()
    .min(2, "รหัสหมวดหมู่ต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "รหัสหมวดหมู่ต้องเป็นตัวพิมพ์เล็ก ตัวเลข และเครื่องหมายขีดกลางเท่านั้น"),
  nameTh: z.string().min(2, "ชื่อหมวดหมู่ภาษาไทยต้องมีอย่างน้อย 2 ตัวอักษร").max(255),
  nameEn: z.string().min(2, "Category name (EN) must be at least 2 characters").max(255),
  target: documentTargetEnum.default("PUBLIC"),
  sortOrder: z.number().int().default(0),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
