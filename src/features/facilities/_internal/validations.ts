import { z } from "zod";

export const facilityTypeEnum = z.enum(["MEETING_ROOM", "LABORATORY", "AUDITORIUM", "VEHICLE"]);
export const reservationStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const createFacilitySchema = z.object({
  code: z
    .string()
    .min(2, "รหัสสถานที่ต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "รหัสต้องเป็นตัวพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น"),
  type: facilityTypeEnum.default("MEETING_ROOM"),
  nameTh: z.string().min(2, "ชื่อสถานที่ภาษาไทยต้องมีอย่างน้อย 2 ตัวอักษร").max(255),
  nameEn: z.string().min(2, "Resource name (EN) must be at least 2 characters").max(255),
  location: z.string().max(255).optional().nullable(),
  capacity: z.number().int().positive("ความจุต้องมากกว่า 0").default(10),
  equipment: z.array(z.string()).default([]),
  imageUrl: z.string().url("กรุณากรอก URL รูปภาพที่ถูกต้อง").optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateFacilitySchema = createFacilitySchema.extend({
  id: z.string().uuid("Invalid facility ID"),
});

export const createReservationSchema = z
  .object({
    facilityId: z.string().uuid("กรุณาเลือกสถานที่หรือยานพาหนะ"),
    reservedByName: z.string().min(2, "ชื่อผู้ขอใช้ต้องมีอย่างน้อย 2 ตัวอักษร").max(255),
    reservedByEmail: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง").max(255),
    reservedByPhone: z.string().min(9, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง").max(50),
    reservedByDept: z.string().max(255).optional().nullable(),
    title: z.string().min(3, "หัวข้อการใช้งานต้องมีอย่างน้อย 3 ตัวอักษร").max(255),
    description: z.string().optional().nullable(),
    attendeeCount: z.number().int().positive("จำนวนผู้เข้าร่วมต้องมากกว่า 0").default(1),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น",
    path: ["endTime"],
  });

export const reviewReservationSchema = z.object({
  id: z.string().uuid("Invalid reservation ID"),
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().optional().nullable(),
});

export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityInput = z.infer<typeof updateFacilitySchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type ReviewReservationInput = z.infer<typeof reviewReservationSchema>;
