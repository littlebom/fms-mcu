import Link from "next/link";
import { getLocale } from "@/shared/lib/i18n/server";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { listPublicPrograms } from "@/features/curriculum/server";
import { listDepartments } from "@/features/staff/server";
import type { DegreeLevel } from "@/generated/prisma";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Coins,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Building,
} from "lucide-react";

const DEGREE_TABS = [
  { id: "ALL", labelTh: "ทั้งหมด", labelEn: "All Degrees" },
  { id: "BACHELOR", labelTh: "ปริญญาตรี", labelEn: "Bachelor's Degrees" },
  { id: "MASTER", labelTh: "ปริญญาโท", labelEn: "Master's Degrees" },
  { id: "DOCTORAL", labelTh: "ปริญญาเอก", labelEn: "Doctoral Degrees" },
] as const;

export default async function ProgramsPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; dept?: string }>;
}) {
  const locale = await getLocale();
  const tenantId = await resolveDefaultTenantId();
  const { level, dept } = await searchParams;

  const validLevel =
    level && ["BACHELOR", "MASTER", "DOCTORAL"].includes(level)
      ? (level as DegreeLevel)
      : undefined;

  const [programs, departments] = await Promise.all([
    listPublicPrograms(tenantId, {
      degreeLevel: validLevel,
      departmentId: dept,
    }),
    listDepartments(tenantId),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{locale === "th" ? "หลักสูตรมาตรฐานสากล" : "Academic Programs"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {locale === "th"
            ? "หลักสูตรระดับปริญญาตรี ปริญญาโท และปริญญาเอก"
            : "Undergraduate & Graduate Programs"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {locale === "th"
            ? "ค้นพบหลักสูตรที่ตอบโจทย์อนาคตยุคดิจิทัล ผสมผสานทฤษฎีเข้มข้นและการลงมือปฏิบัติจริง พร้อมโอกาสฝึกงานและทำวิจัยร่วมกับองค์กรชั้นนำระดับประเทศและสากล"
            : "Explore our future-ready academic curricula designed to empower tomorrow's technology leaders and innovative researchers."}
        </p>
      </div>

      {/* Degree Level Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {DEGREE_TABS.map((tab) => {
          const isSelected = (!level && tab.id === "ALL") || level === tab.id;
          const href =
            tab.id === "ALL"
              ? dept
                ? `/programs?dept=${dept}`
                : "/programs"
              : dept
              ? `/programs?level=${tab.id}&dept=${dept}`
              : `/programs?level=${tab.id}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm scale-100"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {locale === "th" ? tab.labelTh : tab.labelEn}
            </Link>
          );
        })}
      </div>

      {/* Department Filter Chips */}
      {departments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            {locale === "th" ? "ภาควิชา:" : "Department:"}
          </span>
          <Link
            href={level ? `/programs?level=${level}` : "/programs"}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              !dept
                ? "bg-foreground/10 text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {locale === "th" ? "ทุกภาควิชา" : "All Departments"}
          </Link>
          {departments.map((d) => (
            <Link
              key={d.id}
              href={level ? `/programs?level=${level}&dept=${d.id}` : `/programs?dept=${d.id}`}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                dept === d.id
                  ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {locale === "th" ? d.nameTh : d.nameEn}
            </Link>
          ))}
        </div>
      )}

      {/* Programs Cards Grid */}
      {programs.length === 0 ? (
        <div className="liyon-card text-center py-20 rounded-2xl">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">
            {locale === "th" ? "ไม่พบข้อมูลหลักสูตรในหมวดหมู่นี้" : "No programs found in this category"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "th" ? "กรุณาเลือกหมวดหมู่อื่น หรือดูหลักสูตรทั้งหมด" : "Please try another filter or view all programs"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {programs.map((prog) => {
            const isInter = prog.studyType === "INTERNATIONAL";
            const levelBadge =
              prog.degreeLevel === "BACHELOR"
                ? locale === "th" ? "ปริญญาตรี" : "Bachelor"
                : prog.degreeLevel === "MASTER"
                ? locale === "th" ? "ปริญญาโท" : "Master"
                : locale === "th" ? "ปริญญาเอก" : "Doctoral";

            const studyTypeBadge =
              prog.studyType === "INTERNATIONAL"
                ? locale === "th" ? "หลักสูตรนานาชาติ" : "International Program"
                : prog.studyType === "SPECIAL"
                ? locale === "th" ? "ภาคพิเศษ / นอกเวลาราชการ" : "Special / Weekend Program"
                : locale === "th" ? "ภาคปกติ" : "Regular Program";

            return (
              <div
                key={prog.id}
                className="liyon-card liyon-card-hover group rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Card Top / Image / Header */}
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-muted text-foreground border border-border">
                        {prog.code.toUpperCase()}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                          isInter
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        {levelBadge} • {studyTypeBadge}
                      </span>
                    </div>

                    {prog.isOpenAdmissions && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        {locale === "th" ? "เปิดรับสมัคร" : "Admissions Open"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/programs/${prog.code}`}>
                        {locale === "th" ? prog.nameTh : prog.nameEn}
                      </Link>
                    </h2>
                    <div className="text-sm font-medium text-muted-foreground">
                      {locale === "th" ? prog.degreeNameTh : prog.degreeNameEn}
                    </div>
                  </div>

                  {/* Philosophy / Overview excerpt */}
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {locale === "th"
                      ? prog.philosophyTh || prog.descriptionTh || "หลักสูตรมุ่งเน้นการบูรณาการองค์ความรู้สมัยใหม่และนวัตกรรมดิจิทัล"
                      : prog.philosophyEn || prog.descriptionEn || "A cutting-edge program integrating advanced digital technologies and modern applications."}
                  </p>

                  {/* Key Highlights Metrics */}
                  <div className="liyon-card-sub grid grid-cols-3 gap-3 py-3 px-4 rounded-xl text-xs">
                    <div className="space-y-0.5">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>{locale === "th" ? "ระยะเวลา" : "Duration"}</span>
                      </div>
                      <div className="font-bold text-foreground">
                        {prog.durationYears} {locale === "th" ? "ปี" : "Years"}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        <span>{locale === "th" ? "หน่วยกิต" : "Credits"}</span>
                      </div>
                      <div className="font-bold text-foreground">
                        {prog.totalCredits} {locale === "th" ? "หน่วยกิต" : "credits"}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5 text-primary" />
                        <span>{locale === "th" ? "ค่าธรรมเนียม" : "Tuition"}</span>
                      </div>
                      <div className="font-bold text-foreground truncate" title={prog.tuitionFee || "-"}>
                        {prog.tuitionFee || "-"}
                      </div>
                    </div>
                  </div>

                  {/* Career tags */}
                  {prog.careerPaths.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>{locale === "th" ? "เส้นทางอาชีพ:" : "Career Opportunities:"}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {prog.careerPaths.slice(0, 3).map((career, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50"
                          >
                            {career}
                          </span>
                        ))}
                        {prog.careerPaths.length > 3 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md text-muted-foreground">
                            +{prog.careerPaths.length - 3} {locale === "th" ? "สายงาน" : "more"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom / Footer */}
                <div className="px-6 py-4 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Building className="h-3.5 w-3.5 text-primary" />
                    <span>{locale === "th" ? prog.departmentNameTh : prog.departmentNameEn}</span>
                  </div>

                  <Link
                    href={`/programs/${prog.code}`}
                    className="font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{locale === "th" ? "รายละเอียดหลักสูตร" : "Curriculum Details"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
