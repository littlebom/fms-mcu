"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Building2,
  Newspaper,
  Phone,
  ArrowRight,
} from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();

  const navItems = [
    { href: "/", label: t("portal.nav.home"), icon: GraduationCap },
    { href: "/programs", label: t("portal.nav.programs"), icon: BookOpen },
    { href: "/#departments", label: t("portal.nav.departments"), icon: Building2 },
    { href: "/articles", label: t("portal.nav.news"), icon: Newspaper },
    { href: "/#contact", label: t("portal.nav.contact"), icon: Phone },
  ];

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="icon-btn"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-[var(--glass-strong)] backdrop-blur-[18px] border-b border-[var(--glass-border)] shadow-[var(--shadow)] px-4 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--r-ctl)] text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--glass-strong)] text-[var(--brand-ink)] font-semibold shadow-[inset_0_0_0_1px_var(--glass-border)]"
                      : "text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--glass-hover)]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-[var(--brand-ink)] opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-[var(--glass-border)]">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="login-btn w-full justify-center"
            >
              <span>{t("auth.signIn")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
