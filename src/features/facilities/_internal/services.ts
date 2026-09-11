import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma, FacilityType, ReservationStatus } from "@/generated/prisma";
import { writeAudit } from "@/features/identity/server";
import { errors } from "@/shared/lib/errors";
import type {
  CreateFacilityInput,
  UpdateFacilityInput,
  CreateReservationInput,
  ReviewReservationInput,
} from "./validations";

export interface FacilityDto {
  id: string;
  tenantId: string;
  code: string;
  type: FacilityType;
  nameTh: string;
  nameEn: string;
  location: string | null;
  capacity: number;
  equipment: string[];
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationDto {
  id: string;
  tenantId: string;
  facilityId: string;
  facilityNameTh: string;
  facilityNameEn: string;
  facilityType: FacilityType;
  facilityLocation: string | null;
  userId: string | null;
  reservedByName: string;
  reservedByEmail: string;
  reservedByPhone: string;
  reservedByDept: string | null;
  title: string;
  description: string | null;
  attendeeCount: number;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function listPublicFacilities(
  tenantId: string,
  options?: { type?: FacilityType }
): Promise<FacilityDto[]> {
  const where: Prisma.FacilityWhereInput = {
    tenantId,
    isActive: true,
    ...(options?.type ? { type: options.type } : {}),
  };

  const facilities = await prisma.facility.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { nameTh: "asc" }],
  });

  return facilities.map((f) => ({
    id: f.id,
    tenantId: f.tenantId,
    code: f.code,
    type: f.type,
    nameTh: f.nameTh,
    nameEn: f.nameEn,
    location: f.location,
    capacity: f.capacity,
    equipment: (f.equipment as string[]) || [],
    imageUrl: f.imageUrl,
    isActive: f.isActive,
    sortOrder: f.sortOrder,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));
}

export async function listAdminFacilities(
  tenantId: string,
  options?: { type?: FacilityType; search?: string }
): Promise<FacilityDto[]> {
  const where: Prisma.FacilityWhereInput = {
    tenantId,
    ...(options?.type ? { type: options.type } : {}),
    ...(options?.search
      ? {
          OR: [
            { nameTh: { contains: options.search, mode: "insensitive" } },
            { nameEn: { contains: options.search, mode: "insensitive" } },
            { code: { contains: options.search, mode: "insensitive" } },
            { location: { contains: options.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const facilities = await prisma.facility.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { nameTh: "asc" }],
  });

  return facilities.map((f) => ({
    id: f.id,
    tenantId: f.tenantId,
    code: f.code,
    type: f.type,
    nameTh: f.nameTh,
    nameEn: f.nameEn,
    location: f.location,
    capacity: f.capacity,
    equipment: (f.equipment as string[]) || [],
    imageUrl: f.imageUrl,
    isActive: f.isActive,
    sortOrder: f.sortOrder,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));
}

export async function getFacilityById(tenantId: string, id: string): Promise<FacilityDto | null> {
  const f = await prisma.facility.findFirst({
    where: { id, tenantId },
  });
  if (!f) return null;

  return {
    id: f.id,
    tenantId: f.tenantId,
    code: f.code,
    type: f.type,
    nameTh: f.nameTh,
    nameEn: f.nameEn,
    location: f.location,
    capacity: f.capacity,
    equipment: (f.equipment as string[]) || [],
    imageUrl: f.imageUrl,
    isActive: f.isActive,
    sortOrder: f.sortOrder,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  };
}

export async function createFacility(
  tenantId: string,
  input: CreateFacilityInput,
  actorId?: string
): Promise<FacilityDto> {
  const created = await prisma.$transaction(async (tx) => {
    const facility = await tx.facility.create({
      data: {
        tenantId,
        code: input.code,
        type: input.type,
        nameTh: input.nameTh,
        nameEn: input.nameEn,
        location: input.location || null,
        capacity: input.capacity,
        equipment: input.equipment,
        imageUrl: input.imageUrl || null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "create",
        entity: "facility",
        entityId: facility.id,
        after: { name: facility.nameTh, code: facility.code },
      },
      tx
    );

    return facility;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    code: created.code,
    type: created.type,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    location: created.location,
    capacity: created.capacity,
    equipment: (created.equipment as string[]) || [],
    imageUrl: created.imageUrl,
    isActive: created.isActive,
    sortOrder: created.sortOrder,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateFacility(
  tenantId: string,
  input: UpdateFacilityInput,
  actorId?: string
): Promise<FacilityDto> {
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.facility.findFirst({
      where: { id: input.id, tenantId },
    });
    if (!existing) throw errors.not_found("Facility not found");

    const facility = await tx.facility.update({
      where: { id: input.id, tenantId },
      data: {
        code: input.code,
        type: input.type,
        nameTh: input.nameTh,
        nameEn: input.nameEn,
        location: input.location || null,
        capacity: input.capacity,
        equipment: input.equipment,
        imageUrl: input.imageUrl || null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "update",
        entity: "facility",
        entityId: facility.id,
        before: { name: existing.nameTh },
        after: { name: facility.nameTh },
      },
      tx
    );

    return facility;
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    code: updated.code,
    type: updated.type,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    location: updated.location,
    capacity: updated.capacity,
    equipment: (updated.equipment as string[]) || [],
    imageUrl: updated.imageUrl,
    isActive: updated.isActive,
    sortOrder: updated.sortOrder,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteFacility(tenantId: string, id: string, actorId?: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.facility.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return;

    await tx.facility.delete({
      where: { id, tenantId },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "delete",
        entity: "facility",
        entityId: id,
        before: { name: existing.nameTh },
      },
      tx
    );
  });
}

export async function listReservations(
  tenantId: string,
  options?: { facilityId?: string; status?: ReservationStatus; userId?: string }
): Promise<ReservationDto[]> {
  const where: Prisma.ReservationWhereInput = {
    tenantId,
    ...(options?.facilityId ? { facilityId: options.facilityId } : {}),
    ...(options?.status ? { status: options.status } : {}),
    ...(options?.userId ? { userId: options.userId } : {}),
  };

  const reservations = await prisma.reservation.findMany({
    where,
    include: { facility: true },
    orderBy: { startTime: "desc" },
  });

  return reservations.map((r) => ({
    id: r.id,
    tenantId: r.tenantId,
    facilityId: r.facilityId,
    facilityNameTh: r.facility.nameTh,
    facilityNameEn: r.facility.nameEn,
    facilityType: r.facility.type,
    facilityLocation: r.facility.location,
    userId: r.userId,
    reservedByName: r.reservedByName,
    reservedByEmail: r.reservedByEmail,
    reservedByPhone: r.reservedByPhone,
    reservedByDept: r.reservedByDept,
    title: r.title,
    description: r.description,
    attendeeCount: r.attendeeCount,
    startTime: r.startTime.toISOString(),
    endTime: r.endTime.toISOString(),
    status: r.status,
    reviewNote: r.reviewNote,
    reviewedAt: r.reviewedAt?.toISOString() || null,
    reviewedById: r.reviewedById,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function createReservation(
  tenantId: string,
  input: CreateReservationInput,
  userId?: string
): Promise<ReservationDto> {
  const created = await prisma.$transaction(async (tx) => {
    const facility = await tx.facility.findFirst({
      where: { id: input.facilityId, tenantId, isActive: true },
    });
    if (!facility) throw errors.not_found("Selected facility is not available");

    // Check overlap with existing approved reservations
    const overlap = await tx.reservation.findFirst({
      where: {
        tenantId,
        facilityId: input.facilityId,
        status: "APPROVED",
        startTime: { lt: input.endTime },
        endTime: { gt: input.startTime },
      },
    });

    if (overlap) {
      throw errors.conflict("สถานที่นี้ถูกจองและอนุมัติแล้วในช่วงเวลาดังกล่าว กรุณาเลือกช่วงเวลาอื่น");
    }

    const reservation = await tx.reservation.create({
      data: {
        tenantId,
        facilityId: input.facilityId,
        userId: userId || null,
        reservedByName: input.reservedByName,
        reservedByEmail: input.reservedByEmail,
        reservedByPhone: input.reservedByPhone,
        reservedByDept: input.reservedByDept || null,
        title: input.title,
        description: input.description || null,
        attendeeCount: input.attendeeCount,
        startTime: input.startTime,
        endTime: input.endTime,
        status: "PENDING",
      },
      include: { facility: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: userId ?? null,
        action: "create",
        entity: "reservation",
        entityId: reservation.id,
        after: { title: reservation.title, facilityId: reservation.facilityId },
      },
      tx
    );

    return reservation;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    facilityId: created.facilityId,
    facilityNameTh: created.facility.nameTh,
    facilityNameEn: created.facility.nameEn,
    facilityType: created.facility.type,
    facilityLocation: created.facility.location,
    userId: created.userId,
    reservedByName: created.reservedByName,
    reservedByEmail: created.reservedByEmail,
    reservedByPhone: created.reservedByPhone,
    reservedByDept: created.reservedByDept,
    title: created.title,
    description: created.description,
    attendeeCount: created.attendeeCount,
    startTime: created.startTime.toISOString(),
    endTime: created.endTime.toISOString(),
    status: created.status,
    reviewNote: created.reviewNote,
    reviewedAt: created.reviewedAt?.toISOString() || null,
    reviewedById: created.reviewedById,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function reviewReservation(
  tenantId: string,
  input: ReviewReservationInput,
  reviewerId?: string
): Promise<ReservationDto> {
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.reservation.findFirst({
      where: { id: input.id, tenantId },
    });
    if (!existing) throw errors.not_found("Reservation not found");

    if (input.status === "APPROVED") {
      // Check overlap
      const overlap = await tx.reservation.findFirst({
        where: {
          tenantId,
          facilityId: existing.facilityId,
          id: { not: existing.id },
          status: "APPROVED",
          startTime: { lt: existing.endTime },
          endTime: { gt: existing.startTime },
        },
      });

      if (overlap) {
        throw errors.conflict("ไม่สามารถอนุมัติได้เนื่องจากมีรายการอนุมัติอื่นซ้อนทับช่วงเวลานี้แล้ว");
      }
    }

    const reservation = await tx.reservation.update({
      where: { id: input.id, tenantId },
      data: {
        status: input.status,
        reviewNote: input.reviewNote || null,
        reviewedAt: new Date(),
        reviewedById: reviewerId || null,
      },
      include: { facility: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: reviewerId ?? null,
        action: input.status.toLowerCase(),
        entity: "reservation",
        entityId: reservation.id,
        before: { status: existing.status },
        after: { status: reservation.status },
      },
      tx
    );

    return reservation;
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    facilityId: updated.facilityId,
    facilityNameTh: updated.facility.nameTh,
    facilityNameEn: updated.facility.nameEn,
    facilityType: updated.facility.type,
    facilityLocation: updated.facility.location,
    userId: updated.userId,
    reservedByName: updated.reservedByName,
    reservedByEmail: updated.reservedByEmail,
    reservedByPhone: updated.reservedByPhone,
    reservedByDept: updated.reservedByDept,
    title: updated.title,
    description: updated.description,
    attendeeCount: updated.attendeeCount,
    startTime: updated.startTime.toISOString(),
    endTime: updated.endTime.toISOString(),
    status: updated.status,
    reviewNote: updated.reviewNote,
    reviewedAt: updated.reviewedAt?.toISOString() || null,
    reviewedById: updated.reviewedById,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function cancelReservation(
  tenantId: string,
  id: string,
  actorId?: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.reservation.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return;

    await tx.reservation.update({
      where: { id, tenantId },
      data: { status: "CANCELLED" },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "cancel",
        entity: "reservation",
        entityId: id,
        before: { status: existing.status },
        after: { status: "CANCELLED" },
      },
      tx
    );
  });
}
