import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Layers,
  CheckCircle2,
  Building2,
  GraduationCap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TFunction } from "@/shared/lib/i18n/translate";

interface HeroSectionProps {
  t: TFunction;
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
      {/* ── Background: Atmospheric Monotree Mesh Grid & Ambient Glow ── */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        aria-hidden="true"
      >
        {/* Subtle Tech Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.45] dark:opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(var(--glass-border) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 25%, black 40%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 25%, black 40%, transparent 85%)",
          }}
        />

        {/* Central Ambient Glow in Main Brand Color */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[400px] rounded-full blur-[110px] opacity-40 dark:opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle, var(--brand-light) 0%, var(--brand) 50%, transparent 75%)`,
          }}
        />

        {/* Top Edge Ambient Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--edge-grad-h)] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Top Hero Header Block ── */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Floating Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--glass-strong)] border border-[var(--glass-border)] shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-light)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand)]" />
            </span>
            <span className="text-xs font-semibold text-[var(--text)] tracking-wide">
              {t("portal.hero.badge")}
            </span>
            <Sparkles className="h-3 w-3 text-[var(--brand-light)]" />
          </div>

          {/* High-Impact Modernist Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-[var(--text)] leading-[1.12]">
            {t("portal.hero.title1")}{" "}
            <span className="block mt-1 bg-gradient-to-r from-[var(--brand)] via-[var(--brand-light)] to-[var(--brand)] bg-clip-text text-transparent">
              {t("portal.hero.title2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
            {t("portal.hero.subtitle")}
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link href="/articles">
              <Button
                size="lg"
                className="h-11 px-6 rounded-full font-semibold gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--brand)",
                  color: "var(--on-brand)",
                  boxShadow: "0 10px 25px -6px var(--brand-glow)",
                }}
              >
                <span>{t("portal.hero.ctaNews")}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/faculty">
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6 rounded-full font-medium gap-2 border-[var(--glass-border)] bg-[var(--glass)] hover:bg-[var(--glass-strong)] text-[var(--text)] backdrop-blur-md transition-all hover:scale-[1.02]"
              >
                <Users className="h-4 w-4 text-[var(--text-2)]" />
                <span>{t("portal.hero.ctaFaculty")}</span>
              </Button>
            </Link>
          </div>

          {/* Trust Proof Micro-Badge */}
          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>AUN-QA Certified</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-[var(--brand-light)]" />
              <span>1,500+ Active Students</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>AI Research Hub</span>
            </span>
          </div>
        </div>

        {/* ── Monotree Showcase Frame: Bento Dashboard Interface ── */}
        <div className="mt-14 lg:mt-16 max-w-5xl mx-auto relative">
          {/* Ambient Glow behind the mockup */}
          <div
            className="absolute -inset-1 rounded-3xl opacity-35 blur-xl -z-10"
            style={{
              background: `linear-gradient(135deg, var(--brand-glow), transparent 70%)`,
            }}
          />

          {/* Main App Frame */}
          <div className="rounded-2xl lg:rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-strong)] shadow-[var(--shadow)] backdrop-blur-2xl overflow-hidden">
            {/* Top Browser / App Window Control Bar */}
            <div className="px-4 sm:px-6 py-3 border-b border-[var(--glass-border)] bg-[var(--glass)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
              </div>

              {/* Simulated Smart Address/Search Pill */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--glass-strong)] border border-[var(--glass-border)] text-xs text-[var(--text-muted)] w-72 justify-center">
                <span className="text-[var(--brand)] font-semibold">fms.mcu.ac.th</span>
                <span>/</span>
                <span>smart-portal</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live System</span>
              </div>
            </div>

            {/* Bento Grid Interior */}
            <div className="p-5 sm:p-7 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Bento Card 1: Graduate Career & Employment Metric */}
              <div className="p-5 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] flex flex-col justify-between space-y-4 hover:border-[var(--brand-light)] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-[var(--brand-glow)] text-[var(--brand-ink)]">
                    <TrendingUp className="h-5 w-5" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    +4.2% YoY
                  </span>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-[var(--text)] tracking-tight">
                    98.4%
                  </div>
                  <div className="text-xs font-medium text-[var(--text-2)] mt-1">
                    อัตราบัณฑิตได้งานทำภายใน 1 ปี
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Graduate Employment Rate
                  </div>
                </div>
                {/* Simulated Progress Trendline */}
                <div className="w-full bg-[var(--glass-border)] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "98.4%",
                      background: "linear-gradient(90deg, var(--brand-light), var(--brand))",
                    }}
                  />
                </div>
              </div>

              {/* Bento Card 2: Smart Campus Facilities Real-Time Status */}
              <div className="p-5 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] flex flex-col justify-between space-y-4 hover:border-[var(--brand-light)] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--brand-glow)] text-[var(--brand-ink)] border border-[var(--glass-border)]">
                    Smart Spaces
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--glass-strong)] border border-[var(--glass-border)]">
                    <span className="font-medium text-[var(--text)]">AI & Data Center Lab</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      พร้อมใช้งาน
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--glass-strong)] border border-[var(--glass-border)]">
                    <span className="font-medium text-[var(--text)]">ห้องประชุม Smart Hall</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      พร้อมใช้งาน
                    </span>
                  </div>
                </div>
                <Link
                  href="/facilities"
                  className="text-xs font-semibold text-[var(--brand)] hover:underline inline-flex items-center gap-1"
                >
                  <span>จองพื้นที่การเรียนรู้</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Bento Card 3: Academic Degrees & Curricula */}
              <div className="p-5 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] flex flex-col justify-between space-y-4 hover:border-[var(--brand-light)] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Layers className="h-5 w-5" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    Curriculum 2026
                  </span>
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--text)]">
                    3 ระดับการศึกษา
                  </div>
                  <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">
                    ครอบคลุม ป.ตรี • ป.โท • ป.เอก มุ่งเน้น AI นวัตกรรม และวิทยาการข้อมูล
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[var(--glass-strong)] border border-[var(--glass-border)] text-[11px] font-medium text-[var(--text-2)]">
                    วท.บ. AI & Tech
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[var(--glass-strong)] border border-[var(--glass-border)] text-[11px] font-medium text-[var(--text-2)]">
                    วท.ม. Digital
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[var(--glass-strong)] border border-[var(--glass-border)] text-[11px] font-medium text-[var(--text-2)]">
                    ปร.ด. นวัตกรรม
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Accent Badge on Corner (Signature Monotree element) */}
          <div className="hidden md:flex absolute -bottom-5 -right-3 sm:-right-5 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--glass-strong)] border border-[var(--glass-border)] shadow-xl backdrop-blur-xl animate-bounce duration-1000">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--brand)] to-[var(--brand-light)] text-[var(--on-brand)] flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs font-bold text-[var(--text)]">AI-Powered Education</div>
              <div className="text-[10px] text-[var(--text-muted)]">มาตรฐานสากล 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
