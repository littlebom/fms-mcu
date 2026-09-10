import type { PermissionDef } from "@/shared/lib/permission-def";

export const CURRICULUM_P = {
  curriculumRead: "curriculum:read",
  curriculumWrite: "curriculum:write",
  curriculumManage: "curriculum:manage",
} as const;

export const CURRICULUM_PERMISSIONS: readonly PermissionDef[] = [
  { code: CURRICULUM_P.curriculumRead, module: "curriculum", action: "read" },
  { code: CURRICULUM_P.curriculumWrite, module: "curriculum", action: "write" },
  { code: CURRICULUM_P.curriculumManage, module: "curriculum", action: "manage" },
];
