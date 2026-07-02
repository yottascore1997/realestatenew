"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Star, Quote, MapPin, Sparkles,
} from "lucide-react";
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  id: string;
  name: string;
  role?: string | null;
  city: string;
  text: string;
  rating: number;
  image?: string | null;
  avatar?: string | null;
  featured?: boolean;
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=420&fit=crop&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=420&fit=crop&q=85",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=420&fit=crop&q=85",
];

const DEFAULT_AVATARS = [
  "https://i.pravatar.cc/120?img=12",
  "https://i.pravatar.cc/120?img=33",
  "https://i.pravatar.cc/120?img=47",
  "https://i.pravatar.cc/120?img=15",
  "https://i.pravatar.cc/120?img=28",
];

function normalizeTestimonials(items: TestimonialItem[]): TestimonialItem[] {
  if (items.length > 0) return items;
  return FALLBACK_TESTIMONIALS.map((t, i) => ({
    id: `fallback-${i}`,
    name: t.name,
    role: t.role ?? "Homeowner",
    city: t.city,
    text: t.text,
    rating: t.rating,
    image: t.image ?? DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
    avatar: t.avatar ?? DEFAULT_AVATARS[i % DEFAULT_AVATARS.length],
    featured: i === 1,
  }));
}

type TestimonialsSectionProps = {
  testimonials?: TestimonialItem[];
  reviewCount?: number;
  avgRating?: number;
};

export function TestimonialsSection({
  testimonials = [],
  reviewCount,
  avgRating = 4.8,
}: TestimonialsSectionProps) {
  const items = useMemo(() => normalizeTestimonials(testimonials), [testimonials]);
  const [start, setStart] = useState(0);

  const visible = [0, 1, 2].map((o) => items[(start + o) % items.length]);
  const totalReviews = reviewCount ?? Math.max(items.length * 800, 2500);
  const displayRating = avgRating.toFixed(1);

  const go = (dir: -1 | 1) => setStart((s) => (s + dir + items.length) % items.length);

  return (
    <section className="premium-trust-bg relative overflow-hidden py-10 sm:py-12">
      {/* Decorative bg */}
      <div className="pointer-events-none absolute left-0 top-8 hidden h-48 w-40 opacity-[0.07] sm:block">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=500&fit=crop&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div
        className="pointer-events-none absolute right-8 top-6 hidden h-20 w-20 opacity-30 md:block"
        style={{
          backgroundImage: "radial-gradient(circle, #d4af7a55 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-40 opacity-20">
        <svg viewBox="0 0 200 60" className="h-full w-full text-[#c9a962]/60" aria-hidden>
          <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M0 40 Q50 10 100 35 T200 25" />
          <path fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" d="M0 50 Q60 25 120 45 T200 38" />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200&h=200&fit=crop&q=80"
          alt=""
          className="h-full w-full rounded-full object-cover blur-sm"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center sm:mb-10"
        >
          <p className="eyebrow-orange justify-center">
            <Sparkles className="h-3.5 w-3.5" /> Testimonials
          </p>
          <h2 className="website-section-title mx-auto mt-2 max-w-2xl">
            Trusted by Thousands,{" "}
            <span className="website-section-title-accent">Loved for Our Service</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonials"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e8dcc8] bg-[#fffcf8] text-[#b8922f] shadow-sm transition-all hover:border-[#c9a962] hover:text-[#102C57] hover:shadow-md sm:h-11 sm:w-11"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {visible.map((t, i) => {
              const isCenter = i === 1;
              const image = t.image || DEFAULT_IMAGES[i];
              const avatar = t.avatar || DEFAULT_AVATARS[i];
              return (
                <motion.article
                  key={`${t.id}-${start}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "relative flex flex-col overflow-hidden rounded-2xl bg-[#fffcf8] shadow-[0_8px_30px_rgba(12,35,64,0.06)] transition-all duration-300",
                    isCenter
                      ? "border-2 border-[#c9a962] lg:-translate-y-2 lg:shadow-[0_16px_40px_rgba(201,169,98,0.18)]"
                      : "border border-[#e8dcc8]/70",
                    i > 0 && "hidden sm:flex",
                    i === 2 && "hidden lg:flex"
                  )}
                >
                  <div className="relative h-36 overflow-hidden sm:h-40">
                    <img src={image} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute -bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a962] to-[#b8922f] text-white shadow-md ring-4 ring-[#fffcf8]">
                      <Quote className="h-4 w-4 fill-current" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-5 pt-6">
                    <div className="flex justify-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-[#c9a962] text-[#c9a962]" />
                      ))}
                    </div>
                    <p className="mt-3 flex-1 text-center text-[13px] leading-relaxed text-[#5c677d] sm:text-sm">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-3 border-t border-[#e8dcc8]/80 pt-4">
                      <img
                        src={avatar}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#faf6ef]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#0c2340]">{t.name}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#5c677d]">
                          <span>{t.role || "Homeowner"}</span>
                          <span className="text-[#c9a962]/50">·</span>
                          <MapPin className="h-3 w-3 text-[#c9a962]" />
                          <span>{t.city}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonials"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e8dcc8] bg-[#fffcf8] text-[#b8922f] shadow-sm transition-all hover:border-[#c9a962] hover:text-[#102C57] hover:shadow-md sm:h-11 sm:w-11"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-4 rounded-full border border-[#e8dcc8] bg-gradient-to-r from-[#fffcf8] via-white to-[#fffcf8] px-5 py-3 shadow-[0_8px_24px_rgba(12,35,64,0.06)] sm:mt-10 sm:gap-5 sm:px-6"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a962] to-[#b8922f] text-white shadow-sm">
              <Star className="h-4 w-4 fill-current" />
            </span>
            <span className="text-xl font-bold text-[#0c2340]">{displayRating}/5</span>
          </div>
          <span className="hidden h-8 w-px bg-[#e8dcc8] sm:block" />
          <p className="text-center text-xs text-[#5c677d] sm:text-sm">
            Based on <span className="font-semibold text-[#102C57]">{totalReviews.toLocaleString("en-IN")}+</span> Verified Reviews
          </p>
          <span className="hidden h-8 w-px bg-[#e8dcc8] sm:block" />
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {DEFAULT_AVATARS.slice(0, 4).map((src, i) => (
                <img key={i} src={src} alt="" className="h-8 w-8 rounded-full border-2 border-[#fffcf8] object-cover" />
              ))}
            </div>
            <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#102C57] text-[10px] font-bold text-[#c9a962]">
              {(totalReviews / 1000).toFixed(1).replace(/\.0$/, "")}K+
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
