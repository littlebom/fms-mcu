import { requirePermission, hasPermission } from "@/features/identity/server";
import { FACILITY_P, listReservations, listAdminFacilities } from "@/features/facilities/server";
import { ReservationsClient } from "./_components/reservations-client";

export default async function AdminReservationsPage() {
  const ctx = await requirePermission(FACILITY_P.reservationRead);
  const [initialReservations, facilities] = await Promise.all([
    listReservations(ctx.tenantId),
    listAdminFacilities(ctx.tenantId),
  ]);

  return (
    <ReservationsClient
      initialReservations={initialReservations}
      facilities={facilities}
      canApprove={hasPermission(ctx, FACILITY_P.reservationApprove)}
    />
  );
}
