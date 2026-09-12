import Link from "next/link";
import { BookOpen, Award, ArrowRight } from "lucide-react";
import type { TFunction } from "@/shared/lib/i18n/translate";
import type { Locale } from "@/shared/lib/i18n/config";
import type { DepartmentDto } from "@/features/staff";

interface DepartmentsSectionProps {
  t: TFunction;
  locale: Locale;
  departments: DepartmentDto[];
}

export function DepartmentsSection({ locale, departments }: DepartmentsSectionProps) {
  return (
    <section id="departments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {locale === "th" ? "ภาควิชาและหน่วยงานภายใน" : "Academic Departments"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {locale === "th"
            ? "ครอบคลุมการเรียนการสอนและวิจัยในหลากหลายสาขาวิชาชีพแห่งอนาคต"
            : "Discover our diverse academic units committed to learning and discovery"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="liyon-card liyon-card-hover p-6 rounded-[8px] space-y-4"
          >
            <div className="h-10 w-10 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary">
              {dept.isAcademic ? <BookOpen className="h-5 w-5" /> : <Award className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">
                {locale === "th" ? dept.nameTh : dept.nameEn}
              </h3>
              <div className="text-xs text-muted-foreground mt-1">
                {dept.isAcademic
                  ? locale === "th"
                    ? "ภาควิชาสายวิชาการ"
                    : "Academic Department"
                  : locale === "th"
                  ? "ฝ่ายสนับสนุนและบริหาร"
                  : "Administrative Unit"}
              </div>
            </div>
            <Link
              href={`/faculty?dept=${dept.id}`}
              className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
            >
              {locale === "th" ? "ดูทำเนียบบุคลากรสังกัดนี้" : "View Department Staff"}
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
