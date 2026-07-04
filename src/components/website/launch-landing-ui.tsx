"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Triyards launch LP design tokens — midnight · royal · orange · emerald · silver */
export const LP = {
  section: "py-14 sm:py-16 lg:py-[4.5rem]",
  container: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
  heading: "website-section-title text-[#0f1729]",
  body: "text-sm leading-relaxed text-slate-600 sm:text-[15px]",
} as const;

export function LaunchEyebrow({
  children,
  className,
  dark,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] sm:text-[11px]",
        dark
          ? "border border-white/15 bg-white/10 text-orange-300"
          : "border border-orange-200/80 bg-orange-50 text-orange-800",
        className
      )}
    >
      {children}
    </span>
  );
}

export function LaunchSectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <div className={align === "center" ? "flex justify-center" : ""}>{eyebrow}</div>}
      <h2
        className={cn(
          LP.heading,
          "mt-3 text-2xl sm:text-3xl lg:text-[2rem]",
          dark && "text-white"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-2.5", LP.body, dark && "text-white/70", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function LaunchBtn({
  href,
  onClick,
  variant = "primary",
  children,
  className,
}: {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children: ReactNode;
  className?: string;
}) {
  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold transition-all sm:h-12 sm:px-6";
  const styles = {
    primary:
      "bg-emerald-600 text-white shadow-[0_6px_20px_rgba(5,150,105,0.32)] hover:bg-emerald-700",
    secondary:
      "bg-orange-500 text-white shadow-[0_6px_20px_rgba(249,115,22,0.32)] hover:bg-orange-600",
    outline:
      "border-2 border-[#0f1729] bg-white text-[#0f1729] hover:bg-slate-50",
    ghost:
      "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
  };

  const cls = cn(base, styles[variant], className);

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function LaunchCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,41,0.06)] sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
