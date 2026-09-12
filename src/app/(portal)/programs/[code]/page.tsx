import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "@/shared/lib/i18n/server";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { getProgramByCode } from "@/features/curriculum/server";
import {
  BookOpen,
  Clock,
  Coins,
  ChevronLeft,
  CheckCircle2,
  Building,
  FileText,
  Download,
  ExternalLink,
  Award,
  Compass,
  ArrowRight,
} from "lucide-react";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const locale = await getLocale();
  const tenantId = await resolveDefaultTenantId();
  const { code } = await params;

  const program = await getProgramByCode(tenantId, code);
  if (!program) {
    notFound();
  }

  const isInter = program.studyType === "INTERNATIONAL";
  const levelBadge =
    program.degreeLevel === "BACHELOR"
      ? locale === "th" ? "ระดับปริญญาตรี" : "Undergraduate Degree"
      : program.degreeLevel === "MASTER"
      ? locale === "th" ? "ระดับปริญญาโท" : "Master Degree"
      : locale === "th" ? "ระดับปริญญาเอก" : "Doctoral Degree";

  const studyTypeBadge =
    program.studyType === "INTERNATIONAL"
      ? locale === "th" ? "หลักสูตรนานาชาติ (International Program)" : "International Program"
      : program.studyType === "SPECIAL"
      ? locale === "th" ? "ภาคพิเศษ / เสาร์-อาทิตย์" : "Special / Weekend Program"
      : locale === "th" ? "ภาคปกติ (Regular Program)" : "Regular Program";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/programs"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{locale === "th" ? "กลับไปหน้ารายการหลักสูตร" : "Back to Programs"}</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="liyon-card rounded-3xl p-6 sm:p-10 space-y-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-muted text-foreground border border-border">
            {program.code.toUpperCase()}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-md ${
              isInter
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            {levelBadge}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-md bg-muted text-muted-foreground border border-border">
            {studyTypeBadge}
          </span>
          {program.isOpenAdmissions && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {locale === "th" ? "เปิดรับสมัครประจำปีการศึกษา 2569" : "Admissions Open 2026"}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {locale === "th" ? program.nameTh : program.nameEn}
          </h1>
          <div className="text-base sm:text-xl font-medium text-muted-foreground">
            {locale === "th" ? program.nameEn : program.nameTh}
          </div>
        </div>

        {/* Degree Names Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/80 text-sm">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {locale === "th" ? "ชื่อปริญญา (ภาษาไทย)" : "Degree Title (Thai)"}
            </span>
            <div className="font-semibold text-foreground">{program.degreeNameTh}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {locale === "th" ? "ชื่อปริญญา (ภาษาอังกฤษ)" : "Degree Title (English)"}
            </span>
            <div className="font-semibold text-foreground">{program.degreeNameEn}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Content (8 cols) + Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="liyon-card p-5 rounded-2xl space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground font-medium">
                <Clock className="h-4 w-4 text-primary" />
                <span>{locale === "th" ? "ระยะเวลาศึกษา" : "Duration"}</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {program.durationYears} {locale === "th" ? "ปี" : "Years"}
              </div>
            </div>

            <div className="liyon-card p-5 rounded-2xl space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground font-medium">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{locale === "th" ? "จำนวนหน่วยกิตรวม" : "Total Credits"}</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {program.totalCredits} {locale === "th" ? "หน่วยกิต" : "Credits"}
              </div>
            </div>

            <div className="liyon-card p-5 rounded-2xl space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground font-medium">
                <Coins className="h-4 w-4 text-primary" />
                <span>{locale === "th" ? "ค่าธรรมเนียมการศึกษา" : "Tuition Fee"}</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-foreground truncate" title={program.tuitionFee || "-"}>
                {program.tuitionFee || "-"}
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          {(program.philosophyTh || program.philosophyEn) && (
            <div className="liyon-card p-6 sm:p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Compass className="h-5 w-5" />
                </div>
                <span>{locale === "th" ? "ปรัชญาและความสำคัญของหลักสูตร" : "Program Philosophy & Objectives"}</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {locale === "th" ? program.philosophyTh : program.philosophyEn || program.philosophyTh}
              </p>
            </div>
          )}

          {/* Description Section */}
          {(program.descriptionTh || program.descriptionEn) && (
            <div className="liyon-card p-6 sm:p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <span>{locale === "th" ? "ภาพรวมและโครงสร้างหลักสูตร" : "Curriculum Overview"}</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {locale === "th" ? program.descriptionTh : program.descriptionEn || program.descriptionTh}
              </p>
            </div>
          )}

          {/* Career Opportunities */}
          {program.careerPaths.length > 0 && (
            <div className="liyon-card p-6 sm:p-8 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <span>{locale === "th" ? "อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา" : "Career Opportunities"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {program.careerPaths.map((career, idx) => (
                  <div
                    key={idx}
                    className="liyon-card-sub flex items-center gap-3 p-3.5 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{career}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Box: Apply / Download */}
          <div className="liyon-card p-6 rounded-2xl space-y-5">
            <h3 className="font-bold text-base text-foreground">
              {locale === "th" ? "การรับสมัครและเอกสาร" : "Admissions & Downloads"}
            </h3>

            <div className="space-y-3">
              {program.applicationUrl ? (
                <a
                  href={program.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-colors"
                >
                  <span>{locale === "th" ? "สมัครเรียนออนไลน์ทันที" : "Apply Online Now"}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href="/articles"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-colors"
                >
                  <span>{locale === "th" ? "ติดตามประกาศรับสมัคร" : "Admissions Information"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {program.curriculumPdfUrl && (
                <a
                  href={program.curriculumPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted text-foreground font-medium text-xs transition-colors"
                >
                  <Download className="h-4 w-4 text-primary" />
                  <span>{locale === "th" ? "ดาวน์โหลดเล่มหลักสูตร (มคอ.2)" : "Download Curriculum Spec"}</span>
                </a>
              )}

              {program.brochureUrl && (
                <a
                  href={program.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted text-foreground font-medium text-xs transition-colors"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{locale === "th" ? "ดาวน์โหลดแผ่นพับหลักสูตร (PDF)" : "Download Brochure (PDF)"}</span>
                </a>
              )}
            </div>
          </div>

          {/* Department Contact Card */}
          <div className="liyon-card p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Building className="h-4 w-4 text-primary" />
              <span>{locale === "th" ? "ภาควิชาที่รับผิดชอบ" : "Responsible Department"}</span>
            </div>
            <div className="text-sm font-medium text-foreground">
              {locale === "th" ? program.departmentNameTh : program.departmentNameEn}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "th"
                ? "คณะวิทยาการจัดการและสารสนเทศศาสตร์ มหาวิทยาลัยนวัตกรรมดิจิทัล โทร. 02-123-4567 ต่อ 1000 อีเมล contact@fms.ac.th"
                : "Faculty of Management & Information Sciences, Digital Innovation University. Tel. 02-123-4567 ext 1000, Email: contact@fms.ac.th"}
            </p>
            <div className="pt-2">
              <Link
                href={`/faculty?dept=${program.departmentId}`}
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                <span>{locale === "th" ? "ดูรายนามคณาจารย์ประจำสาขา" : "View Department Faculty"}</span>
                <ChevronLeft className="h-3 w-3 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
