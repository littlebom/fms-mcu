import type { PermissionDef } from "@/shared/lib/permission-def";

export const STAFF_P = {
  staffRead: "staff:read",
  staffWrite: "staff:write",
  staffManage: "staff:manage",
} as const;

export const STAFF_PERMISSIONS: readonly PermissionDef[] = [
  { code: STAFF_P.staffRead, module: "staff", action: "read" },
  { code: STAFF_P.staffWrite, module: "staff", action: "write" },
  { code: STAFF_P.staffManage, module: "staff", action: "manage" },
];
