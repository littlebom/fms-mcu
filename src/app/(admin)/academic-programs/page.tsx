import { requirePermission, hasPermission } from "@/features/identity/server";
import { CURRICULUM_P, listAdminPrograms } from "@/features/curriculum/server";
import { listDepartments } from "@/features/staff/server";
import { ProgramsClient } from "./_components/programs-client";

export default async function AcademicProgramsAdminPage() {
  const ctx = await requirePermission(CURRICULUM_P.curriculumRead);
  const [initialPrograms, departments] = await Promise.all([
    listAdminPrograms(ctx.tenantId),
    listDepartments(ctx.tenantId),
  ]);

  return (
    <ProgramsClient
      initialPrograms={initialPrograms}
      departments={departments}
      canWrite={hasPermission(ctx, CURRICULUM_P.curriculumWrite)}
      canManage={hasPermission(ctx, CURRICULUM_P.curriculumManage)}
    />
  );
}
