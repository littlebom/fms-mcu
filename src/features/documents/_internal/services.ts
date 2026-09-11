import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma, DocumentTarget } from "@/generated/prisma";
import { writeAudit } from "@/features/identity/server";
import { errors } from "@/shared/lib/errors";
import type { CreateDocumentInput, UpdateDocumentInput } from "./validations";

export interface DocumentCategoryDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string;
  target: DocumentTarget;
  sortOrder: number;
}

export interface DocumentDto {
  id: string;
  tenantId: string;
  categoryId: string;
  categoryNameTh: string;
  categoryNameEn: string;
  categoryTarget: DocumentTarget;
  code: string | null;
  titleTh: string;
  titleEn: string;
  descriptionTh: string | null;
  descriptionEn: string | null;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number | null;
  downloadCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export async function listDocumentCategories(tenantId: string): Promise<DocumentCategoryDto[]> {
  const categories = await prisma.documentCategory.findMany({
    where: { tenantId },
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    tenantId: c.tenantId,
    code: c.code,
    nameTh: c.nameTh,
    nameEn: c.nameEn,
    target: c.target,
    sortOrder: c.sortOrder,
  }));
}

export async function listPublicDocuments(
  tenantId: string,
  options?: { categoryId?: string; target?: DocumentTarget; search?: string }
): Promise<DocumentDto[]> {
  const where: Prisma.DocumentItemWhereInput = {
    tenantId,
    isActive: true,
    ...(options?.categoryId ? { categoryId: options.categoryId } : {}),
    ...(options?.target ? { category: { target: options.target } } : {}),
    ...(options?.search
      ? {
          OR: [
            { titleTh: { contains: options.search, mode: "insensitive" } },
            { titleEn: { contains: options.search, mode: "insensitive" } },
            { code: { contains: options.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const docs = await prisma.documentItem.findMany({
    where,
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return docs.map((d) => ({
    id: d.id,
    tenantId: d.tenantId,
    categoryId: d.categoryId,
    categoryNameTh: d.category.nameTh,
    categoryNameEn: d.category.nameEn,
    categoryTarget: d.category.target,
    code: d.code,
    titleTh: d.titleTh,
    titleEn: d.titleEn,
    descriptionTh: d.descriptionTh,
    descriptionEn: d.descriptionEn,
    fileUrl: d.fileUrl,
    fileType: d.fileType,
    fileSizeBytes: d.fileSizeBytes,
    downloadCount: d.downloadCount,
    isActive: d.isActive,
    sortOrder: d.sortOrder,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }));
}

export async function listAdminDocuments(
  tenantId: string,
  options?: { categoryId?: string; search?: string }
): Promise<DocumentDto[]> {
  const where: Prisma.DocumentItemWhereInput = {
    tenantId,
    ...(options?.categoryId ? { categoryId: options.categoryId } : {}),
    ...(options?.search
      ? {
          OR: [
            { titleTh: { contains: options.search, mode: "insensitive" } },
            { titleEn: { contains: options.search, mode: "insensitive" } },
            { code: { contains: options.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const docs = await prisma.documentItem.findMany({
    where,
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return docs.map((d) => ({
    id: d.id,
    tenantId: d.tenantId,
    categoryId: d.categoryId,
    categoryNameTh: d.category.nameTh,
    categoryNameEn: d.category.nameEn,
    categoryTarget: d.category.target,
    code: d.code,
    titleTh: d.titleTh,
    titleEn: d.titleEn,
    descriptionTh: d.descriptionTh,
    descriptionEn: d.descriptionEn,
    fileUrl: d.fileUrl,
    fileType: d.fileType,
    fileSizeBytes: d.fileSizeBytes,
    downloadCount: d.downloadCount,
    isActive: d.isActive,
    sortOrder: d.sortOrder,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }));
}

export async function incrementDownloadCount(tenantId: string, id: string): Promise<void> {
  await prisma.documentItem.updateMany({
    where: { id, tenantId },
    data: { downloadCount: { increment: 1 } },
  });
}

export async function createDocument(
  tenantId: string,
  input: CreateDocumentInput,
  actorId?: string
): Promise<DocumentDto> {
  const created = await prisma.$transaction(async (tx) => {
    const doc = await tx.documentItem.create({
      data: {
        tenantId,
        categoryId: input.categoryId,
        code: input.code || null,
        titleTh: input.titleTh,
        titleEn: input.titleEn,
        descriptionTh: input.descriptionTh || null,
        descriptionEn: input.descriptionEn || null,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSizeBytes: input.fileSizeBytes ?? null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
      include: { category: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "create",
        entity: "document_item",
        entityId: doc.id,
        after: { title: doc.titleTh, code: doc.code },
      },
      tx
    );

    return doc;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    categoryId: created.categoryId,
    categoryNameTh: created.category.nameTh,
    categoryNameEn: created.category.nameEn,
    categoryTarget: created.category.target,
    code: created.code,
    titleTh: created.titleTh,
    titleEn: created.titleEn,
    descriptionTh: created.descriptionTh,
    descriptionEn: created.descriptionEn,
    fileUrl: created.fileUrl,
    fileType: created.fileType,
    fileSizeBytes: created.fileSizeBytes,
    downloadCount: created.downloadCount,
    isActive: created.isActive,
    sortOrder: created.sortOrder,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateDocument(
  tenantId: string,
  input: UpdateDocumentInput,
  actorId?: string
): Promise<DocumentDto> {
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.documentItem.findFirst({
      where: { id: input.id, tenantId },
    });
    if (!existing) throw errors.not_found("Document not found");

    const doc = await tx.documentItem.update({
      where: { id: input.id, tenantId },
      data: {
        categoryId: input.categoryId,
        code: input.code || null,
        titleTh: input.titleTh,
        titleEn: input.titleEn,
        descriptionTh: input.descriptionTh || null,
        descriptionEn: input.descriptionEn || null,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSizeBytes: input.fileSizeBytes ?? null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
      include: { category: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "update",
        entity: "document_item",
        entityId: doc.id,
        before: { title: existing.titleTh },
        after: { title: doc.titleTh },
      },
      tx
    );

    return doc;
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    categoryId: updated.categoryId,
    categoryNameTh: updated.category.nameTh,
    categoryNameEn: updated.category.nameEn,
    categoryTarget: updated.category.target,
    code: updated.code,
    titleTh: updated.titleTh,
    titleEn: updated.titleEn,
    descriptionTh: updated.descriptionTh,
    descriptionEn: updated.descriptionEn,
    fileUrl: updated.fileUrl,
    fileType: updated.fileType,
    fileSizeBytes: updated.fileSizeBytes,
    downloadCount: updated.downloadCount,
    isActive: updated.isActive,
    sortOrder: updated.sortOrder,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteDocument(tenantId: string, id: string, actorId?: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.documentItem.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return;

    await tx.documentItem.delete({
      where: { id, tenantId },
    });

    await writeAudit(
      {
        tenantId,
        actorId: actorId ?? null,
        action: "delete",
        entity: "document_item",
        entityId: id,
        before: { title: existing.titleTh },
      },
      tx
    );
  });
}
