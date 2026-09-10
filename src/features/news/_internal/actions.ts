"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { NEWS_P } from "../permissions";
import { createArticleSchema, updateArticleSchema } from "./validations";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  listAdminArticles,
  type ArticleDto,
} from "./services";

export async function getAdminArticlesAction(options?: {
  categoryId?: string;
  status?: string;
  search?: string;
}): Promise<ActionResult<ArticleDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsRead);
    return listAdminArticles(ctx.tenantId, options);
  });
}

export async function createArticleAction(input: unknown): Promise<ActionResult<ArticleDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsWrite);
    const parsed = createArticleSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createArticle(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/news");
    revalidatePath("/(portal)", "page");
    revalidatePath("/(portal)/news", "page");
    return result;
  });
}

export async function updateArticleAction(input: unknown): Promise<ActionResult<ArticleDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsWrite);
    const parsed = updateArticleSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateArticle(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/news");
    revalidatePath("/(portal)", "page");
    revalidatePath("/(portal)/news", "page");
    return result;
  });
}

export async function deleteArticleAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsManage);
    await deleteArticle(ctx.tenantId, id, ctx.userId);
    revalidatePath("/news");
    revalidatePath("/(portal)", "page");
    revalidatePath("/(portal)/news", "page");
  });
}
