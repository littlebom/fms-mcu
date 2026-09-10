import Link from "next/link";
import { getLocale } from "@/shared/lib/i18n/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { GraduationCap, Newspaper, Users, BookOpen, FileDown, ArrowRight, Building2, Mail, Phone } from "lucide-react";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Banner Bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-foreground leading-tight">
                {locale === "th" ? "คณะวิทยาการจัดการและสารสนเทศศาสตร์" : "Faculty of Management & Information"}
              </div>
              <div className="text-xs text-muted-foreground">
                {locale === "th" ? "มหาวิทยาลัยนวัตกรรมดิจิทัล" : "Digital Innovation University"}
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {locale === "th" ? "หน้าหลัก" : "Home"}
            </Link>
            <Link
              href="/programs"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              {locale === "th" ? "หลักสูตร" : "Programs"}
            </Link>
            <Link
              href="/documents"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <FileDown className="h-4 w-4" />
              {locale === "th" ? "ดาวน์โหลดเอกสาร" : "Downloads"}
            </Link>
            <Link
              href="/facilities"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Building2 className="h-4 w-4" />
              {locale === "th" ? "บริการสถานที่" : "Facilities"}
            </Link>
            <Link
              href="/articles"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Newspaper className="h-4 w-4" />
              {locale === "th" ? "ข่าวสาร" : "News"}
            </Link>
            <Link
              href="/faculty"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Users className="h-4 w-4" />
              {locale === "th" ? "บุคลากร" : "Faculty"}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="h-9 w-9 rounded-full border border-border" />
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="hidden sm:inline-flex items-center gap-1.5 text-xs">
                {locale === "th" ? "ระบบจัดการหลังบ้าน" : "Staff Console"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/40 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-foreground">
                {locale === "th" ? "คณะวิทยาการจัดการและสารสนเทศศาสตร์" : "Faculty of Management & Information"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {locale === "th"
                ? "มุ่งผลิตบัณฑิตผู้เชี่ยวชาญด้านปัญญาประดิษฐ์ วิศวกรรมซอฟต์แวร์ และนวัตกรรมดิจิทัล พร้อมงานวิจัยระดับสากลเพื่อการพัฒนาสังคมอย่างยั่งยืน"
                : "Dedicated to nurturing excellence in Artificial Intelligence, Software Engineering, and Digital Innovation through world-class education and impact research."}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {locale === "th" ? "การนำทาง" : "Navigation"}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  {locale === "th" ? "หน้าหลัก" : "Home"}
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-foreground transition-colors">
                  {locale === "th" ? "หลักสูตรการศึกษา" : "Academic Programs"}
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-foreground transition-colors">
                  {locale === "th" ? "ดาวน์โหลดแบบฟอร์ม" : "Downloads & Forms"}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-foreground transition-colors">
                  {locale === "th" ? "บริการสถานที่และยานพาหนะ" : "Facilities & Vehicles"}
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-foreground transition-colors">
                  {locale === "th" ? "ข่าวสารและกิจกรรม" : "News & Activities"}
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:text-foreground transition-colors">
                  {locale === "th" ? "ทำเนียบคณาจารย์" : "Faculty Directory"}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  {locale === "th" ? "เข้าสู่ระบบบุคลากร (Admin)" : "Staff Login"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {locale === "th" ? "ติดต่อเรา" : "Contact Us"}
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0 text-primary" />
                <span>อาคารวิทยาการจัดการ ชั้น 4 ถ.มหาวิทยาลัย</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>contact@fms.ac.th</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>02-123-4567 ต่อ 1000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <div>© 2026 Faculty of Management & Information Sciences. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">Powered by VibeCore Modular Monolith</div>
        </div>
      </footer>
    </div>
  );
}
