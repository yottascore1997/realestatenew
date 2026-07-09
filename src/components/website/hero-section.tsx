"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, MapPin, Building2, Play, Rocket, X,
  ShieldCheck, Award, BadgeCheck, Landmark, Home, Key, Store, Wallet,
} from "lucide-react";
import { WebsiteHeader } from "@/components/website/website-header";
import { IconSelect } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { HeroSearchData } from "@/lib/website/get-hero-data";
import { HERO_BUDGET_OPTIONS } from "@/lib/website/get-hero-data";

export const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const SEARCH_TABS = [
  { key: "buy", label: "Buy", icon: Home, href: "/properties" },
  { key: "projects", label: "New Projects", icon: Rocket, href: "/projects" },
  { key: "commercial", label: "Commercial", icon: Store, href: "/properties" },
] as const;

const TRUST_ICONS = { ShieldCheck, Building2, Award, BadgeCheck, Landmark };

function buildTrustItems(stats: HeroSearchData["stats"]) {
  const fmt = (n: number, fallback: string) => (n > 0 ? `${n.toLocaleString("en-IN")}+` : fallback);
  return [
    { label: "RERA Verified", icon: "ShieldCheck" as const },
    { label: `${fmt(stats.projectCount, "2000+")} Projects`, icon: "Building2" as const },
    { label: `${fmt(stats.propertyCount, "1200+")} Properties`, icon: "Award" as const },
    { label: `${fmt(stats.cityCount, "25+")} Cities`, icon: "BadgeCheck" as const },
  ];
}

type HeroSectionProps = {
  heroData: HeroSearchData;
};

const heroSelectShell =
  "focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-200 hover:border-orange-300 hover:shadow-[0_4px_16px_rgba(249,115,22,0.12)]";

const heroSelectIcon = "h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-orange-500";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const trustStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
};

const trustItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroSection({ heroData }: HeroSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);

  const { cities, propertyTypes, stats } = heroData;
  const trustDisplay = buildTrustItems(stats);

  const handleSearch = () => {
    const tab = SEARCH_TABS.find((t) => t.key === activeTab);
    const params = new URLSearchParams();
    if (location) params.set("search", location);
    if (propertyType) params.set("type", propertyType);
    if (budget) params.set("budget", budget);

    if (activeTab === "rent") {
      params.set("status", "FOR_RENT");
    } else if (activeTab === "commercial") {
      params.set("status", "FOR_SALE");
      if (!propertyType) params.set("type", "COMMERCIAL");
    } else if (activeTab === "buy") {
      params.set("status", "FOR_SALE");
    }

    const qs = params.toString();
    router.push(`${tab?.href ?? "/properties"}${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="relative">
      {/* Hero + video — reduced height */}
      <div className="relative min-h-[460px] overflow-hidden sm:min-h-[500px] lg:min-h-[520px]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
        >
          <video className="h-full w-full object-cover" src={VIDEO_URL} autoPlay loop muted playsInline />
        </motion.div>

        {/* Subtle bottom-only overlay for text readability — not a white wash */}
        <div className="hero-video-overlay pointer-events-none absolute inset-0" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 sm:pt-10 sm:pb-5 lg:px-8 lg:pt-12">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-orange-400/30 bg-black/35 px-3.5 py-1.5 shadow-lg backdrop-blur-md"
          >
            <div className="hero-badge-shine pointer-events-none absolute inset-0" />
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck className="relative h-3.5 w-3.5 text-orange-400" strokeWidth={2} />
            </motion.div>
            <span className="website-badge-text relative text-orange-50">
              India&apos;s Most Trusted Real Estate Platform
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="hero-text-shadow website-type mt-4 max-w-2xl text-[2rem] leading-[1.15] text-white sm:mt-5 sm:text-[2.75rem] lg:text-[3rem]"
          >
            Find Your{" "}
            <motion.span
              className="hero-dream-glow inline-block mx-1.5 px-3.5 py-0.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black shadow-lg shadow-orange-500/30 text-[0.9em]"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.6, type: "spring", stiffness: 200 }}
            >
              Dream
            </motion.span> {" "}
            Property
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="hero-subtitle-glow website-body-text mt-2.5 max-w-md text-orange-50/90 sm:mt-3 sm:text-[15px]"
          >
            Premium properties across{" "}
            {stats.cityCount > 0 ? `${stats.cityCount} cities` : "top cities"} —{" "}
            {stats.propertyCount > 0
              ? `${stats.propertyCount.toLocaleString("en-IN")}+ listings from database`
              : "trusted builders & outstanding experiences"}
          </motion.p>

          <motion.div
            custom={2.5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3"
          >
            <motion.button
              type="button"
              onClick={() => setVideoOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.45)]">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-white text-white" />
              </span>
              Watch Video
            </motion.button>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition-all hover:bg-orange-600"
            >
              <Home className="h-4 w-4" />
              Explore Properties
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/35"
            >
              <Rocket className="h-4 w-4 text-orange-300" />
              New Projects
            </Link>
          </motion.div>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-6 w-full max-w-5xl rounded-2xl bg-white/95 shadow-[0_12px_48px_rgba(0,0,0,0.18)] ring-1 ring-white/60 backdrop-blur-sm sm:mt-7"
          >
            <div className="flex overflow-x-auto border-b border-slate-100">
              {SEARCH_TABS.map(({ key, label, icon: Icon }, idx) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2.5 px-5 py-3 text-sm transition-all duration-300 sm:px-6",
                    idx < SEARCH_TABS.length - 1 && "border-r border-slate-100",
                    activeTab === key ? "font-semibold text-[#0f1729]" : "font-medium text-slate-400 hover:text-slate-600"
                  )}
                >
                  {activeTab === key ? (
                    <motion.span
                      layoutId="hero-tab-dot"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  ) : (
                    <span className="h-1.5 w-1.5 shrink-0" aria-hidden />
                  )}
                  <Icon className={cn("h-4 w-4 transition-colors", activeTab === key ? "text-orange-500" : "text-slate-300")} strokeWidth={1.75} />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-stretch sm:p-4">
              <IconSelect
                icon={<MapPin className={heroSelectIcon} strokeWidth={1.75} />}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                shellClassName={cn(heroSelectShell, "flex-1")}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </IconSelect>

              <IconSelect
                icon={<Building2 className={heroSelectIcon} strokeWidth={1.75} />}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                shellClassName={cn(heroSelectShell, "flex-1")}
              >
                <option value="">All Type</option>
                {propertyTypes.map(({ value, label, count }) => (
                  <option key={value} value={value}>
                    {label}{count > 0 ? ` (${count})` : ""}
                  </option>
                ))}
              </IconSelect>

              <IconSelect
                icon={<Wallet className={heroSelectIcon} strokeWidth={1.75} />}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                shellClassName={cn(heroSelectShell, "flex-1")}
              >
                {HERO_BUDGET_OPTIONS.map(({ value, label }) => (
                  <option key={value || "any"} value={value}>{label}</option>
                ))}
              </IconSelect>

              <motion.button
                type="button"
                onClick={handleSearch}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(249,115,22,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] sm:min-w-[190px]"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
                Search Properties
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust bar — 4 items, black strip */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={trustStagger}
        className="relative z-10 bg-[#0a0a0a]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-3 gap-y-2.5 px-4 py-3 sm:gap-x-4 sm:py-3.5 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustDisplay.map(({ label, icon }) => {
            const Icon = TRUST_ICONS[icon as keyof typeof TRUST_ICONS] ?? ShieldCheck;
            return (
              <motion.div
                key={label}
                variants={trustItem}
                className="flex items-center gap-2 sm:justify-center sm:gap-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-orange-400 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                <span className="text-[11px] font-semibold tracking-wide text-white sm:text-xs">{label}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Watch video modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setVideoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Property showcase video"
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            <video
              src={VIDEO_URL}
              controls
              autoPlay
              className="aspect-video w-full bg-black object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
}
