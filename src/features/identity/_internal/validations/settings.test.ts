import { describe, it, expect } from "vitest";
import { updateSettingsSchema, smtpSettingsSchema, testSmtpInputSchema } from "./settings";

describe("settings validations", () => {
  it("validates updateSettingsSchema without smtp", () => {
    const res = updateSettingsSchema.safeParse({
      nameTh: "มหาวิทยาลัย",
      nameEn: "University",
      palette: "blue",
    });
    expect(res.success).toBe(true);
  });

  it("validates updateSettingsSchema with valid smtp", () => {
    const res = updateSettingsSchema.safeParse({
      nameTh: "มหาวิทยาลัย",
      nameEn: "University",
      palette: "blue",
      smtp: {
        enabled: true,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        user: "admin@gmail.com",
        pass: "abcd efgh ijkl mnop",
        fromName: "FMS Platform",
        fromEmail: "admin@gmail.com",
      },
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.smtp?.enabled).toBe(true);
      expect(res.data.smtp?.host).toBe("smtp.gmail.com");
    }
  });

  it("defaults smtpSettingsSchema fields appropriately", () => {
    const res = smtpSettingsSchema.safeParse({});
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.host).toBe("smtp.gmail.com");
      expect(res.data.port).toBe(465);
      expect(res.data.secure).toBe(true);
      expect(res.data.enabled).toBe(false);
    }
  });

  it("validates testSmtpInputSchema requires recipient and user", () => {
    const invalid = testSmtpInputSchema.safeParse({
      user: "",
      to: "not-an-email",
    });
    expect(invalid.success).toBe(false);

    const valid = testSmtpInputSchema.safeParse({
      user: "sender@gmail.com",
      to: "recipient@example.com",
    });
    expect(valid.success).toBe(true);
  });
});
