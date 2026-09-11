"use client";

import { useState } from "react";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TFunction } from "@/shared/lib/i18n/translate";

interface HeroSectionProps {
  t: TFunction;
}

export function HeroSection({ t }: HeroSectionProps) {
  const [query, setQuery] = useState("");

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background: Clean, airy Liyon backdrop with very subtle glow */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        {/* Soft radial glow in main brand color behind right illustration */}
        <div
          className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full blur-[130px] opacity-25 dark:opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, var(--brand-light) 0%, var(--brand) 60%, transparent 80%)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ══════════ LEFT COLUMN: Content & Action ══════════ */}
          <div className="lg:col-span-6 space-y-7">
            {/* Main Headline with Monotree-style hand-drawn underline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] font-extrabold tracking-[-0.03em] text-[var(--text)] leading-[1.12]">
                <span className="relative inline-block">
                  <span>{t("portal.hero.title1")}</span>
                  {/* Hand-drawn accent underline */}
                  <svg
                    className="absolute -bottom-2.5 left-0 w-full h-3.5 text-[var(--brand)] overflow-visible"
                    viewBox="0 0 240 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M 3 10 C 60 14, 170 3, 237 8"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 40 12 C 100 15, 190 6, 220 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </svg>
                </span>
                <span className="block mt-2 font-bold text-[var(--text)]">
                  {t("portal.hero.title2")}
                </span>
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-[var(--text-2)] leading-relaxed max-w-xl">
              {t("portal.hero.subtitle")}
            </p>

            {/* ── Monotree Combined Input + Action Button ── */}
            <div className="max-w-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (query.trim()) {
                    window.location.href = `/programs?q=${encodeURIComponent(query)}`;
                  } else {
                    window.location.href = "/programs";
                  }
                }}
                className="flex items-center gap-2 p-1.5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] shadow-sm hover:border-[var(--brand)] focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand-glow)] transition-all"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("portal.hero.inputPlaceholder")}
                  className="flex-1 bg-transparent px-3.5 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none min-w-0"
                />
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl font-semibold text-xs whitespace-nowrap shadow-sm transition-transform active:scale-95"
                  style={{
                    background: "var(--brand)",
                    color: "var(--on-brand)",
                    boxShadow: "0 4px 14px -3px var(--brand-glow)",
                  }}
                >
                  <span>{t("portal.hero.inputButton")}</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </form>
            </div>

            {/* ── Monotree Clean Metrics Row ── */}
            <div className="pt-2">
              <div className="flex items-center gap-8">
                {/* Metric 1 */}
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
                    98.4%
                  </div>
                  <div className="text-xs font-medium text-[var(--text-2)] mt-1">
                    {t("portal.hero.statEmployment")}
                  </div>
                </div>

                {/* Clean Vertical Divider */}
                <div className="h-10 w-px bg-[var(--glass-border)]" aria-hidden="true" />

                {/* Metric 2 */}
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
                    ~1.5k
                  </div>
                  <div className="text-xs font-medium text-[var(--text-2)] mt-1">
                    {t("portal.hero.statStudents")}
                  </div>
                </div>
              </div>

              {/* Star Rating & Accreditation Bar */}
              <div className="flex items-center gap-2.5 pt-5 text-xs text-[var(--text-2)]">
                <div className="flex items-center text-[var(--brand)] gap-0.5" aria-hidden="true">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current opacity-80" />
                </div>
                <span className="font-bold text-[var(--text)] text-sm">4.9</span>
                <span className="text-[var(--text-muted)]">•</span>
                <span className="text-[var(--text-muted)]">{t("portal.hero.ratingText")}</span>
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN: Signature Monotree 3D Isometric Wireframe Mockup ══════════ */}
          <div className="lg:col-span-6 relative flex items-center justify-center select-none">
            <div className="w-full max-w-[540px] aspect-[1.1/1] relative">
              <svg
                viewBox="0 0 540 480"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-md"
              >
                <defs>
                  {/* Subtle glass gradients */}
                  <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--glass-strong)" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="var(--glass)" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--brand-light)" />
                    <stop offset="100%" stopColor="var(--brand)" />
                  </linearGradient>
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="rgba(27,39,64,0.12)" />
                  </filter>
                </defs>

                {/* ── Background Wireframe Tree Branch (Monotree Signature) ── */}
                <g stroke="var(--glass-border)" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
                  <path d="M 310 320 L 310 140" />
                  <path d="M 310 240 L 260 210" />
                  <path d="M 310 190 L 350 165" />
                  <path d="M 310 280 L 360 255" />
                  <path d="M 260 210 L 240 220" />
                  <path d="M 350 165 L 370 175" />
                </g>

                {/* ── 3D Smartphone Device Outline (Isometric Angle) ── */}
                <g filter="url(#softShadow)">
                  {/* Back/depth layer */}
                  <rect
                    x="248"
                    y="72"
                    width="190"
                    height="340"
                    rx="32"
                    transform="matrix(0.88 -0.38 0 0.94 40 100)"
                    stroke="var(--glass-border)"
                    strokeWidth="2"
                    fill="var(--glass)"
                    opacity="0.5"
                  />
                  {/* Main front device body */}
                  <rect
                    x="230"
                    y="60"
                    width="190"
                    height="340"
                    rx="32"
                    transform="matrix(0.88 -0.38 0 0.94 30 90)"
                    stroke="var(--text)"
                    strokeWidth="2"
                    fill="var(--glass-strong)"
                  />
                  {/* Device Speaker Notch */}
                  <rect
                    x="305"
                    y="78"
                    width="42"
                    height="6"
                    rx="3"
                    transform="matrix(0.88 -0.38 0 0.94 30 90)"
                    fill="var(--glass-border)"
                  />
                </g>

                {/* ── Floating Isometric Card 1: Timetable / Calendar (Top Left) ── */}
                <g transform="translate(10, 20)" filter="url(#softShadow)">
                  {/* Card shape */}
                  <polygon
                    points="90,165 195,120 250,165 145,210"
                    fill="url(#cardGrad)"
                    stroke="var(--text)"
                    strokeWidth="1.8"
                  />
                  {/* Slot 1 */}
                  <polygon
                    points="115,165 165,142 195,166 145,189"
                    fill="none"
                    stroke="var(--glass-border)"
                    strokeWidth="1.5"
                    rx="4"
                  />
                  {/* Time label 09:00 */}
                  <text x="145" y="152" fill="var(--text-muted)" fontSize="8" fontFamily="monospace">09:00</text>
                  <text x="125" y="174" fill="var(--text)" fontSize="9" fontWeight="bold">AI Lab</text>
                  {/* Small tag icon */}
                  <polygon
                    points="60,205 90,192 105,204 75,217"
                    fill="var(--text)"
                  />
                  <text x="70" y="210" fill="var(--on-brand)" fontSize="7" fontWeight="bold">TUE, 12</text>
                </g>

                {/* ── Floating Isometric Card 2: Faculty Chat / Discussion (Center) ── */}
                <g transform="translate(150, 45)" filter="url(#softShadow)">
                  {/* Card base */}
                  <polygon
                    points="80,180 220,120 270,180 130,240"
                    fill="url(#cardGrad)"
                    stroke="var(--text)"
                    strokeWidth="1.8"
                  />
                  {/* Header text inside card */}
                  <text x="110" y="165" fill="var(--text)" fontSize="11" fontWeight="bold">FMS Chat</text>
                  <circle cx="215" cy="153" r="4" fill="var(--brand-light)" />
                  <text x="224" y="156" fill="var(--text-muted)" fontSize="9">42</text>

                  {/* Message bubble 1 (Light/Glass) */}
                  <polygon
                    points="95,195 170,163 185,180 110,212"
                    fill="var(--glass)"
                    stroke="var(--glass-border)"
                    strokeWidth="1.2"
                  />
                  <line x1="112" y1="192" x2="162" y2="171" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" />

                  {/* Message bubble 2 (Theme Brand Accent Pill - Monotree Green equivalent!) */}
                  <polygon
                    points="160,195 235,163 248,179 173,211"
                    fill="url(#brandGrad)"
                  />
                  <line x1="180" y1="192" x2="225" y2="173" stroke="var(--on-brand)" strokeWidth="3.5" strokeLinecap="round" />
                </g>

                {/* ── Floating Isometric Card 3: Curved / Waving "To-Do / Progress" Sheet (Bottom) ── */}
                <g transform="translate(60, 160)" filter="url(#softShadow)">
                  {/* Curving 3D Sheet with smooth wave */}
                  <path
                    d="M 120 180 Q 150 140 210 160 L 290 230 Q 230 220 190 250 Z"
                    fill="url(#cardGrad)"
                    stroke="var(--text)"
                    strokeWidth="1.8"
                  />
                  <text x="155" y="165" fill="var(--text)" fontSize="10" fontWeight="bold">To-do List</text>
                  {/* Checkmark square */}
                  <rect x="150" y="172" width="12" height="12" rx="3" fill="var(--brand)" />
                  <path d="M 153 178 L 155 180 L 159 175" stroke="var(--on-brand)" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Progress lines */}
                  <line x1="170" y1="178" x2="210" y2="178" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" />
                  <line x1="170" y1="190" x2="195" y2="190" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />

                  {/* Overall performance badge pill with theme accent */}
                  <polygon
                    points="220,165 315,190 295,240 200,215"
                    fill="var(--glass-strong)"
                    stroke="var(--text)"
                    strokeWidth="1.5"
                  />
                  {/* Sparkline bars inside badge */}
                  <line x1="225" y1="195" x2="225" y2="185" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="232" y1="197" x2="232" y2="180" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="239" y1="199" x2="239" y2="175" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="246" y1="201" x2="246" y2="170" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" />
                  <text x="252" y="185" fill="var(--text-muted)" fontSize="6">Overall tasks</text>
                  <text x="255" y="193" fill="var(--text-muted)" fontSize="6">performance:</text>
                  <text x="250" y="212" fill="var(--brand)" fontSize="10" fontWeight="bold">85.3% ▲</text>
                </g>

                {/* ── Floating Bottom Navigation Dock ── */}
                <g transform="translate(120, 310)" filter="url(#softShadow)">
                  <polygon
                    points="80,75 160,35 190,65 110,105"
                    fill="var(--glass-strong)"
                    stroke="var(--text)"
                    strokeWidth="1.6"
                  />
                  {/* Dock icons represented as clean minimalist shapes */}
                  <circle cx="102" cy="74" r="4.5" fill="var(--text)" />
                  <circle cx="118" cy="66" r="4.5" stroke="var(--text-muted)" strokeWidth="1.5" fill="none" />
                  <circle cx="134" cy="58" r="4.5" stroke="var(--text-muted)" strokeWidth="1.5" fill="none" />
                  <circle cx="150" cy="50" r="4.5" stroke="var(--text-muted)" strokeWidth="1.5" fill="none" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
