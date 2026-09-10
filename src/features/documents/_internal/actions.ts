"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { DOC_P } from "../permissions";
import { createDocumentSchema, updateDocumentSchema } from "./validations";
import {
  createDocument,
  updateDocument,
  deleteDocument,
  listAdminDocuments,
  incrementDownloadCount,
  type DocumentDto,
} from "./services";

export async function getAdminDocumentsAction(options?: {
  categoryId?: string;
  search?: string;
}): Promise<ActionResult<DocumentDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.documentRead);
    return listAdminDocuments(ctx.tenantId, options);
  });
}

export async function createDocumentAction(input: unknown): Promise<ActionResult<DocumentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.documentWrite);
    const parsed = createDocumentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createDocument(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/documents");
    return result;
  });
}

export async function updateDocumentAction(input: unknown): Promise<ActionResult<DocumentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.documentWrite);
    const parsed = updateDocumentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateDocument(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/documents");
    return result;
  });
}

export async function deleteDocumentAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.documentManage);
    await deleteDocument(ctx.tenantId, id, ctx.userId);
    revalidatePath("/documents");
  });
}

export async function trackDocumentDownloadAction(
  tenantId: string,
  id: string
): Promise<ActionResult<void>> {
  return runAction(async () => {
    await incrementDownloadCount(tenantId, id);
    revalidatePath("/documents");
  });
}
