"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { PLACEHOLDER_LAUNCHES } from "@/lib/website/constants";
import { ContactTrigger } from "@/components/website/contact-trigger";
import { cn } from "@/lib/utils";

export type FeaturedLaunch = {
  id: string;
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

function FeaturedCard({ launch }: { launch: FeaturedLaunch & { builder: string; offer: string } }) {
  const builder = launch.builder ?? launch.name.split(" ")[0];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:rounded-2xl sm:shadow-[0_8px_40px_rgba(15,23,42,0.12)] lg:min-h-[400px] lg:flex-row">
      {/* Hero image — top on mobile, right on desktop */}
      <div className="relative order-1 h-[200px] w-full shrink-0 sm:h-[260px] lg:order-2 lg:h-auto lg:min-h-[380px] lg:flex-1">
        <img
          src={launch.image || ""}
          alt={launch.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-violet-950/30 lg:via-transparent lg:to-transparent" />
        <span className="absolute right-3 top-3 rounded-md bg-orange-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md sm:right-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[10px]">
          New Launch
        </span>
        {/* Desktop/tablet image overlay */}
        <div className="absolute bottom-3 left-3 right-3 hidden max-w-[75%] rounded-lg bg-black/35 px-3 py-2 backdrop-blur-sm sm:block sm:bottom-auto sm:left-6 sm:top-6 sm:right-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 sm:text-xs">{builder}</p>
          <p className="mt-0.5 line-clamp-2 text-sm font-bold text-white sm:text-base">{launch.name}</p>
        </div>
      </div>

      {/* Details panel — below image on mobile, left on desktop */}
      <div className="order-2 flex w-full flex-col justify-between bg-gradient-to-br from-white via-violet-50/40 to-pink-50/50 p-4 sm:p-6 lg:order-1 lg:w-[38%] lg:min-w-[300px] lg:max-w-[420px] lg:p-8">
        <div className="min-w-0">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-violet-100 bg-white text-xs font-black text-violet-700 shadow-sm sm:h-14 sm:w-14 sm:rounded-xl sm:text-sm">
              {builderInitials(builder)}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="truncate text-sm font-bold text-[#111827] sm:text-base">{builder}</p>
              <Link
                href="/projects"
                className="mt-0.5 inline-block text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline sm:text-sm"
              >
                View Projects
              </Link>
            </div>
          </div>

          <h3 className="mt-4 line-clamp-2 text-lg font-black leading-snug text-[#111827] sm:mt-6 sm:text-2xl lg:text-[1.65rem]">
            {launch.name}
          </h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-gray-500 sm:mt-2 sm:text-base">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500 sm:h-4 sm:w-4" />
            <span className="line-clamp-2">
              {launch.location}, {launch.city}
            </span>
          </p>

          <p className="mt-3 break-words text-xl font-black tracking-tight text-[#111827] sm:mt-5 sm:text-3xl lg:text-[2rem]">
            {formatLaunchPrice(launch.priceFrom, launch.priceTo)}
          </p>

          {launch.bhk && (
            <p className="mt-1.5 text-xs font-medium text-gray-600 sm:mt-2 sm:text-base">{launch.bhk}</p>
          )}
          {launch.possession && (
            <p className="mt-0.5 text-[11px] font-medium text-gray-400 sm:mt-1 sm:text-sm">
              Possession {launch.possession}
            </p>
          )}

          {launch.offer && (
            <div className="mt-3 flex w-full max-w-full items-start gap-2 rounded-lg border border-pink-200/80 bg-pink-50 px-2.5 py-2 sm:mt-5 sm:inline-flex sm:w-auto sm:items-center sm:px-3">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-500 sm:mt-0 sm:h-4 sm:w-4" />
              <span className="line-clamp-2 text-[11px] font-semibold leading-snug text-pink-700 sm:line-clamp-1 sm:text-sm">
                {launch.offer}
              </span>
            </div>
          )}
        </div>

        <ContactTrigger
          inquiryType="New Projects"
          context={`${launch.name} — ${launch.city}`}
          defaultMessage={`I'm interested in ${launch.name} at ${launch.location}, ${launch.city}.`}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-[0_4px_16px_rgba(5,150,105,0.35)] transition-colors hover:bg-emerald-700 sm:mt-6 sm:h-12 sm:text-base lg:h-[52px] lg:text-lg"
        >
          Contact
        </ContactTrigger>
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
  const touchStartX = useRef<number | null>(null);

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

        <div className="relative mt-4 sm:mt-8">
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
