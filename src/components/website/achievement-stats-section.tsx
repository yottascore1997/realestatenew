"use client";

import { motion } from "framer-motion";
import { Building2, HardHat, MapPin, Users, Sparkles, type LucideIcon } from "lucide-react";
import { PLATFORM_STATS } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = { Building2, HardHat, MapPin, Users };

const CARD_THEMES = [
  {
    gradient: "from-[#0a2240] via-[#102C57] to-[#163d6e]",
    iconBg: "bg-[#d4af7a] text-[#0c2340]",
    wave: "from-white/10",
  },
  {
    gradient: "from-[#102C57] via-[#1a3a6b] to-[#0f2847]",
    iconBg: "bg-white text-[#102C57]",
    wave: "from-white/8",
  },
  {
    gradient: "from-[#0c2340] via-[#123a5c] to-[#102C57]",
    iconBg: "bg-[#faf6ef] text-[#b8922f]",
    wave: "from-[#d4af7a]/8",
  },
  {
    gradient: "from-[#8b6f2e] via-[#b8922f] to-[#c9a962]",
    iconBg: "bg-white text-[#8b6f2e]",
    wave: "from-white/15",
  },
];

function SkylineSilhouette() {
  return (
    <svg viewBox="0 0 120 28" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <path
        fill="currentColor"
        d="M0 28V18h8v-6h6v6h4V8h5v10h6V14h8v14h5V10h4v8h6v10h5V16h7v12h4V20h6v8h5V12h8v16h4V22h6v6H0z"
        opacity="0.35"
      />
    </svg>
  );
}

export function AchievementStatsSection() {
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#e8dcc8]/60 p-5 shadow-[0_20px_60px_rgba(12,35,64,0.07)] sm:p-7 lg:p-9">
          {/* Background image — no overlay layer */}
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=500&fit=crop&q=80"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right"
          />

          {/* Decorative dots */}
          <div
            className="pointer-events-none absolute left-5 top-5 hidden h-16 w-16 opacity-40 sm:block"
            style={{
              backgroundImage: "radial-gradient(circle, #d4af7a55 1.5px, transparent 1.5px)",
              backgroundSize: "10px 10px",
            }}
          />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
            {/* Left copy */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative rounded-2xl bg-white/90 p-4 backdrop-blur-[2px] sm:p-5 lg:w-[34%] lg:shrink-0"
            >
              <div className="pointer-events-none absolute -left-2 top-1 h-full w-1 rounded-full bg-gradient-to-b from-orange-400 via-violet-400/40 to-transparent opacity-80 sm:-left-3" />

              <p className="eyebrow-orange">
                <Sparkles className="h-3.5 w-3.5" /> Our Achievement
              </p>

              <h2 className="website-section-title mt-2 text-2xl sm:text-[1.65rem] lg:text-3xl">
                Building Trust.{" "}
                <span className="website-section-title-accent">Delivering Dreams.</span>
              </h2>

              <p className="website-section-desc mt-3 max-w-sm text-sm sm:text-base">
                Numbers that reflect our commitment to helping you find the{" "}
                <span className="font-semibold text-[#111827]">perfect property</span>.
              </p>

              <div className="accent-bar-orange mt-4" />
            </motion.div>

            {/* Stat cards */}
            <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-stretch sm:justify-end lg:gap-0">
              {PLATFORM_STATS.map(({ value, label, icon }, i) => {
                const Icon = ICON_MAP[icon] ?? Building2;
                const theme = CARD_THEMES[i] ?? CARD_THEMES[0];
                return (
                  <div key={label} className="flex flex-1 items-stretch sm:min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.45 }}
                      className={cn(
                        "relative flex min-h-[148px] flex-1 flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-b px-3 pb-3 pt-5 text-center shadow-lg sm:min-h-[168px] sm:rounded-none sm:first:rounded-l-2xl sm:last:rounded-r-2xl lg:px-4 lg:pt-6",
                        theme.gradient,
                        i === 0 && "sm:rounded-l-2xl",
                        i === PLATFORM_STATS.length - 1 && "sm:rounded-r-2xl"
                      )}
                    >
                      <div
                        className={cn(
                          "relative z-10 flex h-11 w-11 items-center justify-center rounded-full shadow-md sm:h-12 sm:w-12",
                          theme.iconBg
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <p className="relative z-10 mt-3 text-2xl font-bold tracking-tight text-white sm:text-[1.65rem] lg:text-3xl">
                        {value}
                      </p>
                      <p className="relative z-10 mt-1 text-[11px] font-medium leading-snug text-white/90 sm:text-xs">
                        {label}
                      </p>

                      {/* Inner wave */}
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-x-0 bottom-12 h-20 bg-gradient-to-t to-transparent",
                          theme.wave
                        )}
                      />

                      {/* Skyline */}
                      <div className="absolute inset-x-0 bottom-0 h-10 text-white sm:h-11">
                        <SkylineSilhouette />
                      </div>
                    </motion.div>

                    {i < PLATFORM_STATS.length - 1 && (
                      <div
                        className="relative z-10 mx-0 hidden w-3 shrink-0 items-center justify-center sm:flex lg:w-4"
                        aria-hidden
                      >
                        <div className="h-2.5 w-2.5 rotate-45 border border-[#e8dcc8] bg-white shadow-sm" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
