import { requirePermission, hasPermission } from "@/features/identity/server";
import { FACILITY_P, listAdminFacilities } from "@/features/facilities/server";
import { FacilitiesClient } from "./_components/facilities-client";

export default async function AdminFacilitiesPage() {
  const ctx = await requirePermission(FACILITY_P.facilityRead);
  const initialFacilities = await listAdminFacilities(ctx.tenantId);

  return (
    <FacilitiesClient
      initialFacilities={initialFacilities}
      canWrite={hasPermission(ctx, FACILITY_P.facilityWrite)}
      canManage={hasPermission(ctx, FACILITY_P.facilityManage)}
    />
  );
}
