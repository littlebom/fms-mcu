import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ChevronRight, Newspaper, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/shared/lib/format";
import type { TFunction } from "@/shared/lib/i18n/translate";
import type { Locale } from "@/shared/lib/i18n/config";
import type { ArticleDto } from "@/features/news";

interface LatestNewsSectionProps {
  t: TFunction;
  locale: Locale;
  articles: ArticleDto[];
}

export function LatestNewsSection({ t, locale, articles }: LatestNewsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-primary">
            {t("portal.news.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            {t("portal.news.heading")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("portal.news.subheading")}
          </p>
        </div>
        <Link href="/articles">
          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
            <span>{t("portal.news.viewAll")}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="liyon-card text-center py-12 rounded-[8px]">
          <Newspaper className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
          <p className="text-sm text-muted-foreground">{t("portal.news.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((item) => (
            <Link
              key={item.id}
              href={`/articles/${item.slug}`}
              className="liyon-card liyon-card-hover group flex flex-col rounded-[8px] overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {item.coverImageUrl ? (
                  <Image
                    src={item.coverImageUrl}
                    alt={locale === "th" ? item.titleTh : item.titleEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <Newspaper className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-sm text-foreground shadow-sm">
                    {locale === "th" ? item.categoryNameTh : item.categoryNameEn}
                  </span>
                  {item.isPinned && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm inline-flex items-center gap-1">
                      <Pin className="h-3 w-3" />
                      <span>{locale === "th" ? "ปักหมุด" : "Pinned"}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {item.publishedAt ? formatDate(new Date(item.publishedAt), locale) : "-"}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2">
                    {locale === "th" ? item.titleTh : item.titleEn}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {locale === "th" ? item.excerptTh : item.excerptEn}
                  </p>
                </div>

                <div className="pt-2 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>{locale === "th" ? "อ่านต่อ..." : "Read More..."}</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
