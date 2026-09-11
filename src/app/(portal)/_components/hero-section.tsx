import Link from "next/link";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TFunction } from "@/shared/lib/i18n/translate";

interface HeroSectionProps {
  t: TFunction;
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-28 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("portal.hero.badge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            {t("portal.hero.title1")} <br />
            <span className="text-primary">{t("portal.hero.title2")}</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("portal.hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/articles">
              <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 gap-2">
                {t("portal.hero.ctaNews")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/faculty">
              <Button size="lg" variant="outline" className="rounded-full gap-2">
                <Users className="h-4 w-4" />
                {t("portal.hero.ctaFaculty")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
