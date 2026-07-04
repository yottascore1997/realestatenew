"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const NAVY = "#0f1729";

function Wordmark({
  theme,
  size = "md",
  showRealty = false,
  showTagline = false,
  className,
}: {
  theme: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showRealty?: boolean;
  showTagline?: boolean;
  className?: string;
}) {
  const onDark = theme === "light";

  const titleSize = {
    sm: "text-base",
    md: "text-xl sm:text-[1.35rem]",
    lg: "text-2xl sm:text-[1.65rem]",
  }[size];

  return (
    <div className={cn("flex flex-col justify-center leading-none", className)}>
      <p
        className={cn(
          "website-type font-semibold tracking-wide",
          titleSize,
          onDark && "hero-text-shadow"
        )}
      >
        <span className={onDark ? "text-white" : "text-[#0f1729]"}>Tri</span>
        <span
          className={cn(
            "inline-block text-[1.05em] text-orange-400",
            onDark ? "hero-dream-glow" : "brand-accent-glow-light"
          )}
        >
          yards
        </span>
      </p>

      {showRealty && (
        <div className={cn("flex items-center gap-1.5", showTagline ? "mt-1.5 gap-2" : "mt-1")}>
          <span className={cn("h-px", showTagline ? "w-6" : "w-4", onDark ? "bg-orange-400/60" : "bg-orange-400/80")} />
          <span
            className={cn(
              "website-badge-text uppercase",
              showTagline ? "tracking-[0.22em]" : "text-[10px] tracking-[0.2em]",
              onDark ? "text-orange-100/85" : "text-slate-500"
            )}
          >
            Realty
          </span>
          <span className={cn("h-px", showTagline ? "w-6" : "w-4", onDark ? "bg-orange-400/60" : "bg-orange-400/80")} />
        </div>
      )}

      {showTagline && (
        <p
          className={cn(
            "website-body-text mt-2 text-[10px] font-semibold uppercase tracking-[0.2em]",
            onDark ? "text-white/40" : "text-slate-400"
          )}
        >
          Trust · Transparency · Triumph
        </p>
      )}
    </div>
  );
}

function FullEmblem({ size = 52 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const g = `g-${uid}`;

  return (
    <svg viewBox="0 0 56 56" width={size} height={size} className="shrink-0" aria-hidden>
      <defs>
        <linearGradient id={g} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="52" height="52" rx="14" fill={NAVY} />
      <rect x="2" y="2" width="52" height="52" rx="14" fill="none" stroke={`url(#${g})`} strokeWidth="1.2" opacity="0.75" />
      <text x="28" y="35" textAnchor="middle" fill={`url(#${g})`} fontFamily="Inter, sans-serif" fontSize="20" fontWeight="700">
        TR
      </text>
      <path d="M10 46 Q28 42 46 46" fill="none" stroke={`url(#${g})`} strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

export type TriyardsLogoProps = {
  className?: string;
  theme?: "dark" | "light";
  variant?: "compact" | "full";
  height?: number;
  showTagline?: boolean;
};

export function TriyardsLogoSvg({
  className,
  theme = "dark",
  variant = "compact",
  height = 48,
  showTagline,
}: TriyardsLogoProps) {
  const full = variant === "full";
  const markSize = Math.round(height * 0.82);
  const tagline = showTagline ?? full;

  return (
    <div className={cn("flex items-center", full ? "gap-3.5" : "gap-3", className)}>
      <FullEmblem size={markSize} />
      <Wordmark
        theme={theme}
        size={full ? "lg" : "md"}
        showRealty
        showTagline={tagline}
      />
    </div>
  );
}
