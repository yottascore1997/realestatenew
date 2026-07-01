"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, ArrowRight, ChevronLeft, ChevronRight, MapPin, Star, Quote,
  ShieldCheck, Building2, BadgeCheck, Landmark, Scale, HardHat, Users, Sparkles,
} from "lucide-react";
import { HeroSection } from "@/components/website/hero-section";
import {
  TESTIMONIALS, TOP_BUILDERS, WHY_CHOOSE,
  PLATFORM_STATS, PLACEHOLDER_LAUNCHES,
} from "@/lib/website/constants";
import { formatINR, cn } from "@/lib/utils";
import { BrandWordmark } from "@/components/website/brand-wordmark";
import { ExploreCitiesSection } from "@/components/website/explore-cities-section";
import { FeaturedLaunchesSection } from "@/components/website/featured-launches-section";
import { HotSellingProjectsSection } from "@/components/website/hot-selling-projects-section";

const WHY_ICONS = { ShieldCheck, Building2, MapPin, Landmark, BadgeCheck, Scale };
const STAT_ICONS = { Building2, HardHat, MapPin, Users };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function SectionHeader({
  eyebrow,
  title,
  href,
  linkText,
  theme = "orange",
  linkTheme,
}: {
  eyebrow: string;
  title: ReactNode;
  href?: string;
  linkText?: string;
  theme?: "orange" | "purple";
  linkTheme?: "orange" | "purple" | "green";
}) {
  const isOrange = theme === "orange";
  const linkStyle = linkTheme ?? theme;
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-8 sm:gap-4">
      <div>
        <p className={isOrange ? "eyebrow-orange" : "eyebrow-purple"}>
          <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
        </p>
        <h2 className="website-section-title mt-2">{title}</h2>
      </div>
      {href && linkText && (
        <Link
          href={href}
          className={cn(
            "group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:shadow-sm",
            linkStyle === "green" && "border border-emerald-600/20 bg-emerald-600 text-white hover:bg-emerald-700",
            linkStyle === "orange" && "border border-orange-200/80 bg-orange-50/50 text-orange-800 hover:bg-orange-100",
            linkStyle === "purple" && "border border-violet-200/80 bg-violet-50/50 text-violet-800 hover:bg-violet-100"
          )}
        >
          {linkText} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

interface LaunchItem {
  id: string; name: string; location: string; city: string;
  image?: string | null; priceFrom?: number | null; status?: string;
}

interface HomePageContentProps {
  projects: unknown[];
  properties: unknown[];
  launches: LaunchItem[];
}

export function HomePageContent({ launches }: HomePageContentProps) {
  const [builderIdx, setBuilderIdx] = useState(0);
  const [testimonialStart, setTestimonialStart] = useState(0);

  const displayLaunches = Array.from({ length: 4 }, (_, i) => {
    const l = launches[i];
    const ph = PLACEHOLDER_LAUNCHES[i];
    if (l) {
      return {
        id: l.id,
        name: l.name,
        location: l.location || ph.location,
        city: l.city,
        priceFrom: l.priceFrom ?? ph.priceFrom,
        bhk: ph.bhk,
        possession: ph.possession,
        image: l.image ?? ph.image,
      };
    }
    return { ...ph };
  });

  const paddedBuilders = (() => {
    const visible = TOP_BUILDERS.slice(builderIdx, builderIdx + 5);
    return visible.length < 5 ? [...visible, ...TOP_BUILDERS.slice(0, 5 - visible.length)] : visible;
  })();

  const visibleTestimonials = [0, 1, 2].map((o) => TESTIMONIALS[(testimonialStart + o) % TESTIMONIALS.length]);

  return (
    <div className="bg-white">
      <HeroSection />

      {/* Newly Launched Projects — original card grid */}
      <section className="section-orange pb-4 pt-6 sm:pb-8 sm:pt-10 lg:pb-10 lg:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
            <SectionHeader
              theme="orange"
              linkTheme="green"
              eyebrow="Exclusive Launches"
              title={
                <>
                  Newly <span className="website-section-title-accent">Launched</span> Projects
                </>
              }
              href="/launches"
              linkText="View All Projects"
            />
          </motion.div>

          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {displayLaunches.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
                className="w-[min(82vw,320px)] shrink-0 snap-start sm:w-auto sm:shrink"
              >
                <Link href="/launches" className="premium-card group block ring-1 ring-orange-100/80">
                  <div className="relative h-52 overflow-hidden">
                    <img src={l.image || ""} alt={l.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729]/90 via-[#0f1729]/20 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-lg bg-theme-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-theme-orange">
                      New Launch
                    </span>
                    <button type="button" className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow-md backdrop-blur-sm transition-transform group-hover:scale-110" onClick={(e) => e.preventDefault()}>
                      <Heart className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-lg font-bold text-theme-orange">
                        {l.priceFrom ? `${formatINR(Number(l.priceFrom))}*` : "On Request"}
                      </p>
                      <p className="text-[11px] text-white/60">onwards</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-[#0f1729] transition-colors group-hover:text-orange-700">{l.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-orange-500" /> {l.location}, {l.city}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">{l.bhk} · Possession {l.possession}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-emerald-700">
                      View Details <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedLaunchesSection
        launches={launches}
        header={
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
            <SectionHeader
              theme="purple"
              eyebrow="Editor's Pick"
              title={
                <>
                  Featured <span className="website-section-title-accent">New Launch</span>
                </>
              }
            />
          </motion.div>
        }
      />

      {/* Cities — Flexospaces-style bento grid */}
      <ExploreCitiesSection />

      {/* Hot Selling Projects — premium carousel */}
      <HotSellingProjectsSection />

      {/* Builders — purple */}
      <section className="section-purple border-y border-violet-100 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-8 text-center">
            <p className="eyebrow-purple justify-center">
              <Sparkles className="h-3.5 w-3.5" /> Partners
            </p>
            <h2 className="website-section-title mt-2">
              Trusted By India&apos;s <span className="website-section-title-accent">Top Builders</span>
            </h2>
          </motion.div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setBuilderIdx((i) => (i - 1 + TOP_BUILDERS.length) % TOP_BUILDERS.length)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-white shadow-sm transition-all hover:border-violet-400 hover:shadow-md">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {paddedBuilders.map((name) => (
                <div key={name} className="flex h-[72px] items-center justify-center rounded-2xl border border-violet-100 bg-white px-3 shadow-sm transition-all hover:border-violet-300 hover:shadow-md">
                  <span className="text-center text-sm font-bold tracking-tight text-[#0f1729]">{name}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setBuilderIdx((i) => (i + 1) % TOP_BUILDERS.length)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-white shadow-sm transition-all hover:border-violet-400 hover:shadow-md">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose — orange */}
      <section className="section-orange py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10 text-center">
            <p className="eyebrow-orange justify-center">
              <Sparkles className="h-3.5 w-3.5" /> Our Promise
            </p>
            <h2 className="website-section-title mt-2">
              Why Choose{" "}
              <BrandWordmark size="inherit" className="website-section-title-accent inline tracking-[0.08em]" />
              ?
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {WHY_CHOOSE.map(({ title, desc, icon }, i) => {
              const Icon = WHY_ICONS[icon as keyof typeof WHY_ICONS] ?? ShieldCheck;
              return (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-lg sm:p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-200/60 transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base text-[#0f1729] sm:text-lg">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats — purple dark */}
      <section className="section-purple-dark relative overflow-hidden py-14 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {PLATFORM_STATS.map(({ value, label, icon }, i) => {
            const Icon = STAT_ICONS[icon as keyof typeof STAT_ICONS] ?? Building2;
            return (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/25">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="website-type mt-4 text-3xl text-white sm:text-4xl">{value}</p>
                <p className="mt-1 text-sm text-white/50">{label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials — orange */}
      <section className="section-orange py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              theme="orange"
              eyebrow="Reviews"
              title={
                <>
                  What Our <span className="website-section-title-accent">Customers</span> Say
                </>
              }
              href="/contact"
              linkText="View All Reviews"
            />
          </motion.div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setTestimonialStart((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-white shadow-sm hover:border-orange-400 sm:flex">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTestimonials.map((t, i) => (
                <motion.div key={`${t.name}-${i}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={`relative rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${i === 1 ? "border-orange-200/80 ring-2 ring-orange-100 lg:-mt-2 lg:mb-2 lg:shadow-md" : "border-orange-100/60"}`}>
                  <Quote className="h-8 w-8 text-orange-200" />
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-orange-100 pt-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-900">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0f1729]">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.city}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <button type="button" onClick={() => setTestimonialStart((i) => (i + 1) % TESTIMONIALS.length)} className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-white shadow-sm hover:border-orange-400 sm:flex">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* App promo — purple */}
      <section className="section-purple pb-14 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1b69] via-[#1e1035] to-[#2d1b69] px-8 py-10 sm:flex sm:items-center sm:justify-between sm:px-12 sm:py-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="relative max-w-md">
              <p className="website-badge-text text-violet-300">Mobile App</p>
              <h3 className="website-type mt-2 text-2xl text-white sm:text-3xl">Find Your Dream Home On The Go</h3>
              <p className="website-body-text mt-3 text-white/60">
                Exclusive deals, instant alerts & virtual site visits — all in your pocket.
              </p>
            </div>
            <div className="relative mt-8 flex flex-wrap items-center gap-4 sm:mt-0">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-[10px] text-white/40 backdrop-blur-sm">
                QR Code
              </div>
              <div className="flex flex-col gap-2.5">
                <button type="button" className="rounded-xl bg-theme-purple px-6 py-3 text-sm font-bold text-white shadow-theme-purple">Google Play</button>
                <button type="button" className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-violet-500/20">App Store</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
