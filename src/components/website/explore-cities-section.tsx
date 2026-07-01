"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EXPLORE_CITIES } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

const CITIES = [...EXPLORE_CITIES];

const FALLBACK_CITY_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=600&fit=crop&q=85";

function CityCard({
  city,
  className,
  imageClassName,
}: {
  city: (typeof CITIES)[number];
  className?: string;
  imageClassName?: string;
}) {
  const [imgSrc, setImgSrc] = useState(city.image);

  return (
    <Link
      href={`/properties?search=${encodeURIComponent(city.name)}`}
      className={cn(
        "group relative block h-full min-h-[140px] overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 transition-all duration-500 hover:shadow-xl sm:min-h-[160px]",
        className
      )}
    >
      <img
        src={imgSrc}
        alt={city.name}
        onError={() => setImgSrc(FALLBACK_CITY_IMAGE)}
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110",
          imageClassName
        )}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />
      <div className="absolute inset-0 bg-orange-500/0 transition-colors duration-500 group-hover:bg-orange-500/10" />
      <div className="absolute bottom-0 left-0 p-3 sm:p-5">
        <p className="website-type text-base text-white drop-shadow-md sm:text-xl">{city.name}</p>
        <p className="mt-0.5 text-[10px] font-medium tracking-wide text-white/75 sm:text-[11px]">{city.count} Properties</p>
      </div>
    </Link>
  );
}

export function ExploreCitiesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const featured = CITIES[0];
  const gridTop = [CITIES[1], CITIES[2], CITIES[3]];
  const gridBottom = [CITIES[4], CITIES[5], CITIES[6]];

  return (
    <section className="bg-white pb-8 pt-3 sm:pb-12 sm:pt-5 lg:pb-14 lg:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="website-section-title">
            Explore <span className="website-section-title-accent">Properties in India</span>
          </h2>
        </motion.div>

        <div className="relative mt-4 sm:mt-6">
          {/* Nav arrows — mobile & tablet */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous cities"
            className="absolute left-0 top-[calc(50%-12px)] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-100 transition-all active:scale-95 sm:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next cities"
            className="absolute right-0 top-[calc(50%-12px)] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-100 transition-all active:scale-95 sm:hidden"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Desktop bento grid */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-3" style={{ height: "400px" }}>
            <CityCard city={featured} className="row-span-2 min-h-0 rounded-2xl" />
            {gridTop.map((city) => (
              <CityCard key={city.name} city={city} className="min-h-0 rounded-xl" />
            ))}
            {gridBottom.map((city) => (
              <CityCard key={city.name} city={city} className="min-h-0 rounded-xl" />
            ))}
          </div>

          {/* Tablet — compact 2-column bento */}
          <div className="hidden gap-2.5 sm:grid sm:grid-cols-2 md:gap-3 lg:hidden">
            <CityCard city={featured} className="min-h-[200px] rounded-xl sm:col-span-2 sm:min-h-[220px]" />
            {CITIES.slice(1).map((city) => (
              <CityCard key={city.name} city={city} className="min-h-[140px] rounded-xl md:min-h-[160px]" />
            ))}
          </div>

          {/* Mobile — horizontal swipe */}
          <div
            ref={scrollRef}
            className="flex gap-2.5 overflow-x-auto px-10 py-1 snap-x snap-mandatory scrollbar-hide sm:hidden"
          >
            {CITIES.map((city) => (
              <div
                key={city.name}
                className="h-[200px] w-[78vw] max-w-[260px] shrink-0 snap-center"
              >
                <CityCard city={city} className="h-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center sm:mt-7">
          <Link
            href="/properties"
            className="website-type inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm text-white transition-colors hover:bg-emerald-700 sm:w-auto sm:max-w-none sm:px-6"
          >
            View All Cities
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
