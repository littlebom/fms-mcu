import { describe, it, expect } from "vitest";
import { createProgramSchema, updateProgramSchema } from "./validations";

describe("curriculum validations", () => {
  it("validate createProgramSchema สำเร็จเมื่อข้อมูลถูกต้อง", () => {
    const valid = {
      departmentId: "123e4567-e89b-12d3-a456-426614174000",
      code: "cs-bsc",
      degreeLevel: "BACHELOR" as const,
      studyType: "REGULAR" as const,
      nameTh: "วิทยาศาสตรบัณฑิต สาขาวิทยาการคอมพิวเตอร์",
      nameEn: "Bachelor of Science in Computer Science",
      degreeNameTh: "วท.บ. (วิทยาการคอมพิวเตอร์)",
      degreeNameEn: "B.Sc. (Computer Science)",
      totalCredits: 128,
      tuitionFee: "25,000 บาท/ภาคการศึกษา",
      durationYears: 4.0,
      careerPaths: ["Software Engineer", "AI Engineer"],
      isOpenAdmissions: true,
      isActive: true,
    };
    const parsed = createProgramSchema.parse(valid);
    expect(parsed.code).toBe("cs-bsc");
    expect(parsed.totalCredits).toBe(128);
  });

  it("validate createProgramSchema ล้มเมื่อ code มีอักขระพิเศษ", () => {
    const invalid = {
      departmentId: "123e4567-e89b-12d3-a456-426614174000",
      code: "invalid code with spaces!",
      nameTh: "ชื่อ",
      nameEn: "Name",
      degreeNameTh: "ปริญญา",
      degreeNameEn: "Degree",
    };
    expect(() => createProgramSchema.parse(invalid)).toThrow();
  });

  it("validate updateProgramSchema ต้องมี id เป็น UUID", () => {
    const valid = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      departmentId: "123e4567-e89b-12d3-a456-426614174000",
      code: "cs-bsc",
      nameTh: "ชื่อ",
      nameEn: "Name",
      degreeNameTh: "ปริญญา",
      degreeNameEn: "Degree",
    };
    expect(updateProgramSchema.parse(valid).id).toBe("123e4567-e89b-12d3-a456-426614174000");
  });
});
