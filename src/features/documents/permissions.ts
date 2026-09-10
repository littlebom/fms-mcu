import type { PermissionDef } from "@/shared/lib/permission-def";

export const DOC_P = {
  documentRead: "document:read",
  documentWrite: "document:write",
  documentManage: "document:manage",
} as const;

export const DOCUMENT_PERMISSIONS: readonly PermissionDef[] = [
  {
    code: DOC_P.documentRead,
    module: "documents",
    action: "read",
    description: "ดูเอกสารและแบบฟอร์ม (View documents and forms)",
  },
  {
    code: DOC_P.documentWrite,
    module: "documents",
    action: "write",
    description: "อัปโหลดและแก้ไขเอกสาร (Upload and edit documents)",
  },
  {
    code: DOC_P.documentManage,
    module: "documents",
    action: "manage",
    description: "จัดการเอกสารและหมวดหมู่ทั้งหมด (Manage all documents and categories)",
  },
];
