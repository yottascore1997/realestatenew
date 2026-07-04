"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, ArrowRight, MapPin, Sparkles,
} from "lucide-react";
import { HeroSection } from "@/components/website/hero-section";
import {
  PLACEHOLDER_LAUNCHES,
} from "@/lib/website/constants";
import { formatINR, cn } from "@/lib/utils";
import { ExploreCitiesSection } from "@/components/website/explore-cities-section";
import { FeaturedLaunchesSection } from "@/components/website/featured-launches-section";
import { HotSellingProjectsSection } from "@/components/website/hot-selling-projects-section";
import { TrustedBuildersSection } from "@/components/website/trusted-builders-section";
import { AchievementStatsSection } from "@/components/website/achievement-stats-section";
import { TestimonialsSection, type TestimonialItem } from "@/components/website/testimonials-section";
import type { HeroSearchData } from "@/lib/website/get-hero-data";

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
  id: string;
  slug?: string;
  name: string;
  location: string;
  city: string;
  image?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  builder?: string | null;
  bhk?: string | null;
  possession?: string | null;
  offer?: string | null;
  status?: string;
}

function slugFromName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface HomePageContentProps {
  heroData: HeroSearchData;
  projects: unknown[];
  properties: unknown[];
  launches: LaunchItem[];
  featuredLaunches: LaunchItem[];
  testimonials: TestimonialItem[];
  reviewCount?: number;
  avgRating?: number;
}

export function HomePageContent({
  heroData,
  launches,
  featuredLaunches,
  testimonials,
  reviewCount,
  avgRating,
}: HomePageContentProps) {

  const displayLaunches = Array.from({ length: 4 }, (_, i) => {
    const l = launches[i];
    const ph = PLACEHOLDER_LAUNCHES[i];
    if (l) {
      return {
        id: l.id,
        slug: l.slug ?? ("slug" in ph ? ph.slug : slugFromName(l.name)),
        name: l.name,
        location: l.location || ph.location,
        city: l.city,
        priceFrom: l.priceFrom ?? ph.priceFrom,
        bhk: l.bhk ?? ph.bhk,
        possession: l.possession ?? ph.possession,
        image: l.image ?? ph.image,
      };
    }
    return { ...ph, slug: ph.slug };
  });

  return (
    <div className="bg-white">
      <HeroSection heroData={heroData} />

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
                <Link href={`/launches/${l.slug}`} className="premium-card group block ring-1 ring-orange-100/80">
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
        launches={featuredLaunches}
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

      <TrustedBuildersSection />

      <AchievementStatsSection />

      <TestimonialsSection
        testimonials={testimonials}
        reviewCount={reviewCount}
        avgRating={avgRating}
      />
    </div>
  );
}
