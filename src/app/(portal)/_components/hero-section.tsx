import type { TFunction } from "@/shared/lib/i18n/translate";

interface HeroSectionProps {
  t: TFunction;
}

export function HeroSection({ t: _t }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden bg-white dark:bg-[#000000] select-none transition-colors duration-500">
      {/* ── Centerpiece Stage: Authentic MotionSites 3D Iridescent Silk Artwork ── */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <div className="relative w-full aspect-[1470/1080] max-h-[calc(100vh-90px)] flex items-center justify-center">
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

          {/* Accessible Semantic Typography for SEO & Screen Readers */}
          <h1 className="sr-only">retro soul, modern vision.</h1>
          <p className="sr-only">
            I&apos;m a cross-functional creative with 5+ years experience crafting for digital and physical media with a clean, detail-driven style.
          </p>

          {/* ── Interactive Hit Areas Matching The Original Video Coordinates ── */}
          {/* 1. Bottom Center: Animated Floating Down Chevron (Scrolls to portal content) */}
          <a
            href="#portal-content"
            aria-label="Scroll to content"
            title="เลื่อนลงเพื่อดูบริการและเนื้อหา"
            className="group absolute bottom-[1.8%] left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all z-20 cursor-pointer"
          >
            <span className="sr-only">Scroll down</span>
            {/* Subtle indicator with active pulse effect on hover */}
            <span className="w-8 h-8 rounded-full border border-black/0 group-hover:border-black/20 dark:group-hover:border-white/30 transition-all scale-90 group-hover:scale-110" />
          </a>

          {/* 2. Bottom Right: Social / Portfolio Hit Area Links */}
          <div className="absolute bottom-[2%] right-[2.5%] hidden sm:flex items-center gap-3 lg:gap-5 z-20">
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noreferrer"
              className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Dribbble"
            >
              <span className="opacity-0 text-xs font-medium">Dribbble</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Twitter"
            >
              <span className="opacity-0 text-xs font-medium">Twitter</span>
            </a>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noreferrer"
              className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Unsplash"
            >
              <span className="opacity-0 text-xs font-medium">Unsplash</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
