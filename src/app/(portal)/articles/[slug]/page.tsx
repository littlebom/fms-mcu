import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "@/shared/lib/i18n/server";
import { formatDate } from "@/shared/lib/format";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { getArticleBySlug } from "@/features/news/server";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const tenantId = await resolveDefaultTenantId();
  const { slug } = await params;

  const article = await getArticleBySlug(tenantId, slug);
  if (!article) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link href="/articles">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {locale === "th" ? "กลับไปยังข่าวสารทั้งหมด" : "Back to News"}
          </Button>
        </Link>
      </div>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {locale === "th" ? article.categoryNameTh : article.categoryNameEn}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {locale === "th" ? article.titleTh : article.titleEn}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-b border-border pb-6">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              <span>{article.authorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>
                {article.publishedAt ? formatDate(new Date(article.publishedAt), locale) : "-"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span>{article.viewCount.toLocaleString()} ครั้ง</span>
            </div>
          </div>
        </div>

        {article.coverImageUrl && (
          <div className="rounded-3xl overflow-hidden border border-border shadow-md max-h-[500px]">
            <img
              src={article.coverImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {article.excerptTh && (
          <div className="p-6 rounded-2xl bg-muted/50 border-l-4 border-primary italic text-sm sm:text-base text-muted-foreground leading-relaxed">
            {locale === "th" ? article.excerptTh : article.excerptEn}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none text-base text-foreground leading-loose whitespace-pre-line space-y-4">
          {locale === "th" ? article.contentTh : article.contentEn}
        </div>
      </article>

      <div className="pt-8 border-t border-border flex items-center justify-between">
        <Link href="/articles">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {locale === "th" ? "ดูข่าวสารอื่น ๆ" : "Browse More Articles"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
