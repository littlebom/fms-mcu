import Link from "next/link";
import Image from "next/image";
import { getT } from "@/i18n/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { GraduationCap, Newspaper, Users, BookOpen, FileDown, ArrowRight, Building2, Mail, Phone } from "lucide-react";
import { MobileNav } from "./_components/mobile-nav";
import { getTenantSettings, resolveDefaultTenantId } from "@/features/identity/server";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const t = await getT();

  // ดึง logoUrl จาก tenant settings
  let logoUrl: string | null = null;
  try {
    const tenantId = await resolveDefaultTenantId();
    const settings = await getTenantSettings(tenantId);
    logoUrl = settings.logoUrl ?? null;
  } catch {
    // fallback → icon เดิม
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Banner Bar - Liyon Header */}
      <header className="sticky top-0 z-50 h-16 flex items-center bg-[var(--glass)] backdrop-blur-[18px] shadow-[var(--shadow)] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[var(--edge-grad-h)] after:pointer-events-none px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          {/* Brand Block matching Admin */}
          <Link href="/" className="brand-blk flex items-center gap-2.5 min-w-0">
            <i>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={t("portal.facultyName")}
                  style={{ maxHeight: "32px", maxWidth: "80px", objectFit: "contain", width: "auto" }}
                />
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                  <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
                </svg>
              )}
            </i>
            <div className="t min-w-0">
              <b>{t("portal.facultyName")}</b>
              <span>{t("portal.universityName")}</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 text-sm font-medium rounded-[var(--r-ctl)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)] transition-colors"
            >
              {t("portal.nav.home")}
            </Link>
            <Link
              href="/programs"
              className="px-3 py-1.5 text-sm font-medium rounded-[var(--r-ctl)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)] transition-colors inline-flex items-center gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              {t("portal.nav.programs")}
            </Link>
            <Link
              href="/documents"
              className="px-3 py-1.5 text-sm font-medium rounded-[var(--r-ctl)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)] transition-colors inline-flex items-center gap-1.5"
            >
              <FileDown className="h-4 w-4" />
              {t("portal.nav.documents")}
            </Link>
            <Link
              href="/facilities"
              className="px-3 py-1.5 text-sm font-medium rounded-[var(--r-ctl)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)] transition-colors inline-flex items-center gap-1.5"
            >
              <Building2 className="h-4 w-4" />
              {t("portal.nav.facilities")}
            </Link>
            <Link
              href="/articles"
              className="px-3 py-1.5 text-sm font-medium rounded-[var(--r-ctl)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)] transition-colors inline-flex items-center gap-1.5"
            >
              <Newspaper className="h-4 w-4" />
              {t("portal.nav.news")}
            </Link>
            <Link
              href="/faculty"
              className="px-3 py-1.5 text-sm font-medium rounded-[var(--r-ctl)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)] transition-colors inline-flex items-center gap-1.5"
            >
              <Users className="h-4 w-4" />
              {t("portal.nav.faculty")}
            </Link>
          </nav>

          {/* Right Action Controls matching Admin */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="icon-btn" label={t("nav.themeToggle")} />
            <LanguageSwitcher className="lang" />
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <Button size="sm" variant="outline" className="items-center gap-1.5 text-xs h-9 rounded-[var(--r-ctl)] border-[var(--glass-border)] bg-[var(--glass)] hover:bg-[var(--glass-strong)] text-[var(--text)]">
                {t("portal.nav.adminConsole")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            {/* Mobile Navigation Drawer */}
            <MobileNav />
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
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={t("portal.facultyName")}
                    width={32}
                    height={32}
                    style={{ objectFit: "contain", width: "100%", height: "100%" }}
                    unoptimized={logoUrl.startsWith("/")}
                  />
                ) : (
                  <GraduationCap className="h-5 w-5" />
                )}
              </div>
              <span className="font-bold text-foreground">
                {t("portal.facultyName")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {t("portal.footer.about")}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t("portal.footer.navigation")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  {t("portal.nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-foreground transition-colors">
                  {t("portal.nav.programs")}
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-foreground transition-colors">
                  {t("portal.nav.documents")}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-foreground transition-colors">
                  {t("portal.nav.facilities")}
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-foreground transition-colors">
                  {t("portal.nav.news")}
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:text-foreground transition-colors">
                  {t("portal.nav.faculty")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  {t("portal.nav.adminConsole")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t("portal.footer.contact")}
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>{t("portal.footer.address")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>{t("portal.footer.email")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>{t("portal.footer.tel")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <div>© 2026 {t("portal.facultyName")}. {t("portal.footer.copyright")}</div>
          <div className="mt-2 sm:mt-0">Powered by VibeCore Modular Monolith</div>
        </div>
      </footer>
    </div>
  );
}
