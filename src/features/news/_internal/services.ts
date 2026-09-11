import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma } from "@/generated/prisma";
import { writeAudit } from "@/features/identity/server";
import { errors } from "@/shared/lib/errors";
import type { CreateArticleInput, UpdateArticleInput, ArticleCategoryInput } from "./validations";

export interface ArticleCategoryDto {
  id: string;
  nameTh: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
}

export interface ArticleDto {
  id: string;
  tenantId: string;
  categoryId: string;
  categoryNameTh: string;
  categoryNameEn: string;
  categorySlug: string;
  authorId: string;
  authorName: string;
  titleTh: string;
  titleEn: string;
  slug: string;
  excerptTh: string | null;
  excerptEn: string | null;
  contentTh: string;
  contentEn: string;
  coverImageUrl: string | null;
  isPinned: boolean;
  isFeatured: boolean;
  status: string;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function listArticleCategories(tenantId: string): Promise<ArticleCategoryDto[]> {
  const cats = await prisma.articleCategory.findMany({
    where: { tenantId },
    orderBy: { sortOrder: "asc" },
  });
  return cats.map((c) => ({
    id: c.id,
    nameTh: c.nameTh,
    nameEn: c.nameEn,
    slug: c.slug,
    sortOrder: c.sortOrder,
  }));
}

export async function upsertArticleCategory(tenantId: string, input: ArticleCategoryInput): Promise<ArticleCategoryDto> {
  const cat = await prisma.articleCategory.upsert({
    where: { tenantId_slug: { tenantId, slug: input.slug } },
    update: {
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      sortOrder: input.sortOrder,
    },
    create: {
      tenantId,
      slug: input.slug,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      sortOrder: input.sortOrder,
    },
  });
  return {
    id: cat.id,
    nameTh: cat.nameTh,
    nameEn: cat.nameEn,
    slug: cat.slug,
    sortOrder: cat.sortOrder,
  };
}

export async function listPublishedArticles(
  tenantId: string,
  options?: { categorySlug?: string; limit?: number; featuredOnly?: boolean }
): Promise<ArticleDto[]> {
  const now = new Date();
  const where: Prisma.ArticleWhereInput = {
    tenantId,
    status: "PUBLISHED",
    OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
    ...(options?.featuredOnly ? { isFeatured: true } : {}),
    ...(options?.categorySlug ? { category: { slug: options.categorySlug } } : {}),
  };

  const articles = await prisma.article.findMany({
    where,
    include: {
      category: true,
      author: true,
    },
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take: options?.limit,
  });

  return articles.map((a) => ({
    id: a.id,
    tenantId: a.tenantId,
    categoryId: a.categoryId,
    categoryNameTh: a.category.nameTh,
    categoryNameEn: a.category.nameEn,
    categorySlug: a.category.slug,
    authorId: a.authorId,
    authorName: a.author.name,
    titleTh: a.titleTh,
    titleEn: a.titleEn,
    slug: a.slug,
    excerptTh: a.excerptTh,
    excerptEn: a.excerptEn,
    contentTh: a.contentTh,
    contentEn: a.contentEn,
    coverImageUrl: a.coverImageUrl,
    isPinned: a.isPinned,
    isFeatured: a.isFeatured,
    status: a.status,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    viewCount: a.viewCount,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function getArticleBySlug(tenantId: string, slug: string): Promise<ArticleDto | null> {
  const a = await prisma.article.findFirst({
    where: { tenantId, slug, status: "PUBLISHED" },
    include: {
      category: true,
      author: true,
    },
  });
  if (!a) return null;

  // Increment view count asynchronously
  prisma.article
    .update({
      where: { id: a.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  return {
    id: a.id,
    tenantId: a.tenantId,
    categoryId: a.categoryId,
    categoryNameTh: a.category.nameTh,
    categoryNameEn: a.category.nameEn,
    categorySlug: a.category.slug,
    authorId: a.authorId,
    authorName: a.author.name,
    titleTh: a.titleTh,
    titleEn: a.titleEn,
    slug: a.slug,
    excerptTh: a.excerptTh,
    excerptEn: a.excerptEn,
    contentTh: a.contentTh,
    contentEn: a.contentEn,
    coverImageUrl: a.coverImageUrl,
    isPinned: a.isPinned,
    isFeatured: a.isFeatured,
    status: a.status,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    viewCount: a.viewCount + 1,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function listAdminArticles(
  tenantId: string,
  options?: { categoryId?: string; status?: string; search?: string }
): Promise<ArticleDto[]> {
  const where: Prisma.ArticleWhereInput = {
    tenantId,
    ...(options?.categoryId ? { categoryId: options.categoryId } : {}),
    ...(options?.status ? { status: options.status } : {}),
    ...(options?.search
      ? {
          OR: [
            { titleTh: { contains: options.search, mode: "insensitive" } },
            { titleEn: { contains: options.search, mode: "insensitive" } },
            { slug: { contains: options.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const articles = await prisma.article.findMany({
    where,
    include: {
      category: true,
      author: true,
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return articles.map((a) => ({
    id: a.id,
    tenantId: a.tenantId,
    categoryId: a.categoryId,
    categoryNameTh: a.category.nameTh,
    categoryNameEn: a.category.nameEn,
    categorySlug: a.category.slug,
    authorId: a.authorId,
    authorName: a.author.name,
    titleTh: a.titleTh,
    titleEn: a.titleEn,
    slug: a.slug,
    excerptTh: a.excerptTh,
    excerptEn: a.excerptEn,
    contentTh: a.contentTh,
    contentEn: a.contentEn,
    coverImageUrl: a.coverImageUrl,
    isPinned: a.isPinned,
    isFeatured: a.isFeatured,
    status: a.status,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    viewCount: a.viewCount,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function getArticleById(tenantId: string, id: string): Promise<ArticleDto | null> {
  const a = await prisma.article.findFirst({
    where: { id, tenantId },
    include: { category: true, author: true },
  });
  if (!a) return null;

  return {
    id: a.id,
    tenantId: a.tenantId,
    categoryId: a.categoryId,
    categoryNameTh: a.category.nameTh,
    categoryNameEn: a.category.nameEn,
    categorySlug: a.category.slug,
    authorId: a.authorId,
    authorName: a.author.name,
    titleTh: a.titleTh,
    titleEn: a.titleEn,
    slug: a.slug,
    excerptTh: a.excerptTh,
    excerptEn: a.excerptEn,
    contentTh: a.contentTh,
    contentEn: a.contentEn,
    coverImageUrl: a.coverImageUrl,
    isPinned: a.isPinned,
    isFeatured: a.isFeatured,
    status: a.status,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    viewCount: a.viewCount,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function createArticle(
  tenantId: string,
  input: CreateArticleInput,
  authorId: string
): Promise<ArticleDto> {
  const publishedAt = input.status === "PUBLISHED" ? (input.publishedAt ?? new Date()) : null;

  const created = await prisma.$transaction(async (tx) => {
    const article = await tx.article.create({
      data: {
        tenantId,
        authorId,
        categoryId: input.categoryId,
        titleTh: input.titleTh,
        titleEn: input.titleEn,
        slug: input.slug,
        excerptTh: input.excerptTh ?? null,
        excerptEn: input.excerptEn ?? null,
        contentTh: input.contentTh,
        contentEn: input.contentEn,
        coverImageUrl: input.coverImageUrl || null,
        isPinned: input.isPinned,
        isFeatured: input.isFeatured,
        status: input.status,
        publishedAt,
      },
      include: { category: true, author: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId: authorId,
        action: "create",
        entity: "article",
        entityId: article.id,
        after: { title: article.titleTh, slug: article.slug, status: article.status },
      },
      tx
    );

    return article;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    categoryId: created.categoryId,
    categoryNameTh: created.category.nameTh,
    categoryNameEn: created.category.nameEn,
    categorySlug: created.category.slug,
    authorId: created.authorId,
    authorName: created.author.name,
    titleTh: created.titleTh,
    titleEn: created.titleEn,
    slug: created.slug,
    excerptTh: created.excerptTh,
    excerptEn: created.excerptEn,
    contentTh: created.contentTh,
    contentEn: created.contentEn,
    coverImageUrl: created.coverImageUrl,
    isPinned: created.isPinned,
    isFeatured: created.isFeatured,
    status: created.status,
    publishedAt: created.publishedAt ? created.publishedAt.toISOString() : null,
    viewCount: created.viewCount,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateArticle(
  tenantId: string,
  input: UpdateArticleInput,
  actorId: string
): Promise<ArticleDto> {
  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.article.findFirst({
      where: { id: input.id, tenantId },
    });
    if (!existing) throw errors.not_found("Article not found");

    let publishedAt = existing.publishedAt;
    if (input.status === "PUBLISHED" && !publishedAt) {
      publishedAt = input.publishedAt ?? new Date();
    }

    const article = await tx.article.update({
      where: { id: input.id, tenantId },
      data: {
        categoryId: input.categoryId,
        titleTh: input.titleTh,
        titleEn: input.titleEn,
        slug: input.slug,
        excerptTh: input.excerptTh ?? null,
        excerptEn: input.excerptEn ?? null,
        contentTh: input.contentTh,
        contentEn: input.contentEn,
        coverImageUrl: input.coverImageUrl || null,
        isPinned: input.isPinned,
        isFeatured: input.isFeatured,
        status: input.status,
        publishedAt,
      },
      include: { category: true, author: true },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "update",
        entity: "article",
        entityId: article.id,
        before: { title: existing.titleTh, status: existing.status },
        after: { title: article.titleTh, status: article.status },
      },
      tx
    );

    return article;
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    categoryId: updated.categoryId,
    categoryNameTh: updated.category.nameTh,
    categoryNameEn: updated.category.nameEn,
    categorySlug: updated.category.slug,
    authorId: updated.authorId,
    authorName: updated.author.name,
    titleTh: updated.titleTh,
    titleEn: updated.titleEn,
    slug: updated.slug,
    excerptTh: updated.excerptTh,
    excerptEn: updated.excerptEn,
    contentTh: updated.contentTh,
    contentEn: updated.contentEn,
    coverImageUrl: updated.coverImageUrl,
    isPinned: updated.isPinned,
    isFeatured: updated.isFeatured,
    status: updated.status,
    publishedAt: updated.publishedAt ? updated.publishedAt.toISOString() : null,
    viewCount: updated.viewCount,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteArticle(tenantId: string, id: string, actorId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.article.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return;

    await tx.article.delete({
      where: { id, tenantId },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "delete",
        entity: "article",
        entityId: id,
        before: { title: existing.titleTh },
      },
      tx
    );
  });
}
