import Link from "next/link";
import Image from "next/image";
import { getLocale } from "@/shared/lib/i18n/server";
import { formatDate } from "@/shared/lib/format";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { listPublishedArticles, listArticleCategories } from "@/features/news/server";
import { Calendar, Eye, Pin, Newspaper, ChevronRight } from "lucide-react";

export default async function ArticlesPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const locale = await getLocale();
  const tenantId = await resolveDefaultTenantId();
  const { cat } = await searchParams;

  const [categories, articles] = await Promise.all([
    listArticleCategories(tenantId),
    listPublishedArticles(tenantId, { categorySlug: cat }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {locale === "th" ? "ข่าวสารและประกาศประชาสัมพันธ์" : "News & Announcements"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {locale === "th"
            ? "รวมข่าวสารวิชาการ กิจกรรมนักศึกษา ทุนการศึกษา และประกาศสำคัญของคณะ"
            : "Stay updated with our latest academic news, student achievements, and faculty events."}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <Link
          href="/articles"
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
            !cat
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {locale === "th" ? "ทั้งหมด" : "All Articles"}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/articles?cat=${c.slug}`}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
              cat === c.slug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {locale === "th" ? c.nameTh : c.nameEn}
          </Link>
        ))}
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="liyon-card text-center py-20 rounded-2xl">
          <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">
            {locale === "th" ? "ยังไม่มีข่าวสารในหมวดหมู่นี้" : "No articles found in this category"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "th" ? "กรุณาเลือกหมวดหมู่อื่นเพื่อดูข่าวสาร" : "Please select another category"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => (
            <Link
              key={item.id}
              href={`/articles/${item.slug}`}
              className="liyon-card liyon-card-hover group flex flex-col rounded-2xl overflow-hidden"
            >
              <div className="relative h-52 w-full overflow-hidden bg-muted">
                {item.coverImageUrl ? (
                  <Image
                    src={item.coverImageUrl}
                    alt={locale === "th" ? item.titleTh : item.titleEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                      {locale === "th" ? "ปักหมุด" : "Pinned"}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {item.publishedAt ? formatDate(new Date(item.publishedAt), locale) : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{item.viewCount.toLocaleString()}</span>
                    </div>
                  </div>
                  <h2 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {locale === "th" ? item.titleTh : item.titleEn}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {locale === "th" ? item.excerptTh : item.excerptEn}
                  </p>
                </div>

                <div className="pt-2 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>{locale === "th" ? "อ่านรายละเอียด" : "Read Full Article"}</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
