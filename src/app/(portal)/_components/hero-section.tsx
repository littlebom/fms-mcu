import Link from "next/link";
import { BookOpen, Newspaper, ChevronDown } from "lucide-react";
import type { TFunction } from "@/shared/lib/i18n/translate";
import { FutureSkillsOrbit } from "./future-skills-orbit";

interface HeroSectionProps {
  t: TFunction;
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="hero-bleed glass relative" aria-label="แนะนำคณะและหลักสูตร">
      <div className="hero">
        <div>
          <div className="eyebrow">FMS · DIGITAL INNOVATION CAMPUS</div>
          <h1 className="display">
            {t("portal.hero.title1")}
            <br />
            <span className="ai">{t("portal.hero.title2")}</span>
          </h1>
          <div className="lede">{t("portal.hero.badge")}</div>
          <p className="sub">{t("portal.hero.subtitle")}</p>

          <div className="cta-row">
            <Link href="/programs">
              <button className="btn-primary inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{t("portal.hero.inputButton")}</span>
              </button>
            </Link>
            <Link href="/articles">
              <button className="btn-ghost inline-flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                <span>{t("portal.hero.ctaNews")}</span>
              </button>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hstat">
              <b className="num">100%</b>
              <span>{t("portal.stats.employment")}</span>
            </div>
            <div className="hstat">
              <b className="num">50+</b>
              <span>{t("portal.stats.research")}</span>
            </div>
            <div className="hstat">
              <b className="num">20+</b>
              <span>{t("portal.stats.partnerships")}</span>
            </div>
            <div className="hstat">
              <b className="num">1,200+</b>
              <span>{t("portal.hero.statStudents")}</span>
            </div>
          </div>
        </div>

        <div className="hero-vis">
          <FutureSkillsOrbit />
          <div className="orbit-cap display">Future Skills</div>
        </div>
      </div>

      {/* Floating scroll down indicator */}
      <div className="flex justify-center pb-6">
        <a
          href="#portal-content"
          aria-label="Scroll to content"
          title="เลื่อนลงเพื่อดูบริการและเนื้อหา"
          className="group flex flex-col items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <span className="font-medium tracking-wide">เลื่อนลงเพื่อดูบริการ</span>
          <div className="w-8 h-8 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-sm flex items-center justify-center group-hover:bg-[var(--glass-strong)] group-hover:translate-y-0.5 transition-all">
            <ChevronDown className="w-4 h-4 text-primary" />
          </div>
        </a>
      </div>
    </section>
  );
}
