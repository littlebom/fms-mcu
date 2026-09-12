import Link from "next/link";
import { GraduationCap, FileDown, Building2, Newspaper, ChevronRight } from "lucide-react";
import type { TFunction } from "@/shared/lib/i18n/translate";

interface QuickServicesSectionProps {
  t: TFunction;
}

export function QuickServicesSection({ t }: QuickServicesSectionProps) {
  const services = [
    {
      href: "/programs",
      icon: GraduationCap,
      color: "bg-primary/10 text-primary",
      title: t("portal.nav.programs"),
      desc: t("portal.services.programsDesc"),
      action: t("portal.services.programsAction"),
    },
    {
      href: "/documents",
      icon: FileDown,
      color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      title: t("portal.nav.documents"),
      desc: t("portal.services.documentsDesc"),
      action: t("portal.services.documentsAction"),
    },
    {
      href: "/facilities",
      icon: Building2,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      title: t("portal.nav.facilities"),
      desc: t("portal.services.facilitiesDesc"),
      action: t("portal.services.facilitiesAction"),
    },
    {
      href: "/articles",
      icon: Newspaper,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      title: t("portal.nav.news"),
      desc: t("portal.services.newsDesc"),
      action: t("portal.services.newsAction"),
    },
  ];

  return (
    <section id="quick-services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="liyon-card liyon-card-hover group p-6 rounded-[8px] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className={`h-12 w-12 rounded-[8px] flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>{item.action}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
