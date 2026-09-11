"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  FileDown,
  Building2,
  Newspaper,
  Users,
  ArrowRight,
} from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();

  const navItems = [
    { href: "/", label: t("portal.nav.home"), icon: GraduationCap },
    { href: "/programs", label: t("portal.nav.programs"), icon: BookOpen },
    { href: "/documents", label: t("portal.nav.documents"), icon: FileDown },
    { href: "/facilities", label: t("portal.nav.facilities"), icon: Building2 },
    { href: "/articles", label: t("portal.nav.news"), icon: Newspaper },
    { href: "/faculty", label: t("portal.nav.faculty"), icon: Users },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 p-0"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-background/98 backdrop-blur-lg border-b border-border shadow-xl px-4 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-border/60">
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button size="sm" variant="outline" className="w-full justify-center gap-2 text-xs font-semibold">
                <span>{t("portal.nav.adminConsole")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
