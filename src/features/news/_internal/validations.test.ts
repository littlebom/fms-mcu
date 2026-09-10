import { describe, it, expect } from "vitest";
import { createArticleSchema, updateArticleSchema, articleCategorySchema } from "./validations";

describe("news validations", () => {
  it("validate createArticleSchema สำเร็จเมื่อข้อมูลถูกต้อง", () => {
    const valid = {
      categoryId: "123e4567-e89b-12d3-a456-426614174000",
      titleTh: "เปิดรับสมัครนักศึกษาใหม่",
      titleEn: "Admissions Open 2026",
      slug: "admissions-open-2026",
      excerptTh: "บทคัดย่อ",
      excerptEn: "Excerpt",
      contentTh: "เนื้อหาข่าวแบบยาว",
      contentEn: "Full content",
      coverImageUrl: "https://example.com/image.jpg",
      status: "PUBLISHED" as const,
      isPinned: true,
      isFeatured: true,
    };
    const parsed = createArticleSchema.parse(valid);
    expect(parsed.slug).toBe("admissions-open-2026");
    expect(parsed.isPinned).toBe(true);
  });

  it("validate createArticleSchema ล้มเมื่อ slug ผิดรูปแบบ (มีช่องว่างหรืออักขระพิเศษ)", () => {
    const invalid = {
      categoryId: "123e4567-e89b-12d3-a456-426614174000",
      titleTh: "หัวข้อ",
      titleEn: "Title",
      slug: "invalid slug with spaces",
      contentTh: "เนื้อหา",
      contentEn: "Content",
    };
    expect(() => createArticleSchema.parse(invalid)).toThrow();
  });

  it("validate updateArticleSchema ต้องมี id เป็น UUID", () => {
    const valid = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      categoryId: "123e4567-e89b-12d3-a456-426614174000",
      titleTh: "หัวข้อ",
      titleEn: "Title",
      slug: "valid-slug",
      contentTh: "เนื้อหา",
      contentEn: "Content",
    };
    expect(updateArticleSchema.parse(valid).id).toBe("123e4567-e89b-12d3-a456-426614174000");
  });

  it("validate articleCategorySchema สำเร็จ", () => {
    const valid = {
      nameTh: "ข่าววิชาการ",
      nameEn: "Academic News",
      slug: "academic",
      sortOrder: 1,
    };
    expect(articleCategorySchema.parse(valid).slug).toBe("academic");
  });
});
