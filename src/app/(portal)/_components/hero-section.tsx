import { ChevronDown } from "lucide-react";
import type { TFunction } from "@/shared/lib/i18n/translate";

interface HeroSectionProps {
  t: TFunction;
}

export function HeroSection({ t: _t }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden bg-white dark:bg-[#000000] select-none transition-colors duration-500">
      {/* ── Centerpiece Stage: Authentic MotionSites 3D Iridescent Silk Artwork ── */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <div className="relative w-full aspect-[1470/1080] max-h-[calc(100vh-90px)] flex items-center justify-center overflow-hidden">
          {/* Authentic looping video playback with instant webp poster fallback */}
          <video
            src="/videos/creative-designer-hero.mp4"
            poster="/videos/creative-designer-poster.webp"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain pointer-events-none transition-all duration-500 dark:[filter:invert(1)_hue-rotate(180deg)]"
          />

          {/* ── Top Mask: ลบข้อความด้านบน (marcellocosta และจุดกลม) ให้เรียบเนียน ── */}
          <div
            className="absolute top-0 left-0 right-0 h-[8.5%] bg-white dark:bg-[#000000] z-10 pointer-events-none transition-colors duration-500"
            aria-hidden="true"
          />

          {/* ── Bottom Mask: ลบข้อความด้านล่าง (ลิขสิทธิ์ และ Dribbble / Twitter / Unsplash) ── */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[8.5%] bg-white dark:bg-[#000000] z-10 pointer-events-none transition-colors duration-500"
            aria-hidden="true"
          />

          {/* Accessible Semantic Typography for SEO & Screen Readers */}
          <h1 className="sr-only">retro soul, modern vision.</h1>
          <p className="sr-only">
            I&apos;m a cross-functional creative with 5+ years experience crafting for digital and physical media with a clean, detail-driven style.
          </p>

          {/* ── Clean Floating Down Chevron (Scrolls to portal content) ── */}
          <a
            href="#portal-content"
            aria-label="Scroll to content"
            title="เลื่อนลงเพื่อดูบริการและเนื้อหา"
            className="group absolute bottom-[1.8%] left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
