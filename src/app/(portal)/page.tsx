import { getLocale, getT } from "@/i18n/server";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { listPublishedArticles } from "@/features/news/server";
import { listDepartments } from "@/features/staff/server";
import { HeroSection } from "./_components/hero-section";
import { StatsSection } from "./_components/stats-section";
import { QuickServicesSection } from "./_components/quick-services-section";
import { LatestNewsSection } from "./_components/latest-news-section";
import { DepartmentsSection } from "./_components/departments-section";
import { FacultyTeaserSection } from "./_components/faculty-teaser-section";

export default async function PortalHomePage() {
  const locale = await getLocale();
  const t = await getT();
  const tenantId = await resolveDefaultTenantId();

  const [articles, departments] = await Promise.all([
    listPublishedArticles(tenantId, { limit: 4 }),
    listDepartments(tenantId),
  ]);

  return (
    <div className="space-y-20 pb-16">
      <HeroSection t={t} />
      <StatsSection t={t} departmentsCount={departments.length} />
      <QuickServicesSection t={t} />
      <LatestNewsSection t={t} locale={locale} articles={articles} />
      <DepartmentsSection t={t} locale={locale} departments={departments} />
      <FacultyTeaserSection t={t} />
    </div>
  );
}
