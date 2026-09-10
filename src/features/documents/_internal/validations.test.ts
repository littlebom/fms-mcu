import { describe, it, expect } from "vitest";
import { createDocumentSchema, createCategorySchema } from "./validations";

describe("Document Validations", () => {
  it("validates valid document input", () => {
    const valid = {
      categoryId: "e0f7e1e6-b088-466d-88f6-166f81dc97f2",
      code: "FM-01",
      titleTh: "แบบฟอร์มคำร้อง",
      titleEn: "Request Form",
      fileUrl: "https://example.com/form.pdf",
      fileType: "pdf",
      isActive: true,
      sortOrder: 1,
    };

    const parsed = createDocumentSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("fails if fileUrl is invalid", () => {
    const invalid = {
      categoryId: "a0000000-0000-0000-0000-000000000001",
      titleTh: "แบบฟอร์ม",
      titleEn: "Form",
      fileUrl: "not-a-url",
    };

    const parsed = createDocumentSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("validates category code slug format", () => {
    const validCat = {
      code: "student-forms",
      nameTh: "แบบฟอร์มนักศึกษา",
      nameEn: "Student Forms",
      target: "STUDENT",
    };
    expect(createCategorySchema.safeParse(validCat).success).toBe(true);

    const invalidCat = {
      code: "INVALID CODE WITH SPACE",
      nameTh: "ชื่อ",
      nameEn: "Name",
    };
    expect(createCategorySchema.safeParse(invalidCat).success).toBe(false);
  });
});
