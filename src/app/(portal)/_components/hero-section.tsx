import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { TFunction } from "@/shared/lib/i18n/translate";

interface HeroSectionProps {
  t: TFunction;
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-8 select-none">
      {/* ── CSS Animations for Fluid Organic Aurora & Breathing Motion ── */}
      <style>{`
        @keyframes aurora-float {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate3d(24px, -18px, 0) rotate(6deg) scale(1.06, 0.96);
          }
          66% {
            transform: translate3d(-18px, 22px, 0) rotate(-5deg) scale(0.96, 1.05);
          }
        }

        @keyframes aurora-wave-crest {
          0%, 100% {
            transform: rotate(-24deg) scale(1) translate3d(0, 0, 0);
            opacity: 0.88;
          }
          50% {
            transform: rotate(-18deg) scale(1.08, 0.96) translate3d(12px, -8px, 0);
            opacity: 0.98;
          }
        }

        @keyframes pulse-soft {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.04); }
        }

        @keyframes chevron-float {
          0%, 100% { transform: translateY(0); opacity: 0.65; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>

      {/* ── TOP CORNER NAVIGATION BAR (Marcello Costa Minimalist Style) ── */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold tracking-tight text-[var(--text)] pt-2 opacity-85">
        <span className="font-bold tracking-tight">marcellocosta</span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--text)] inline-block" />
        </div>
      </div>

      {/* ── CENTER STAGE: Living Aurora Mesh & Serif Typography ── */}
      <div className="relative w-full max-w-6xl mx-auto flex-1 flex flex-col items-center justify-center text-center my-auto py-12">
        {/* ═══ 1. Organic Fluid Aurora Mesh Gradient (Exact matching screenshot) ═══ */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
          aria-hidden="true"
        >
          {/* Main animated morphing aurora container */}
          <div
            className="relative w-[480px] sm:w-[680px] lg:w-[880px] h-[360px] sm:h-[480px] lg:h-[560px]"
            style={{
              animation: "aurora-float 14s ease-in-out infinite",
              willChange: "transform",
            }}
          >
            {/* Layer A: Deep Magenta & Purple Core */}
            <div
              className="absolute top-1/4 left-1/3 w-[340px] h-[280px] rounded-full blur-[65px] opacity-90"
              style={{
                background: "radial-gradient(circle at center, #C026D3 0%, #9333EA 45%, #7E22CE 75%, transparent 100%)",
                animation: "pulse-soft 8s ease-in-out infinite",
              }}
            />

            {/* Layer B: Radiant Warm Amber & Sunset Orange Ribbon (Lower-right sweep) */}
            <div
              className="absolute bottom-6 right-12 w-[420px] h-[320px] rounded-full blur-[60px] opacity-90"
              style={{
                background: "radial-gradient(circle at 60% 60%, #EA580C 0%, #F97316 40%, #FB923C 70%, transparent 100%)",
                animation: "pulse-soft 10s ease-in-out infinite reverse",
              }}
            />

            {/* Layer C: Soft Periwinkle & Lavender Haze (Top-left wing) */}
            <div
              className="absolute top-4 left-8 w-[380px] h-[260px] rounded-full blur-[70px] opacity-80"
              style={{
                background: "radial-gradient(circle at 30% 30%, #A5B4FC 0%, #C4B5FD 45%, transparent 75%)",
              }}
            />

            {/* Layer D: Diagonal Sharp Folded Silk Ribbon Crest (The signature sharp edge in screenshot) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: "aurora-wave-crest 12s ease-in-out infinite",
                willChange: "transform",
              }}
            >
              <div
                className="w-[520px] sm:w-[720px] h-[180px] sm:h-[240px] rounded-[140px] blur-[30px] opacity-85"
                style={{
                  background: "linear-gradient(132deg, rgba(165,180,252,0.6) 0%, rgba(192,38,211,0.9) 38%, rgba(249,115,22,0.95) 72%, rgba(254,215,170,0.4) 100%)",
                  boxShadow: "0 0 50px rgba(249,115,22,0.45)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══ 2. Modern Serif Typography ═══ */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 px-4">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.25rem] font-normal tracking-[-0.035em] text-[var(--text)] leading-[1.04]"
            style={{
              fontFamily: 'Playfair Display, "Instrument Serif", Georgia, serif',
            }}
          >
            retro soul, modern vision.
          </h1>

          {/* Subtitle description */}
          <p className="text-sm sm:text-base md:text-lg text-[var(--text-2)] max-w-xl mx-auto leading-relaxed font-normal pt-1 opacity-90">
            I&apos;m a cross-functional creative with 5+ years experience crafting for digital and physical media with a clean, detail-driven style.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[var(--text)] text-[var(--background)] hover:opacity-90 transition-all hover:scale-105 shadow-sm"
            >
              <span>{t("portal.services.programsAction")}</span>
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border border-[var(--glass-border)] bg-[var(--glass)] hover:bg-[var(--glass-strong)] text-[var(--text)] backdrop-blur-md transition-all hover:scale-105"
            >
              <span>{t("portal.hero.ctaNews")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CONTROLS & FOOTNOTE BAR ── */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs text-[var(--text-muted)] pb-2 pt-6">
        {/* Bottom Left: Copyright */}
        <div>© 2026 Marcello Costa</div>

        {/* Bottom Center: Animated Floating Chevron Down */}
        <a
          href="#quick-services"
          className="cursor-pointer hover:text-[var(--text)] transition-colors p-2"
          style={{ animation: "chevron-float 2.2s ease-in-out infinite" }}
          title="Scroll down"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-5 w-5" />
        </a>

        {/* Bottom Right: Minimal Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text)] transition-colors"
          >
            Dribbble
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text)] transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text)] transition-colors"
          >
            Unsplash
          </a>
        </div>
      </div>
    </section>
  );
}
