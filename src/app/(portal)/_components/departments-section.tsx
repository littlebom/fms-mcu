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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-6 rounded-2xl border border-border bg-card/60 space-y-4 hover:border-primary/50 transition-colors"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
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
