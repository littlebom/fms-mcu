import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TFunction } from "@/shared/lib/i18n/translate";

interface FacultyTeaserSectionProps {
  t: TFunction;
}

export function FacultyTeaserSection({ t }: FacultyTeaserSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="liyon-card rounded-[8px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            คณาจารย์และผู้เชี่ยวชาญระดับแนวหน้า
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("portal.footer.about")}
          </p>
        </div>
        <Link href="/faculty">
          <Button size="lg" className="rounded-full gap-2 shrink-0">
            <Users className="h-4 w-4" />
            <span>{t("portal.hero.ctaFaculty")}</span>
          </Button>
        </Link>
      </div>
    </section>
  );
}
