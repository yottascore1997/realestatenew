"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { PLACEHOLDER_LAUNCHES } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

export type FeaturedLaunch = {
  id: string;
  name: string;
  builder?: string;
  location: string;
  city: string;
  priceFrom?: number | null;
  priceTo?: number | null;
  bhk?: string;
  possession?: string;
  offer?: string;
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

function FeaturedCard({ launch }: { launch: FeaturedLaunch & { builder: string; offer: string } }) {
  const builder = launch.builder ?? launch.name.split(" ")[0];

  return (
    <div className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 lg:min-h-[400px] lg:flex-row">
      {/* Details panel */}
      <div className="flex w-full flex-col justify-between bg-gradient-to-br from-white via-violet-50/40 to-pink-50/50 p-6 sm:p-8 lg:w-[38%] lg:min-w-[320px] lg:max-w-[420px]">
        <div>
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-white text-sm font-black text-violet-700 shadow-sm">
              {builderInitials(builder)}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="truncate text-sm font-bold text-[#111827] sm:text-base">{builder}</p>
              <Link
                href="/projects"
                className="mt-0.5 inline-block text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline"
              >
                View Projects
              </Link>
            </div>
          </div>

          <h3 className="mt-6 line-clamp-2 text-xl font-black leading-tight text-[#111827] sm:text-2xl lg:text-[1.65rem]">
            {launch.name}
          </h3>
          <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-gray-500 sm:text-base">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
            <span>
              {launch.location}, {launch.city}
            </span>
          </p>

          <p className="mt-5 text-2xl font-black tracking-tight text-[#111827] sm:text-3xl lg:text-[2rem]">
            {formatLaunchPrice(launch.priceFrom, launch.priceTo)}
          </p>

          {launch.bhk && (
            <p className="mt-2 text-sm font-medium text-gray-600 sm:text-base">{launch.bhk}</p>
          )}
          {launch.possession && (
            <p className="mt-1 text-xs font-medium text-gray-400 sm:text-sm">Possession {launch.possession}</p>
          )}

          {launch.offer && (
            <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-lg border border-pink-200/80 bg-pink-50 px-3 py-2">
              <Sparkles className="h-4 w-4 shrink-0 text-pink-500" />
              <span className="truncate text-xs font-semibold text-pink-700 sm:text-sm">{launch.offer}</span>
            </div>
          )}
        </div>

        <Link
          href="/contact"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 text-base font-bold text-white shadow-[0_4px_16px_rgba(5,150,105,0.35)] transition-colors hover:bg-emerald-700 sm:h-[52px] sm:text-lg"
        >
          Contact
        </Link>
      </div>

      {/* Hero image */}
      <div className="relative min-h-[240px] flex-1 sm:min-h-[300px] lg:min-h-0">
        <img
          src={launch.image || ""}
          alt={launch.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/20 via-transparent to-transparent lg:from-violet-950/30" />
        <div className="absolute left-4 top-4 max-w-[70%] rounded-lg bg-black/35 px-3 py-2 backdrop-blur-sm sm:left-6 sm:top-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 sm:text-xs">{builder}</p>
          <p className="mt-0.5 line-clamp-2 text-sm font-bold text-white sm:text-base">{launch.name}</p>
        </div>
        <span className="absolute right-4 top-4 rounded-md bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:right-6 sm:top-6">
          New Launch
        </span>
      </div>
    </div>
  );
}

type FeaturedLaunchesSectionProps = {
  launches: FeaturedLaunch[];
  header?: ReactNode;
};

export function FeaturedLaunchesSection({ launches, header }: FeaturedLaunchesSectionProps) {
  const [idx, setIdx] = useState(0);

  const items = Array.from({ length: 4 }, (_, i) => {
    const l = launches[i];
    const ph = PLACEHOLDER_LAUNCHES[i];
    if (l) {
      return {
        id: l.id,
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
    return { ...ph };
  });

  const total = items.length;
  const current = items[idx];

  const go = (dir: -1 | 1) => setIdx((i) => (i + dir + total) % total);

  return (
    <section className="border-y border-violet-100/60 bg-gradient-to-b from-[#faf8ff] via-white to-white pb-6 pt-6 sm:pb-10 sm:pt-8 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {header}

        <div className="relative mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="absolute -left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all hover:border-violet-300 hover:text-violet-600 sm:flex lg:-left-5 lg:h-12 lg:w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="absolute -right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all hover:border-violet-300 hover:text-violet-600 sm:flex lg:-right-5 lg:h-12 lg:w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <FeaturedCard launch={current} />
            </motion.div>
          </AnimatePresence>

          {/* Mobile nav */}
          <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === idx ? "w-6 bg-violet-600" : "w-2 bg-slate-300"
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop dots */}
          <div className="mt-5 hidden justify-center gap-2 sm:flex">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
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
