import { describe, it, expect } from "vitest";
import { createStaffProfileSchema, updateStaffProfileSchema, departmentSchema } from "./validations";

describe("staff validations", () => {
  it("validate createStaffProfileSchema สำเร็จเมื่อข้อมูลถูกต้อง", () => {
    const valid = {
      departmentId: "123e4567-e89b-12d3-a456-426614174000",
      prefixTh: "ศ.ดร.",
      prefixEn: "Prof. Dr.",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      positionTh: "คณบดี",
      positionEn: "Dean",
      email: "somchai@app.local",
      phoneExt: "1001",
      roomNumber: "FMS-401",
      expertises: ["AI", "Software"],
      sortOrder: 1,
      isActive: true,
    };
    const parsed = createStaffProfileSchema.parse(valid);
    expect(parsed.email).toBe("somchai@app.local");
    expect(parsed.firstNameTh).toBe("สมชาย");
  });

  it("validate createStaffProfileSchema ล้มเมื่ออีเมลไม่ถูกต้อง", () => {
    const invalid = {
      departmentId: "123e4567-e89b-12d3-a456-426614174000",
      prefixTh: "ดร.",
      prefixEn: "Dr.",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      positionTh: "อาจารย์",
      positionEn: "Lecturer",
      email: "invalid-email",
    };
    expect(() => createStaffProfileSchema.parse(invalid)).toThrow();
  });

  it("validate updateStaffProfileSchema ต้องมี id เป็น UUID", () => {
    const invalid = {
      id: "not-a-uuid",
      departmentId: "123e4567-e89b-12d3-a456-426614174000",
      prefixTh: "ดร.",
      prefixEn: "Dr.",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      positionTh: "อาจารย์",
      positionEn: "Lecturer",
      email: "test@app.local",
    };
    expect(() => updateStaffProfileSchema.parse(invalid)).toThrow();
  });

  it("validate departmentSchema สำเร็จ", () => {
    const valid = {
      code: "CS",
      nameTh: "ภาควิชาวิทยาการคอมพิวเตอร์",
      nameEn: "Department of Computer Science",
      isAcademic: true,
      sortOrder: 1,
    };
    expect(departmentSchema.parse(valid).code).toBe("CS");
  });
});
