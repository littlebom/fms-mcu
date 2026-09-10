import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma } from "@/generated/prisma";
import { writeAudit } from "@/features/identity/server";
import type { CreateStaffProfileInput, UpdateStaffProfileInput, DepartmentInput } from "./validations";

export interface DepartmentDto {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
  isAcademic: boolean;
  sortOrder: number;
}

export interface StaffProfileDto {
  id: string;
  tenantId: string;
  userId: string | null;
  departmentId: string;
  departmentNameTh: string;
  departmentNameEn: string;
  prefixTh: string;
  prefixEn: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  positionTh: string;
  positionEn: string;
  email: string;
  phoneExt: string | null;
  roomNumber: string | null;
  avatarUrl: string | null;
  expertises: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function listDepartments(tenantId: string): Promise<DepartmentDto[]> {
  const depts = await prisma.department.findMany({
    where: { tenantId },
    orderBy: { sortOrder: "asc" },
  });
  return depts.map((d) => ({
    id: d.id,
    code: d.code,
    nameTh: d.nameTh,
    nameEn: d.nameEn,
    isAcademic: d.isAcademic,
    sortOrder: d.sortOrder,
  }));
}

export async function upsertDepartment(tenantId: string, input: DepartmentInput): Promise<DepartmentDto> {
  const dept = await prisma.department.upsert({
    where: { tenantId_code: { tenantId, code: input.code } },
    update: {
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      isAcademic: input.isAcademic,
      sortOrder: input.sortOrder,
    },
    create: {
      tenantId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      isAcademic: input.isAcademic,
      sortOrder: input.sortOrder,
    },
  });
  return {
    id: dept.id,
    code: dept.code,
    nameTh: dept.nameTh,
    nameEn: dept.nameEn,
    isAcademic: dept.isAcademic,
    sortOrder: dept.sortOrder,
  };
}

export async function listStaffProfiles(
  tenantId: string,
  options?: { departmentId?: string; activeOnly?: boolean; search?: string }
): Promise<StaffProfileDto[]> {
  const where: Prisma.StaffProfileWhereInput = {
    tenantId,
    ...(options?.departmentId ? { departmentId: options.departmentId } : {}),
    ...(options?.activeOnly ? { isActive: true } : {}),
    ...(options?.search
      ? {
          OR: [
            { firstNameTh: { contains: options.search, mode: "insensitive" } },
            { lastNameTh: { contains: options.search, mode: "insensitive" } },
            { firstNameEn: { contains: options.search, mode: "insensitive" } },
            { lastNameEn: { contains: options.search, mode: "insensitive" } },
            { email: { contains: options.search, mode: "insensitive" } },
            { positionTh: { contains: options.search, mode: "insensitive" } },
            { positionEn: { contains: options.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const staffList = await prisma.staffProfile.findMany({
    where,
    include: {
      department: true,
    },
    orderBy: [{ sortOrder: "asc" }, { firstNameTh: "asc" }],
  });

  return staffList.map((s) => ({
    id: s.id,
    tenantId: s.tenantId,
    userId: s.userId,
    departmentId: s.departmentId,
    departmentNameTh: s.department.nameTh,
    departmentNameEn: s.department.nameEn,
    prefixTh: s.prefixTh,
    prefixEn: s.prefixEn,
    firstNameTh: s.firstNameTh,
    lastNameTh: s.lastNameTh,
    firstNameEn: s.firstNameEn,
    lastNameEn: s.lastNameEn,
    positionTh: s.positionTh,
    positionEn: s.positionEn,
    email: s.email,
    phoneExt: s.phoneExt,
    roomNumber: s.roomNumber,
    avatarUrl: s.avatarUrl,
    expertises: (s.expertises as string[]) || [],
    sortOrder: s.sortOrder,
    isActive: s.isActive,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function getStaffProfileById(tenantId: string, id: string): Promise<StaffProfileDto | null> {
  const s = await prisma.staffProfile.findFirst({
    where: { id, tenantId },
    include: { department: true },
  });
  if (!s) return null;

  return {
    id: s.id,
    tenantId: s.tenantId,
    userId: s.userId,
    departmentId: s.departmentId,
    departmentNameTh: s.department.nameTh,
    departmentNameEn: s.department.nameEn,
    prefixTh: s.prefixTh,
    prefixEn: s.prefixEn,
    firstNameTh: s.firstNameTh,
    lastNameTh: s.lastNameTh,
    firstNameEn: s.firstNameEn,
    lastNameEn: s.lastNameEn,
    positionTh: s.positionTh,
    positionEn: s.positionEn,
    email: s.email,
    phoneExt: s.phoneExt,
    roomNumber: s.roomNumber,
    avatarUrl: s.avatarUrl,
    expertises: (s.expertises as string[]) || [],
    sortOrder: s.sortOrder,
    isActive: s.isActive,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

export async function createStaffProfile(
  tenantId: string,
  input: CreateStaffProfileInput,
  actorId?: string
): Promise<StaffProfileDto> {
  const created = await prisma.$transaction(async (tx) => {
    const profile = await tx.staffProfile.create({
      data: {
        tenantId,
        departmentId: input.departmentId,
        prefixTh: input.prefixTh,
        prefixEn: input.prefixEn,
        firstNameTh: input.firstNameTh,
        lastNameTh: input.lastNameTh,
        firstNameEn: input.firstNameEn,
        lastNameEn: input.lastNameEn,
        positionTh: input.positionTh,
        positionEn: input.positionEn,
        email: input.email.toLowerCase(),
        phoneExt: input.phoneExt ?? null,
        roomNumber: input.roomNumber ?? null,
        avatarUrl: input.avatarUrl || null,
        expertises: input.expertises,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
      },
      include: { department: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "create",
        entity: "staff_profile",
        entityId: profile.id,
        after: { name: `${profile.firstNameTh} ${profile.lastNameTh}`, email: profile.email },
      },
      tx
    );

    return profile;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    userId: created.userId,
    departmentId: created.departmentId,
    departmentNameTh: created.department.nameTh,
    departmentNameEn: created.department.nameEn,
    prefixTh: created.prefixTh,
    prefixEn: created.prefixEn,
    firstNameTh: created.firstNameTh,
    lastNameTh: created.lastNameTh,
    firstNameEn: created.firstNameEn,
    lastNameEn: created.lastNameEn,
    positionTh: created.positionTh,
    positionEn: created.positionEn,
    email: created.email,
    phoneExt: created.phoneExt,
    roomNumber: created.roomNumber,
    avatarUrl: created.avatarUrl,
    expertises: (created.expertises as string[]) || [],
    sortOrder: created.sortOrder,
    isActive: created.isActive,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateStaffProfile(
  tenantId: string,
  input: UpdateStaffProfileInput,
  actorId?: string
): Promise<StaffProfileDto> {
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.staffProfile.findFirst({
      where: { id: input.id, tenantId },
    });
    if (!existing) throw new Error("Staff profile not found");

    const profile = await tx.staffProfile.update({
      where: { id: input.id, tenantId },
      data: {
        departmentId: input.departmentId,
        prefixTh: input.prefixTh,
        prefixEn: input.prefixEn,
        firstNameTh: input.firstNameTh,
        lastNameTh: input.lastNameTh,
        firstNameEn: input.firstNameEn,
        lastNameEn: input.lastNameEn,
        positionTh: input.positionTh,
        positionEn: input.positionEn,
        email: input.email.toLowerCase(),
        phoneExt: input.phoneExt ?? null,
        roomNumber: input.roomNumber ?? null,
        avatarUrl: input.avatarUrl || null,
        expertises: input.expertises,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
      },
      include: { department: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "update",
        entity: "staff_profile",
        entityId: profile.id,
        before: { name: `${existing.firstNameTh} ${existing.lastNameTh}`, email: existing.email },
        after: { name: `${profile.firstNameTh} ${profile.lastNameTh}`, email: profile.email },
      },
      tx
    );

    return profile;
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    userId: updated.userId,
    departmentId: updated.departmentId,
    departmentNameTh: updated.department.nameTh,
    departmentNameEn: updated.department.nameEn,
    prefixTh: updated.prefixTh,
    prefixEn: updated.prefixEn,
    firstNameTh: updated.firstNameTh,
    lastNameTh: updated.lastNameTh,
    firstNameEn: updated.firstNameEn,
    lastNameEn: updated.lastNameEn,
    positionTh: updated.positionTh,
    positionEn: updated.positionEn,
    email: updated.email,
    phoneExt: updated.phoneExt,
    roomNumber: updated.roomNumber,
    avatarUrl: updated.avatarUrl,
    expertises: (updated.expertises as string[]) || [],
    sortOrder: updated.sortOrder,
    isActive: updated.isActive,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteStaffProfile(tenantId: string, id: string, actorId?: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.staffProfile.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return;

    await tx.staffProfile.delete({
      where: { id, tenantId },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "delete",
        entity: "staff_profile",
        entityId: id,
        before: { name: `${existing.firstNameTh} ${existing.lastNameTh}` },
      },
      tx
    );
  });
}
