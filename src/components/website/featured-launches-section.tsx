"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Sparkles, Wallet, Layers, Calendar, ArrowRight } from "lucide-react";
import { PLACEHOLDER_LAUNCHES } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

export type FeaturedLaunch = {
  id: string;
  slug?: string;
  name: string;
  builder?: string | null;
  location: string;
  city: string;
  priceFrom?: number | null;
  priceTo?: number | null;
  bhk?: string | null;
  possession?: string | null;
  offer?: string | null;
  image?: string | null;
};

function formatCompactPrice(amount: number) {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${Number.isInteger(cr) ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  const lac = amount / 100000;
  return `₹${Number.isInteger(lac) ? lac.toFixed(0) : lac.toFixed(1)} L`;
}

function formatLaunchPrice(from?: number | null, to?: number | null) {
  if (!from) return "Price on Request";
  if (to && to > from) return `${formatCompactPrice(from)} - ${formatCompactPrice(to)}`;
  return `${formatCompactPrice(from)} onwards`;
}

function builderInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function slugFromName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getBuilderLogoStyle(name: string) {
  const lowercase = name.toLowerCase();
  if (lowercase.includes("lodha")) {
    return {
      font: "font-serif tracking-widest font-black text-[10px]",
      color: "text-[#8A1A1A] border-[#8A1A1A]/20 bg-[#8A1A1A]/5",
      text: "LODHA"
    };
  }
  if (lowercase.includes("godrej")) {
    return {
      font: "font-sans font-extrabold tracking-tight italic text-[10px]",
      color: "text-[#006838] border-[#006838]/20 bg-[#006838]/5",
      text: "Godrej"
    };
  }
  if (lowercase.includes("dlf")) {
    return {
      font: "font-sans font-black tracking-wide uppercase italic text-[10px]",
      color: "text-[#003366] border-[#003366]/20 bg-[#003366]/5",
      text: "DLF"
    };
  }
  if (lowercase.includes("piramal")) {
    return {
      font: "font-sans font-semibold tracking-wider uppercase text-[9px]",
      color: "text-[#a37c24] border-[#a37c24]/20 bg-[#a37c24]/5",
      text: "PIRAMAL"
    };
  }
  if (lowercase.includes("prestige")) {
    return {
      font: "font-serif font-black tracking-wider uppercase text-[9px]",
      color: "text-[#1d3557] border-[#1d3557]/20 bg-[#1d3557]/5",
      text: "PRESTIGE"
    };
  }
  if (lowercase.includes("tata")) {
    return {
      font: "font-sans font-black tracking-widest uppercase italic text-[10px]",
      color: "text-[#004B87] border-[#004B87]/20 bg-[#004B87]/5",
      text: "TATA"
    };
  }
  return {
    font: "font-sans font-bold tracking-wide uppercase text-[10px]",
    color: "text-slate-800 border-slate-200 bg-slate-50",
    text: name.slice(0, 8)
  };
}

function FeaturedCard({ launch }: { launch: FeaturedLaunch & { builder: string; offer: string; slug: string } }) {
  const builder = launch.builder ?? launch.name.split(" ")[0];
  const href = `/launches/${launch.slug}`;
  const logoStyle = getBuilderLogoStyle(builder);

  return (
    <Link href={href} className="group block">
      <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] group-hover:ring-violet-200 lg:min-h-[440px] lg:flex-row">
        {/* Details panel — left on desktop */}
        <div className="order-2 flex w-full flex-col justify-between bg-gradient-to-br from-white via-slate-50/20 to-violet-50/15 p-5 sm:p-6 lg:order-1 lg:w-[45%] lg:p-7">
          <div className="min-w-0">
            {/* Builder Header Card */}
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-16 shrink-0 items-center justify-center rounded-xl border px-1.5 shadow-sm text-center ${logoStyle.color}`}>
                <span className={`${logoStyle.font} leading-none block`}>
                  {logoStyle.text}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800 sm:text-sm">{builder}</p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-violet-600 uppercase tracking-wider group-hover:text-violet-700">
                  View Launch Page <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>

            {/* Launch Title */}
            <h3 className="mt-4 line-clamp-2 text-lg font-black leading-tight text-slate-900 sm:mt-5 sm:text-2xl lg:text-[1.65rem]">
              {launch.name}
            </h3>

            {/* Location */}
            <p className="mt-2 flex items-start gap-1 text-xs font-medium text-slate-500 sm:text-sm">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
              <span className="line-clamp-2">
                {launch.location}, {launch.city}
              </span>
            </p>

            {/* Specs Grid */}
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {/* Starting Price */}
              <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm text-center">
                <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <Wallet className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">Price</p>
                <p className="mt-0.5 truncate text-xs font-black text-slate-800">
                  {formatLaunchPrice(launch.priceFrom, launch.priceTo).split(" ")[0]}
                </p>
              </div>

              {/* BHK */}
              <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm text-center">
                <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">BHK</p>
                <p className="mt-0.5 truncate text-xs font-black text-slate-800">
                  {launch.bhk ? launch.bhk.split(" ")[0] + " BHK" : "2/3 BHK"}
                </p>
              </div>

              {/* Possession */}
              <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm text-center">
                <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">Possession</p>
                <p className="mt-0.5 truncate text-xs font-black text-slate-800">
                  {launch.possession ? launch.possession.split(" ").slice(-1)[0] : "Dec 2027"}
                </p>
              </div>
            </div>

            {/* Exclusive Offer Pill */}
            {launch.offer && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-pink-500/5 to-transparent px-3 py-2 sm:py-2.5">
                <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md shadow-orange-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.15em] leading-none">Special Deal</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 leading-none">{launch.offer}</span>
                </div>
              </div>
            )}
          </div>

          {/* Call To Action Button */}
          <span
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-[0_4px_16px_rgba(5,150,105,0.25)] transition-all duration-300 group-hover:shadow-[0_6px_24px_rgba(5,150,105,0.35)] group-hover:scale-[1.01] sm:h-12"
          >
            View Launch & Register <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {/* Right Side: Hero image — 55% width on desktop */}
        <div className="relative order-1 h-[220px] w-full shrink-0 overflow-hidden sm:h-[280px] lg:order-2 lg:h-auto lg:flex-1">
          <img
            src={launch.image || ""}
            alt={launch.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-slate-900/40 lg:via-transparent lg:to-transparent" />
          
          <span className="absolute left-4 top-4 rounded-xl bg-orange-500/90 backdrop-blur-sm px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-lg">
            Editor&apos;s Pick
          </span>

          <div className="absolute bottom-4 left-4 right-4 max-w-[85%] rounded-2xl bg-black/45 p-4 backdrop-blur-md border border-white/10 sm:bottom-6 sm:left-6 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">{builder}</p>
            <p className="mt-1 line-clamp-1 text-base font-black text-white sm:text-lg">{launch.name}</p>
            <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">{launch.location}, {launch.city}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

type FeaturedLaunchesSectionProps = {
  launches: FeaturedLaunch[];
  header?: ReactNode;
};

export function FeaturedLaunchesSection({ launches, header }: FeaturedLaunchesSectionProps) {
  const [idx, setIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const items = Array.from({ length: 4 }, (_, i) => {
    const l = launches[i];
    const ph = PLACEHOLDER_LAUNCHES[i];
    if (l) {
      return {
        id: l.id,
        slug: l.slug ?? ("slug" in ph ? ph.slug : slugFromName(l.name)),
        name: l.name,
        builder: l.builder ?? ph.builder,
        location: l.location || ph.location,
        city: l.city,
        priceFrom: l.priceFrom ?? ph.priceFrom,
        priceTo: l.priceTo ?? ph.priceTo,
        bhk: l.bhk ?? ph.bhk,
        possession: l.possession ?? ph.possession,
        offer: l.offer ?? ph.offer,
        image: l.image ?? ph.image,
      };
    }
    return { ...ph, slug: ph.slug };
  });

  const total = items.length;
  const current = items[idx];

  const go = (dir: -1 | 1) => setIdx((i) => (i + dir + total) % total);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setIdx((i) => (i + 1 + total) % total);
    }, 10000);
    return () => clearInterval(interval);
  }, [isHovered, idx, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) go(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section className="overflow-hidden border-y border-violet-100/60 bg-gradient-to-b from-[#faf8ff] via-white to-white pb-5 pt-5 sm:pb-10 sm:pt-8 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {header}

        <div 
          className="relative mt-4 sm:mt-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="absolute -left-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all hover:border-violet-300 hover:text-violet-600 md:flex lg:-left-5 lg:h-12 lg:w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="absolute -right-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all hover:border-violet-300 hover:text-violet-600 md:flex lg:-right-5 lg:h-12 lg:w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            className="touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <FeaturedCard launch={current} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile & tablet nav */}
          <div className="mt-3 flex items-center justify-center gap-2.5 sm:mt-4 md:hidden">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous project"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-wrap justify-center gap-1.5">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === idx ? "true" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === idx ? "w-5 bg-violet-600" : "w-1.5 bg-slate-300"
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next project"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop dots */}
          <div className="mt-5 hidden justify-center gap-2 md:flex">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === idx ? "true" : undefined}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-8 bg-violet-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
