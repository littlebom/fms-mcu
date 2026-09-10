import { requirePermission, hasPermission } from "@/features/identity/server";
import { NEWS_P, listAdminArticles, listArticleCategories } from "@/features/news/server";
import { NewsClient } from "./_components/news-client";

export default async function NewsAdminPage() {
  const ctx = await requirePermission(NEWS_P.newsRead);
  const [initialArticles, categories] = await Promise.all([
    listAdminArticles(ctx.tenantId),
    listArticleCategories(ctx.tenantId),
  ]);

  return (
    <NewsClient
      initialArticles={initialArticles}
      categories={categories}
      canWrite={hasPermission(ctx, NEWS_P.newsWrite)}
      canPublish={hasPermission(ctx, NEWS_P.newsPublish)}
      canManage={hasPermission(ctx, NEWS_P.newsManage)}
    />
  );
}
