import type { PermissionDef } from "@/shared/lib/permission-def";

export const FACILITY_P = {
  facilityRead: "facility:read",
  facilityWrite: "facility:write",
  reservationRead: "reservation:read",
  reservationRequest: "reservation:request",
  reservationApprove: "reservation:approve",
  facilityManage: "facility:manage",
} as const;

export const FACILITY_PERMISSIONS: readonly PermissionDef[] = [
  {
    code: FACILITY_P.facilityRead,
    module: "facilities",
    action: "read",
    description: "ดูข้อมูลห้องและยานพาหนะ (View facilities and vehicles)",
  },
  {
    code: FACILITY_P.facilityWrite,
    module: "facilities",
    action: "write",
    description: "จัดการข้อมูลห้องและสถานที่ (Create and edit facilities)",
  },
  {
    code: FACILITY_P.reservationRead,
    module: "facilities",
    action: "reservation_read",
    description: "ดูรายการขอใช้บริการ (View reservations)",
  },
  {
    code: FACILITY_P.reservationRequest,
    module: "facilities",
    action: "reservation_request",
    description: "ส่งคำขอจองห้องและยานพาหนะ (Submit reservation requests)",
  },
  {
    code: FACILITY_P.reservationApprove,
    module: "facilities",
    action: "reservation_approve",
    description: "พิจารณาอนุมัติคำขอจอง (Approve or reject reservations)",
  },
  {
    code: FACILITY_P.facilityManage,
    module: "facilities",
    action: "manage",
    description: "จัดการระบบสถานที่และยานพาหนะทั้งหมด (Manage all facilities and reservations)",
  },
];
