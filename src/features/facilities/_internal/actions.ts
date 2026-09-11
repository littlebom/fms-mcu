"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission, resolveDefaultTenantId } from "@/features/identity/server";
import type { FacilityType, ReservationStatus } from "@/generated/prisma";
import { FACILITY_P } from "../permissions";
import {
  createFacilitySchema,
  updateFacilitySchema,
  createReservationSchema,
  reviewReservationSchema,
} from "./validations";
import {
  createFacility,
  updateFacility,
  deleteFacility,
  listAdminFacilities,
  listReservations,
  createReservation,
  reviewReservation,
  cancelReservation,
  type FacilityDto,
  type ReservationDto,
} from "./services";

export async function getAdminFacilitiesAction(options?: {
  type?: FacilityType;
  search?: string;
}): Promise<ActionResult<FacilityDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITY_P.facilityRead);
    return listAdminFacilities(ctx.tenantId, options);
  });
}

export async function createFacilityAction(input: unknown): Promise<ActionResult<FacilityDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITY_P.facilityWrite);
    const parsed = createFacilitySchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createFacility(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/facilities");
    return result;
  });
}

export async function updateFacilityAction(input: unknown): Promise<ActionResult<FacilityDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITY_P.facilityWrite);
    const parsed = updateFacilitySchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateFacility(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/facilities");
    return result;
  });
}

export async function deleteFacilityAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITY_P.facilityManage);
    await deleteFacility(ctx.tenantId, id, ctx.userId);
    revalidatePath("/facilities");
  });
}

export async function getReservationsAction(options?: {
  facilityId?: string;
  status?: ReservationStatus;
}): Promise<ActionResult<ReservationDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITY_P.reservationRead);
    return listReservations(ctx.tenantId, options);
  });
}

export async function submitReservationAction(
  input: unknown
): Promise<ActionResult<ReservationDto>> {
  return runAction(async () => {
    const tenantId = await resolveDefaultTenantId();
    const parsed = createReservationSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createReservation(tenantId, parsed);
    revalidatePath("/facilities");
    revalidatePath("/reservations");
    return result;
  });
}

export async function reviewReservationAction(input: unknown): Promise<ActionResult<ReservationDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITY_P.reservationApprove);
    const parsed = reviewReservationSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await reviewReservation(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/facilities");
    revalidatePath("/reservations");
    return result;
  });
}

export async function cancelReservationAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITY_P.reservationRequest);
    await cancelReservation(ctx.tenantId, id, ctx.userId);
    revalidatePath("/facilities");
    revalidatePath("/reservations");
  });
}
