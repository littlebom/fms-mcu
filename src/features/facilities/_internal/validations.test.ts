import { describe, it, expect } from "vitest";
import {
  createFacilitySchema,
  updateFacilitySchema,
  createReservationSchema,
  reviewReservationSchema,
} from "./validations";

describe("Facilities & Reservation Validations", () => {
  it("validates valid facility data", () => {
    const valid = {
      code: "room-501",
      type: "MEETING_ROOM",
      nameTh: "ห้องประชุม 501",
      nameEn: "Meeting Room 501",
      capacity: 30,
      equipment: ["Projector", "Mic"],
      isActive: true,
      sortOrder: 1,
    };
    expect(createFacilitySchema.safeParse(valid).success).toBe(true);
  });

  it("validates update facility data", () => {
    const valid = {
      id: "e0f7e1e6-b088-466d-88f6-166f81dc97f2",
      code: "room-501-renovated",
      type: "MEETING_ROOM",
      nameTh: "ห้องประชุม 501 (ปรับปรุงใหม่)",
      nameEn: "Meeting Room 501 (Renovated)",
      capacity: 35,
      equipment: ["Projector 4K", "Wireless Mic"],
      isActive: true,
      sortOrder: 2,
    };
    expect(updateFacilitySchema.safeParse(valid).success).toBe(true);
  });

  it("validates reservation times (endTime must be after startTime)", () => {
    const start = new Date("2026-09-15T09:00:00Z");
    const end = new Date("2026-09-15T12:00:00Z");

    const validRes = {
      facilityId: "e0f7e1e6-b088-466d-88f6-166f81dc97f2",
      reservedByName: "สมศักดิ์ นวัตกรรม",
      reservedByEmail: "somsak@fms.ac.th",
      reservedByPhone: "081-999-8888",
      title: "การประชุมฝ่าย",
      startTime: start,
      endTime: end,
      attendeeCount: 10,
    };
    expect(createReservationSchema.safeParse(validRes).success).toBe(true);

    const invalidTimes = {
      ...validRes,
      startTime: end,
      endTime: start,
    };
    expect(createReservationSchema.safeParse(invalidTimes).success).toBe(false);
  });

  it("rejects invalid emails and zero attendee count", () => {
    const start = new Date("2026-09-15T09:00:00Z");
    const end = new Date("2026-09-15T12:00:00Z");

    const invalidEmail = {
      facilityId: "e0f7e1e6-b088-466d-88f6-166f81dc97f2",
      reservedByName: "สมศักดิ์",
      reservedByEmail: "not-an-email",
      reservedByPhone: "081-999-8888",
      title: "หัวข้อประชุม",
      startTime: start,
      endTime: end,
      attendeeCount: 1,
    };
    expect(createReservationSchema.safeParse(invalidEmail).success).toBe(false);

    const zeroAttendee = {
      ...invalidEmail,
      reservedByEmail: "test@fms.ac.th",
      attendeeCount: 0,
    };
    expect(createReservationSchema.safeParse(zeroAttendee).success).toBe(false);
  });

  it("validates review reservation input", () => {
    const validApproved = {
      id: "e0f7e1e6-b088-466d-88f6-166f81dc97f2",
      status: "APPROVED",
      reviewNote: "อนุมัติการใช้งาน",
    };
    expect(reviewReservationSchema.safeParse(validApproved).success).toBe(true);

    const validRejected = {
      id: "e0f7e1e6-b088-466d-88f6-166f81dc97f2",
      status: "REJECTED",
      reviewNote: "ติดภารกิจสำคัญของคณะ",
    };
    expect(reviewReservationSchema.safeParse(validRejected).success).toBe(true);
  });
});
