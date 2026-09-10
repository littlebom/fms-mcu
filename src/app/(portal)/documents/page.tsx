import { getLocale } from "@/shared/lib/i18n/server";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { listPublicDocuments, listDocumentCategories } from "@/features/documents/server";
import type { DocumentTarget } from "@/generated/prisma";
import Link from "next/link";
import {
  FileDown,
  FileText,
  Download,
  FolderOpen,
  Users,
  GraduationCap,
  Globe,
} from "lucide-react";

export default async function DocumentsPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ target?: string; cat?: string; q?: string }>;
}) {
  const locale = await getLocale();
  const tenantId = await resolveDefaultTenantId();
  const { target, cat, q } = await searchParams;

  const validTarget =
    target && ["STUDENT", "STAFF", "PUBLIC"].includes(target)
      ? (target as DocumentTarget)
      : undefined;

  const [categories, documents] = await Promise.all([
    listDocumentCategories(tenantId),
    listPublicDocuments(tenantId, {
      target: validTarget,
      categoryId: cat,
      search: q,
    }),
  ]);

  const TARGET_TABS = [
    { id: "ALL", labelTh: "เอกสารทั้งหมด", labelEn: "All Documents", icon: FolderOpen },
    { id: "STUDENT", labelTh: "สำหรับนักศึกษา", labelEn: "For Students", icon: GraduationCap },
    { id: "STAFF", labelTh: "สำหรับบุคลากร", labelEn: "For Staff & Faculty", icon: Users },
    { id: "PUBLIC", labelTh: "ระเบียบและประกาศ", labelEn: "Regulations & Public", icon: Globe },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <FileDown className="h-3.5 w-3.5" />
          <span>{locale === "th" ? "คลังเอกสารและแบบฟอร์ม" : "Document & Forms Center"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {locale === "th"
            ? "ศูนย์ดาวน์โหลดเอกสารและแบบฟอร์มคำร้อง"
            : "Academic Forms & Downloads"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {locale === "th"
            ? "ดาวน์โหลดแบบฟอร์มคำร้องวิชาการ เอกสารลงทะเบียน ข้อบังคับการศึกษา และแบบฟอร์มสนับสนุนการวิจัยของคณะ"
            : "Access standard academic forms, registration requests, institutional regulations, and research grant documents."}
        </p>
      </div>

      {/* Target Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {TARGET_TABS.map((tab) => {
          const isSelected = (!target && tab.id === "ALL") || target === tab.id;
          const href =
            tab.id === "ALL"
              ? cat
                ? `/documents?cat=${cat}`
                : "/documents"
              : cat
              ? `/documents?target=${tab.id}&cat=${cat}`
              : `/documents?target=${tab.id}`;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm scale-100"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{locale === "th" ? tab.labelTh : tab.labelEn}</span>
            </Link>
          );
        })}
      </div>

      {/* Category Filter Chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            {locale === "th" ? "หมวดหมู่:" : "Category:"}
          </span>
          <Link
            href={target ? `/documents?target=${target}` : "/documents"}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              !cat
                ? "bg-foreground/10 text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {locale === "th" ? "ทุกหมวดหมู่" : "All Categories"}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={target ? `/documents?target=${target}&cat=${c.id}` : `/documents?cat=${c.id}`}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                cat === c.id
                  ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {locale === "th" ? c.nameTh : c.nameEn}
            </Link>
          ))}
        </div>
      )}

      {/* Documents Grid / Table */}
      {documents.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/80">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">
            {locale === "th" ? "ไม่พบเอกสารในหมวดหมู่นี้" : "No documents found in this category"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "th" ? "กรุณาเลือกหมวดหมู่อื่น หรือดูเอกสารทั้งหมด" : "Please select another category or view all documents"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const isPdf = doc.fileType.toLowerCase().includes("pdf");
            const isWord = doc.fileType.toLowerCase().includes("doc");

            return (
              <div
                key={doc.id}
                className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-primary/40"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {doc.code && (
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                          {doc.code}
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                          isPdf
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : isWord
                            ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {doc.fileType}
                      </span>
                    </div>

                    <span className="text-[11px] text-muted-foreground">
                      {locale === "th" ? doc.categoryNameTh : doc.categoryNameEn}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors leading-snug">
                      {locale === "th" ? doc.titleTh : doc.titleEn}
                    </h2>
                    <div className="text-xs text-muted-foreground">
                      {locale === "th" ? doc.titleEn : doc.titleTh}
                    </div>
                  </div>

                  {(doc.descriptionTh || doc.descriptionEn) && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {locale === "th" ? doc.descriptionTh : doc.descriptionEn || doc.descriptionTh}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <div className="text-muted-foreground">
                    <span>{locale === "th" ? "ดาวน์โหลดแล้ว" : "Downloads"}: </span>
                    <span className="font-bold text-foreground">{doc.downloadCount}</span>{" "}
                    {locale === "th" ? "ครั้ง" : "times"}
                  </div>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{locale === "th" ? "ดาวน์โหลดเอกสาร" : "Download File"}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
