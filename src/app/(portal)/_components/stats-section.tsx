import type { TFunction } from "@/shared/lib/i18n/translate";

interface StatsSectionProps {
  t: TFunction;
  departmentsCount: number;
}

export function StatsSection({ t, departmentsCount }: StatsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">{departmentsCount}</div>
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            {t("portal.stats.departments")}
          </div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">100%</div>
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            {t("portal.stats.employment")}
          </div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">50+</div>
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            {t("portal.stats.research")}
          </div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-extrabold text-primary">20+</div>
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            {t("portal.stats.partnerships")}
          </div>
        </div>
      </div>
    </section>
  );
}
