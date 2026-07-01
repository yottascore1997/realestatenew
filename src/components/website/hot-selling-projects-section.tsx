"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  HOT_SELLING_CITIES,
  HOT_SELLING_PROJECTS,
  type HotSellingCity,
} from "@/lib/website/constants";
import { cn, formatPriceRange } from "@/lib/utils";

export function HotSellingProjectsSection() {
  const [city, setCity] = useState<HotSellingCity>("Hyderabad");
  const scrollRef = useRef<HTMLDivElement>(null);

  const projects = HOT_SELLING_PROJECTS[city];

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [city]);

  const scrollCards = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 16;
    const amount = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden border-y border-orange-100/60 bg-gradient-to-b from-[#fff8f3] via-white to-[#fafafa] pb-10 pt-4 sm:pb-14 sm:pt-5">
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-amber-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="website-section-title">
            <span className="website-section-title-accent">Hot Selling</span> Projects in India
          </h2>
        </div>

        {/* City tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:mt-6 sm:flex-wrap sm:overflow-visible">
          {HOT_SELLING_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300",
                city === c
                  ? "border-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
                  : "border-slate-200/90 bg-white text-slate-700 shadow-sm hover:border-orange-200 hover:text-orange-700 hover:shadow-md"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="relative mt-6 sm:mt-8">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide sm:gap-5"
          >
            <AnimatePresence mode="wait">
              {projects.map((project, i) => (
                <motion.div
                  key={`${city}-${project.id}`}
                  data-card
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="w-[min(78vw,280px)] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                >
                  <Link
                    href={`/projects?search=${encodeURIComponent(project.name)}`}
                    className="group block overflow-hidden rounded-2xl border border-orange-100/50 bg-white shadow-[0_4px_24px_rgba(249,115,22,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-200/80 hover:shadow-[0_16px_48px_rgba(249,115,22,0.15)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
                      <span
                        className="hot-rank-number pointer-events-none absolute left-2 top-0 select-none sm:left-3"
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      {i === 0 && (
                        <span className="absolute right-3 top-3 rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                          Top Pick
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 p-4 sm:p-5">
                      <h3 className="website-type line-clamp-1 text-[15px] text-[#0f1729] transition-colors group-hover:text-orange-700 sm:text-base">
                        {project.name}
                      </h3>
                      <p className="flex items-center gap-1 text-sm font-medium text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-orange-400" />
                        {project.location}, {city}
                      </p>
                      <p className="website-type pt-0.5 text-sm text-orange-600 sm:text-[15px]">
                        {formatPriceRange(project.priceFrom, project.priceTo)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Nav arrows — desktop */}
          <button
            type="button"
            onClick={() => scrollCards("left")}
            aria-label="Previous projects"
            className="absolute -left-3 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-orange-100 bg-white text-orange-600 shadow-lg transition-all hover:border-orange-300 hover:bg-orange-50 hover:shadow-xl lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollCards("right")}
            aria-label="Next projects"
            className="absolute -right-3 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-orange-100 bg-white text-orange-600 shadow-lg transition-all hover:border-orange-300 hover:bg-orange-50 hover:shadow-xl lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-center text-xs font-medium text-orange-400/80 lg:hidden">
          Swipe to explore more projects →
        </p>
      </div>
    </section>
  );
}
