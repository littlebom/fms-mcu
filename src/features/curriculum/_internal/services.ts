import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma, DegreeLevel, StudyType } from "@/generated/prisma";
import { writeAudit } from "@/features/identity/server";
import { errors } from "@/shared/lib/errors";
import type { CreateProgramInput, UpdateProgramInput } from "./validations";

export interface ProgramDto {
  id: string;
  tenantId: string;
  departmentId: string;
  departmentNameTh: string;
  departmentNameEn: string;
  code: string;
  degreeLevel: DegreeLevel;
  studyType: StudyType;
  nameTh: string;
  nameEn: string;
  degreeNameTh: string;
  degreeNameEn: string;
  totalCredits: number;
  tuitionFee: string | null;
  durationYears: number;
  descriptionTh: string | null;
  descriptionEn: string | null;
  philosophyTh: string | null;
  philosophyEn: string | null;
  careerPaths: string[];
  coverImageUrl: string | null;
  brochureUrl: string | null;
  curriculumPdfUrl: string | null;
  applicationUrl: string | null;
  isOpenAdmissions: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export async function listPublicPrograms(
  tenantId: string,
  options?: { degreeLevel?: DegreeLevel; departmentId?: string }
): Promise<ProgramDto[]> {
  const where: Prisma.AcademicProgramWhereInput = {
    tenantId,
    isActive: true,
    ...(options?.degreeLevel ? { degreeLevel: options.degreeLevel } : {}),
    ...(options?.departmentId ? { departmentId: options.departmentId } : {}),
  };

  const programs = await prisma.academicProgram.findMany({
    where,
    include: { department: true },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
  });

  return programs.map((p) => ({
    id: p.id,
    tenantId: p.tenantId,
    departmentId: p.departmentId,
    departmentNameTh: p.department.nameTh,
    departmentNameEn: p.department.nameEn,
    code: p.code,
    degreeLevel: p.degreeLevel,
    studyType: p.studyType,
    nameTh: p.nameTh,
    nameEn: p.nameEn,
    degreeNameTh: p.degreeNameTh,
    degreeNameEn: p.degreeNameEn,
    totalCredits: p.totalCredits,
    tuitionFee: p.tuitionFee,
    durationYears: Number(p.durationYears),
    descriptionTh: p.descriptionTh,
    descriptionEn: p.descriptionEn,
    philosophyTh: p.philosophyTh,
    philosophyEn: p.philosophyEn,
    careerPaths: (p.careerPaths as string[]) || [],
    coverImageUrl: p.coverImageUrl,
    brochureUrl: p.brochureUrl,
    curriculumPdfUrl: p.curriculumPdfUrl,
    applicationUrl: p.applicationUrl,
    isOpenAdmissions: p.isOpenAdmissions,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getProgramByCode(tenantId: string, code: string): Promise<ProgramDto | null> {
  const p = await prisma.academicProgram.findFirst({
    where: { tenantId, code, isActive: true },
    include: { department: true },
  });
  if (!p) return null;

  return {
    id: p.id,
    tenantId: p.tenantId,
    departmentId: p.departmentId,
    departmentNameTh: p.department.nameTh,
    departmentNameEn: p.department.nameEn,
    code: p.code,
    degreeLevel: p.degreeLevel,
    studyType: p.studyType,
    nameTh: p.nameTh,
    nameEn: p.nameEn,
    degreeNameTh: p.degreeNameTh,
    degreeNameEn: p.degreeNameEn,
    totalCredits: p.totalCredits,
    tuitionFee: p.tuitionFee,
    durationYears: Number(p.durationYears),
    descriptionTh: p.descriptionTh,
    descriptionEn: p.descriptionEn,
    philosophyTh: p.philosophyTh,
    philosophyEn: p.philosophyEn,
    careerPaths: (p.careerPaths as string[]) || [],
    coverImageUrl: p.coverImageUrl,
    brochureUrl: p.brochureUrl,
    curriculumPdfUrl: p.curriculumPdfUrl,
    applicationUrl: p.applicationUrl,
    isOpenAdmissions: p.isOpenAdmissions,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function getProgramById(tenantId: string, id: string): Promise<ProgramDto | null> {
  const p = await prisma.academicProgram.findFirst({
    where: { tenantId, id },
    include: { department: true },
  });
  if (!p) return null;

  return {
    id: p.id,
    tenantId: p.tenantId,
    departmentId: p.departmentId,
    departmentNameTh: p.department.nameTh,
    departmentNameEn: p.department.nameEn,
    code: p.code,
    degreeLevel: p.degreeLevel,
    studyType: p.studyType,
    nameTh: p.nameTh,
    nameEn: p.nameEn,
    degreeNameTh: p.degreeNameTh,
    degreeNameEn: p.degreeNameEn,
    totalCredits: p.totalCredits,
    tuitionFee: p.tuitionFee,
    durationYears: Number(p.durationYears),
    descriptionTh: p.descriptionTh,
    descriptionEn: p.descriptionEn,
    philosophyTh: p.philosophyTh,
    philosophyEn: p.philosophyEn,
    careerPaths: (p.careerPaths as string[]) || [],
    coverImageUrl: p.coverImageUrl,
    brochureUrl: p.brochureUrl,
    curriculumPdfUrl: p.curriculumPdfUrl,
    applicationUrl: p.applicationUrl,
    isOpenAdmissions: p.isOpenAdmissions,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function listAdminPrograms(
  tenantId: string,
  options?: { degreeLevel?: DegreeLevel; departmentId?: string; search?: string }
): Promise<ProgramDto[]> {
  const where: Prisma.AcademicProgramWhereInput = {
    tenantId,
    ...(options?.degreeLevel ? { degreeLevel: options.degreeLevel } : {}),
    ...(options?.departmentId ? { departmentId: options.departmentId } : {}),
    ...(options?.search
      ? {
          OR: [
            { nameTh: { contains: options.search, mode: "insensitive" } },
            { nameEn: { contains: options.search, mode: "insensitive" } },
            { code: { contains: options.search, mode: "insensitive" } },
            { degreeNameTh: { contains: options.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const programs = await prisma.academicProgram.findMany({
    where,
    include: { department: true },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
  });

  return programs.map((p) => ({
    id: p.id,
    tenantId: p.tenantId,
    departmentId: p.departmentId,
    departmentNameTh: p.department.nameTh,
    departmentNameEn: p.department.nameEn,
    code: p.code,
    degreeLevel: p.degreeLevel,
    studyType: p.studyType,
    nameTh: p.nameTh,
    nameEn: p.nameEn,
    degreeNameTh: p.degreeNameTh,
    degreeNameEn: p.degreeNameEn,
    totalCredits: p.totalCredits,
    tuitionFee: p.tuitionFee,
    durationYears: Number(p.durationYears),
    descriptionTh: p.descriptionTh,
    descriptionEn: p.descriptionEn,
    philosophyTh: p.philosophyTh,
    philosophyEn: p.philosophyEn,
    careerPaths: (p.careerPaths as string[]) || [],
    coverImageUrl: p.coverImageUrl,
    brochureUrl: p.brochureUrl,
    curriculumPdfUrl: p.curriculumPdfUrl,
    applicationUrl: p.applicationUrl,
    isOpenAdmissions: p.isOpenAdmissions,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function createProgram(
  tenantId: string,
  input: CreateProgramInput,
  actorId?: string
): Promise<ProgramDto> {
  const created = await prisma.$transaction(async (tx) => {
    const program = await tx.academicProgram.create({
      data: {
        tenantId,
        departmentId: input.departmentId,
        code: input.code,
        degreeLevel: input.degreeLevel,
        studyType: input.studyType,
        nameTh: input.nameTh,
        nameEn: input.nameEn,
        degreeNameTh: input.degreeNameTh,
        degreeNameEn: input.degreeNameEn,
        totalCredits: input.totalCredits,
        tuitionFee: input.tuitionFee ?? null,
        durationYears: input.durationYears,
        descriptionTh: input.descriptionTh ?? null,
        descriptionEn: input.descriptionEn ?? null,
        philosophyTh: input.philosophyTh ?? null,
        philosophyEn: input.philosophyEn ?? null,
        careerPaths: input.careerPaths,
        coverImageUrl: input.coverImageUrl || null,
        brochureUrl: input.brochureUrl || null,
        curriculumPdfUrl: input.curriculumPdfUrl || null,
        applicationUrl: input.applicationUrl || null,
        isOpenAdmissions: input.isOpenAdmissions,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
      include: { department: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "create",
        entity: "academic_program",
        entityId: program.id,
        after: { code: program.code, name: program.nameTh },
      },
      tx
    );

    return program;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    departmentId: created.departmentId,
    departmentNameTh: created.department.nameTh,
    departmentNameEn: created.department.nameEn,
    code: created.code,
    degreeLevel: created.degreeLevel,
    studyType: created.studyType,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    degreeNameTh: created.degreeNameTh,
    degreeNameEn: created.degreeNameEn,
    totalCredits: created.totalCredits,
    tuitionFee: created.tuitionFee,
    durationYears: Number(created.durationYears),
    descriptionTh: created.descriptionTh,
    descriptionEn: created.descriptionEn,
    philosophyTh: created.philosophyTh,
    philosophyEn: created.philosophyEn,
    careerPaths: (created.careerPaths as string[]) || [],
    coverImageUrl: created.coverImageUrl,
    brochureUrl: created.brochureUrl,
    curriculumPdfUrl: created.curriculumPdfUrl,
    applicationUrl: created.applicationUrl,
    isOpenAdmissions: created.isOpenAdmissions,
    isActive: created.isActive,
    sortOrder: created.sortOrder,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateProgram(
  tenantId: string,
  input: UpdateProgramInput,
  actorId?: string
): Promise<ProgramDto> {
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.academicProgram.findFirst({
      where: { id: input.id, tenantId },
    });
    if (!existing) throw errors.not_found("Academic program not found");

    const program = await tx.academicProgram.update({
      where: { id: input.id, tenantId },
      data: {
        departmentId: input.departmentId,
        code: input.code,
        degreeLevel: input.degreeLevel,
        studyType: input.studyType,
        nameTh: input.nameTh,
        nameEn: input.nameEn,
        degreeNameTh: input.degreeNameTh,
        degreeNameEn: input.degreeNameEn,
        totalCredits: input.totalCredits,
        tuitionFee: input.tuitionFee ?? null,
        durationYears: input.durationYears,
        descriptionTh: input.descriptionTh ?? null,
        descriptionEn: input.descriptionEn ?? null,
        philosophyTh: input.philosophyTh ?? null,
        philosophyEn: input.philosophyEn ?? null,
        careerPaths: input.careerPaths,
        coverImageUrl: input.coverImageUrl || null,
        brochureUrl: input.brochureUrl || null,
        curriculumPdfUrl: input.curriculumPdfUrl || null,
        applicationUrl: input.applicationUrl || null,
        isOpenAdmissions: input.isOpenAdmissions,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
      include: { department: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "update",
        entity: "academic_program",
        entityId: program.id,
        before: { code: existing.code, name: existing.nameTh },
        after: { code: program.code, name: program.nameTh },
      },
      tx
    );

    return program;
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    departmentId: updated.departmentId,
    departmentNameTh: updated.department.nameTh,
    departmentNameEn: updated.department.nameEn,
    code: updated.code,
    degreeLevel: updated.degreeLevel,
    studyType: updated.studyType,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    degreeNameTh: updated.degreeNameTh,
    degreeNameEn: updated.degreeNameEn,
    totalCredits: updated.totalCredits,
    tuitionFee: updated.tuitionFee,
    durationYears: Number(updated.durationYears),
    descriptionTh: updated.descriptionTh,
    descriptionEn: updated.descriptionEn,
    philosophyTh: updated.philosophyTh,
    philosophyEn: updated.philosophyEn,
    careerPaths: (updated.careerPaths as string[]) || [],
    coverImageUrl: updated.coverImageUrl,
    brochureUrl: updated.brochureUrl,
    curriculumPdfUrl: updated.curriculumPdfUrl,
    applicationUrl: updated.applicationUrl,
    isOpenAdmissions: updated.isOpenAdmissions,
    isActive: updated.isActive,
    sortOrder: updated.sortOrder,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteProgram(tenantId: string, id: string, actorId?: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.academicProgram.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return;

    await tx.academicProgram.delete({
      where: { id, tenantId },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "delete",
        entity: "academic_program",
        entityId: id,
        before: { code: existing.code, name: existing.nameTh },
      },
      tx
    );
  });
}
