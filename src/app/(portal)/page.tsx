import Link from "next/link";
import { getLocale } from "@/shared/lib/i18n/server";
import { formatDate } from "@/shared/lib/format";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { listPublishedArticles } from "@/features/news/server";
import { listDepartments } from "@/features/staff/server";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Calendar,
  Pin,
  Newspaper,
  ChevronRight,
  FileDown,
  Building2,
  GraduationCap,
} from "lucide-react";

export default async function PortalHomePage() {
  const locale = await getLocale();
  const tenantId = await resolveDefaultTenantId();

  const [articles, departments] = await Promise.all([
    listPublishedArticles(tenantId, { limit: 3 }),
    listDepartments(tenantId),
  ]);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-28 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {locale === "th"
                  ? "เปิดรับสมัครนักศึกษาใหม่ ประจำปีการศึกษา 2569"
                  : "Admissions Now Open for Academic Year 2026"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              {locale === "th" ? (
                <>
                  สร้างสรรค์ผู้นำดิจิทัล <br />
                  <span className="text-primary">ขับเคลื่อนอนาคตด้วย AI</span>
                </>
              ) : (
                <>
                  Empowering Digital Leaders <br />
                  <span className="text-primary">Driving Future with AI</span>
                </>
              )}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {locale === "th"
                ? "คณะวิทยาการจัดการและสารสนเทศศาสตร์ มุ่งเน้นการเรียนรู้เชิงปฏิบัติการ บูรณาการวิทยาการคอมพิวเตอร์ เทคโนโลยีสารสนเทศ และการบริหารจัดการธุรกิจดิจิทัลสู่มาตรฐานสากล"
                : "Bridging computer science, software engineering, and modern digital management through hands-on learning and innovative research."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/articles">
                <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 gap-2">
                  {locale === "th" ? "ติดตามข่าวสารล่าสุด" : "Explore Latest News"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/faculty">
                <Button size="lg" variant="outline" className="rounded-full gap-2">
                  <Users className="h-4 w-4" />
                  {locale === "th" ? "ทำเนียบคณาจารย์" : "Faculty Directory"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">3</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              {locale === "th" ? "ภาควิชาและฝ่ายสนับสนุน" : "Departments & Units"}
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              {locale === "th" ? "บัณฑิตได้งานทำใน 1 ปี" : "Graduate Employment Rate"}
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">50+</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              {locale === "th" ? "ผลงานวิจัยระดับนานาชาติ" : "International Publications"}
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">20+</div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              {locale === "th" ? "เครือข่ายความร่วมมืออุตสาหกรรม" : "Industry Partnerships"}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/programs"
            className="group p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {locale === "th" ? "หลักสูตรการศึกษา" : "Academic Programs"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {locale === "th"
                  ? "ปริญญาตรี ปริญญาโท และปริญญาเอก ด้าน AI คอมพิวเตอร์ และเทคโนโลยีสารสนเทศ"
                  : "Undergraduate, Master, and Ph.D. degrees in AI and Computer Science."}
              </p>
            </div>
            <div className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === "th" ? "ดูโครงสร้างหลักสูตร" : "Explore Curricula"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/documents"
            className="group p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                <FileDown className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {locale === "th" ? "ดาวน์โหลดแบบฟอร์ม" : "Downloads & Forms"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {locale === "th"
                  ? "แบบฟอร์มคำร้องนักศึกษา ข้อบังคับมหาวิทยาลัย และเอกสารสนับสนุนวิชาการ"
                  : "Standard request forms, academic regulations, and official documents."}
              </p>
            </div>
            <div className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === "th" ? "ดาวน์โหลดเอกสาร" : "Access Downloads"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/facilities"
            className="group p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {locale === "th" ? "จองห้องและยานพาหนะ" : "Facilities & Vehicles"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {locale === "th"
                  ? "ห้องประชุมสัมมนา ห้องแล็บคอมพิวเตอร์ หอประชุม และรถตู้ส่วนกลางคณะ"
                  : "Conference rooms, AI laboratories, audit halls, and official transport."}
              </p>
            </div>
            <div className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === "th" ? "ตรวจสอบและจองใช้งาน" : "Book Resources"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/faculty"
            className="group p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {locale === "th" ? "ทำเนียบคณาจารย์" : "Faculty & Staff"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {locale === "th"
                  ? "ค้นหาอาจารย์ที่ปรึกษา ผู้เชี่ยวชาญเฉพาะทาง และบุคลากรประจำภาควิชา"
                  : "Meet our distinguished professors, researchers, and academic advisors."}
              </p>
            </div>
            <div className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === "th" ? "ค้นหาบุคลากร" : "View Directory"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              {locale === "th" ? "ข่าวสารและกิจกรรม" : "News & Updates"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              {locale === "th" ? "ข่าวประชาสัมพันธ์ล่าสุด" : "Latest Announcements"}
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline"
          >
            {locale === "th" ? "ดูข่าวทั้งหมด" : "View All News"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((item) => (
            <Link
              key={item.id}
              href={`/articles/${item.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {item.coverImageUrl ? (
                  <img
                    src={item.coverImageUrl}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
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

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {item.publishedAt ? formatDate(new Date(item.publishedAt), locale) : "-"}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2">
                    {locale === "th" ? item.titleTh : item.titleEn}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {locale === "th" ? item.excerptTh : item.excerptEn}
                  </p>
                </div>

                <div className="pt-2 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>{locale === "th" ? "อ่านต่อ..." : "Read More..."}</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Departments Section */}
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

      {/* Faculty Directory Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {locale === "th" ? "คณาจารย์และผู้เชี่ยวชาญระดับแนวหน้า" : "Meet Our Distinguished Faculty"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {locale === "th"
                ? "ค้นหาคณาจารย์ผู้เชี่ยวชาญ สาขาวิจัย และช่องทางการติดต่อ เพื่อการปรึกษาด้านวิชาการและโครงการความร่วมมือ"
                : "Explore research expertises, profiles, and contact details of our world-class professors and researchers."}
            </p>
          </div>
          <Link href="/faculty">
            <Button size="lg" className="rounded-full gap-2 shrink-0">
              <Users className="h-4 w-4" />
              {locale === "th" ? "เปิดดูทำเนียบคณาจารย์" : "Browse Faculty Directory"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
