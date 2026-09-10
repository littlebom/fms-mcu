import { z } from "zod";

export const articleSchema = z.object({
  categoryId: z.string().uuid("category_required"),
  titleTh: z.string().min(1, "title_th_required").max(255),
  titleEn: z.string().min(1, "title_en_required").max(255),
  slug: z
    .string()
    .min(1, "slug_required")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "slug_format_invalid"),
  excerptTh: z.string().max(1000).optional().nullable(),
  excerptEn: z.string().max(1000).optional().nullable(),
  contentTh: z.string().min(1, "content_th_required"),
  contentEn: z.string().min(1, "content_en_required"),
  coverImageUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  isPinned: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const createArticleSchema = articleSchema;

export const updateArticleSchema = articleSchema.extend({
  id: z.string().uuid(),
});

export const articleCategorySchema = z.object({
  nameTh: z.string().min(1).max(255),
  nameEn: z.string().min(1).max(255),
  slug: z.string().min(1).max(100),
  sortOrder: z.coerce.number().int().default(0),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleCategoryInput = z.infer<typeof articleCategorySchema>;
