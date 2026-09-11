import Link from "next/link";
import { getT, getLocale } from "@/i18n/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GraduationCap, Newspaper, Users, BookOpen, FileDown, Building2, Mail, Phone, MapPin, Clock } from "lucide-react";
import { MobileNav } from "./_components/mobile-nav";
import { PortalAvatarMenu } from "./_components/portal-avatar-menu";
import { resolveTenantSettings, auth } from "@/features/identity/server";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const [t, locale, session, settings] = await Promise.all([
    getT(),
    getLocale(),
    auth().catch(() => null),
    resolveTenantSettings(),
  ]);

  const logoUrl = settings?.logoUrl ?? null;
  const orgNameTh = settings?.nameTh ?? null;
  const orgNameEn = settings?.nameEn ?? null;

  const brandTitle = locale === "th" ? (orgNameTh || t("portal.facultyName")) : (orgNameEn || orgNameTh || t("portal.facultyName"));
  const brandSub = locale === "th" ? (orgNameEn || t("portal.universityName")) : (orgNameTh || t("portal.universityName"));

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
                  alt={brandTitle}
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
              <b>{brandTitle}</b>
              <span>{brandSub}</span>
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
            <PortalAvatarMenu
              user={session?.user ?? null}
              adminConsoleLabel={t("portal.nav.adminConsole")}
              profileLabel={t("account.profile")}
              signOutLabel={t("account.logout")}
              signInLabel={t("auth.signIn")}
            />
            {/* Mobile Navigation Drawer */}
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Liyon-style Ink-band Footer */}
      <footer className="mt-24 bg-[var(--ink-band)] text-[var(--ink-band-text)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-[var(--edge-grad-h)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Col 1: Brand & About */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--r-md)] bg-[var(--brand)] text-[var(--on-brand)] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt={brandTitle}
                      style={{ maxHeight: "32px", maxWidth: "80px", objectFit: "contain", width: "auto" }}
                    />
                  ) : (
                    <GraduationCap className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-base text-[var(--ink-band-text)] leading-tight tracking-tight">
                    {brandTitle}
                  </div>
                  <div className="text-xs text-[var(--ink-band-muted)]">
                    {brandSub}
                  </div>
                </div>
              </div>

              <p className="text-sm text-[var(--ink-band-muted)] leading-relaxed max-w-sm">
                {t("portal.footer.about")}
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-[var(--ink-band-text)] border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Digital Innovation Campus</span>
                </span>
              </div>
            </div>

            {/* Col 2: Academics */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-[var(--ink-band-muted)] uppercase tracking-wider">
                {t("portal.footer.academics")}
              </h4>
              <ul className="space-y-2.5 text-sm text-[var(--ink-band-muted)]">
                <li>
                  <Link href="/programs" className="hover:text-[var(--ink-band-text)] transition-colors">
                    {t("portal.nav.programs")}
                  </Link>
                </li>
                <li>
                  <Link href="/documents" className="hover:text-[var(--ink-band-text)] transition-colors">
                    {t("portal.nav.documents")}
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-[var(--ink-band-text)] transition-colors">
                    {t("portal.nav.home")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Services */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-[var(--ink-band-muted)] uppercase tracking-wider">
                {t("portal.footer.services")}
              </h4>
              <ul className="space-y-2.5 text-sm text-[var(--ink-band-muted)]">
                <li>
                  <Link href="/facilities" className="hover:text-[var(--ink-band-text)] transition-colors">
                    {t("portal.nav.facilities")}
                  </Link>
                </li>
                <li>
                  <Link href="/articles" className="hover:text-[var(--ink-band-text)] transition-colors">
                    {t("portal.nav.news")}
                  </Link>
                </li>
                <li>
                  <Link href="/faculty" className="hover:text-[var(--ink-band-text)] transition-colors">
                    {t("portal.nav.faculty")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[var(--ink-band-text)] transition-colors">
                    {t("portal.nav.adminConsole")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-[var(--ink-band-muted)] uppercase tracking-wider">
                {t("portal.footer.contact")}
              </h4>
              <div className="space-y-2.5 text-sm text-[var(--ink-band-muted)]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--brand-light)] mt-0.5" />
                  <span className="leading-snug">{t("portal.footer.address")}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[var(--brand-light)]" />
                  <span>{t("portal.footer.tel")}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[var(--brand-light)]" />
                  <span>{t("portal.footer.email")}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-[var(--brand-light)]" />
                  <span>{t("portal.footer.hours")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-band-muted)]">
            <div>
              © 2026 {brandTitle}. {t("portal.footer.copyright")}
            </div>
            <div className="flex items-center gap-4">
              <span>{t("portal.footer.privacy")}</span>
              <span>•</span>
              <span>{t("portal.footer.terms")}</span>
              <span>•</span>
              <span className="text-[var(--ink-band-text)]">Powered by VibeCore</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
