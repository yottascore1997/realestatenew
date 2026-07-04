"use client";

import { motion } from "framer-motion";
import {
  MapPin, Phone, Download, Play, Building2, Trees, ShieldCheck,
  Dumbbell, Waves, Baby, Footprints, Zap, TreePine, Award, Clock, BadgeCheck,
  Gift, Landmark, TrainFront, Sparkles, Layers, ArrowRight,
  Car, ShoppingBag, GraduationCap, Plane, Wallet, CalendarCheck, Users, TrendingUp,
} from "lucide-react";
import { WebsiteHeader } from "@/components/website/website-header";
import { LaunchInquiryForm } from "@/components/website/launch-inquiry-form";
import { LaunchLeadPopup } from "@/components/website/launch-lead-popup";
import { LaunchFloatingCta } from "@/components/website/launch-floating-cta";
import { BRAND_PHONE } from "@/lib/website/constants";
import { cn } from "@/lib/utils";
import { lp } from "@/components/website/launch-premium-theme";
import type { LaunchLandingData } from "@/lib/website/launch-types";
import type { HeroSearchData } from "@/lib/website/get-hero-data";

const OFFER_PERKS = [
  { icon: Wallet, label: "Zero Booking Amount" },
  { icon: CalendarCheck, label: "Flexible Payment Plans" },
  { icon: TrendingUp, label: "High Appreciation Zone" },
  { icon: MapPin, label: "Free Site Visit" },
];

const TRUST_STATS = [
  { icon: Award, value: "100+", label: "Years Legacy of Trust" },
  { icon: Building2, value: "Top", label: "Builders & Projects" },
  { icon: Layers, value: "50+", label: "Cities Covered" },
  { icon: Users, value: "10K+", label: "Happy Clients" },
  { icon: BadgeCheck, value: "Zero", label: "Brokerage Policy" },
];

function getFeatureBar(launch: LaunchLandingData) {
  const bhkSub = launch.bhk ?? "2, 3 & 4 BHK options";
  return [
    { icon: Building2, title: "Premium Living", sub: "World-class finishes" },
    { icon: Layers, title: "Spacious Homes", sub: bhkSub },
    { icon: Trees, title: "70%+ Open Spaces", sub: "Green & landscaped" },
    { icon: ShieldCheck, title: "RERA Verified", sub: "100% compliant" },
    { icon: Sparkles, title: "50+ Amenities", sub: "Clubhouse, pool & gym" },
    { icon: TrainFront, title: "Connectivity", sub: "Metro & highway access" },
  ];
}

const AMENITIES = [
  { icon: Building2, label: "Clubhouse" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: Dumbbell, label: "Gymnasium" },
  { icon: Baby, label: "Kids Play Area" },
  { icon: TreePine, label: "Landscaped Gardens" },
  { icon: Footprints, label: "Jogging Track" },
  { icon: Zap, label: "Power Backup" },
  { icon: ShieldCheck, label: "24×7 Security" },
  { icon: Car, label: "Car Parking" },
  { icon: Sparkles, label: "Party Lawn" },
];

const LOCATION_PERKS = [
  { icon: TrainFront, label: "5 Mins from Metro / Highway" },
  { icon: GraduationCap, label: "Top Schools Nearby" },
  { icon: ShoppingBag, label: "Shopping & Malls Close" },
  { icon: Plane, label: "Airport / IT Hub Access" },
  { icon: Landmark, label: "Prime Business District" },
];

function formatPrice(from?: number | null, to?: number | null) {
  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)} Cr`;
    return `₹${(n / 100000).toFixed(0)} L`;
  };
  if (!from) return "Price on Request";
  if (to && to > from) return `${fmt(from)} – ${fmt(to)}`;
  return `${fmt(from)} onwards`;
}

type LaunchLandingPageProps = {
  launch: LaunchLandingData;
  stats?: HeroSearchData["stats"];
};

export function LaunchLandingPage({ launch, stats }: LaunchLandingPageProps) {
  const gallery = (() => {
    const base = launch.images?.length ? [...launch.images] : launch.image ? [launch.image] : [];
    if (base.length === 0) return [];
    while (base.length < 4) base.push(...base);
    return base.slice(0, 4);
  })();

  const phoneHref = `tel:${BRAND_PHONE.replace(/\s/g, "")}`;
  const amenityLabels = ["Premium Clubhouse", "Walkway View", "Kids Play Area", "Landscaped Gardens"];
  const featureBar = getFeatureBar(launch);
  const offerText = launch.offer ?? "Club Membership Worth ₹5 L Included";

  const heroStats = [
    { icon: Landmark, value: "10+ Acres", label: "Land Parcel" },
    { icon: Trees, value: "70%+", label: "Open Spaces" },
    { icon: Building2, value: "40+", label: "Floor Tower" },
    { icon: Layers, value: launch.bhk?.split(",")[0]?.trim() ?? "2-4 BHK", label: "Homes" },
  ];

  const highlights = [
    { icon: Building2, label: "Project Name", value: launch.name },
    { icon: MapPin, label: "Location", value: `${launch.location}, ${launch.city}` },
    { icon: Layers, label: "Configuration", value: launch.bhk ?? "2, 3 & 4 BHK" },
    { icon: Trees, label: "Starting Price", value: formatPrice(launch.priceFrom, launch.priceTo) },
    { icon: Clock, label: "Status", value: launch.possession ?? launch.status },
  ];

  return (
    <div className={lp.page}>
      {/* Hero */}
      <section id="overview" className="relative">
        <WebsiteHeader stats={stats} className="relative z-40 border-b border-slate-100/80 bg-white/95 backdrop-blur-md" />

        <div className="relative min-h-[480px] overflow-hidden sm:min-h-[520px] lg:min-h-[560px]">
          {launch.image ? (
            <>
              <img src={launch.image} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(to right, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.82) 32%, rgba(255,255,255,0.35) 52%, transparent 68%),
                    linear-gradient(to left, rgba(255,255,255,0.7) 0%, transparent 22%)
                  `,
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
          )}

          <div className="relative mx-auto grid max-w-7xl items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-10 lg:px-8 lg:py-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl lg:max-w-2xl">
              <span className={lp.tag}>Premium {launch.city} Living</span>

              <h1 className="website-type mt-5 text-[1.85rem] font-semibold leading-[1.12] text-[#0f1729] sm:text-4xl lg:text-[2.75rem]">
                Live Premium,
                <br />
                <span className="text-theme-orange">In {launch.city}.</span>
              </h1>

              <p className="mt-3 text-base font-bold sm:text-lg">{launch.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{launch.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {heroStats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center sm:text-left">
                    <div className={cn("mx-auto sm:mx-0", lp.iconCircleSm)}>
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    <p className="mt-2 text-sm font-bold text-[#0f1729]">{value}</p>
                    <p className="text-[10px] text-slate-500 sm:text-[11px]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#register" className={lp.btnPrimary}>
                  <Download className="h-4 w-4" /> Download Brochure
                </a>
                <a href="#gallery" className={lp.btnSecondary}>
                  <Play className="h-4 w-4" /> View Project Gallery
                </a>
              </div>
            </motion.div>

            <motion.div
              id="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:sticky lg:top-[92px]"
            >
              <LaunchInquiryForm launch={launch} variant="hero" utmSource="launch-lp" utmCampaign={launch.slug} />
            </motion.div>
          </div>
        </div>

        {/* Floating feature bar */}
        <div className="relative z-10 mt-6 px-4 pb-8 sm:mt-8 sm:px-6 sm:pb-10 lg:px-8">
          <div className={cn("mx-auto max-w-6xl", lp.featureBar)}>
            <div className="flex gap-0 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-6">
              {featureBar.map(({ icon: Icon, title, sub }) => (
                <div
                  key={title}
                  className="flex min-w-[140px] flex-col items-center border-r border-white/10 px-4 py-5 text-center last:border-r-0 sm:min-w-0"
                >
                  <div className={lp.featureBarIcon}>
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <p className="mt-2 text-xs font-bold text-white">{title}</p>
                  <p className="mt-0.5 text-[10px] text-white/55">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section id="highlights" className={cn("pb-12 pt-10 sm:pb-16 sm:pt-12", lp.sectionWhite)}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className={lp.sectionTitle}>Project Highlights</h2>
          <div className="mt-8 grid divide-y divide-slate-100 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            {highlights.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center px-3 py-5 text-center">
                <div className={lp.iconCircleMd}>
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-bold text-[#0f1729]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities + Gallery */}
      <section id="amenities" className={cn("relative py-14 sm:py-16", lp.sectionAlt)}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,rgba(249,115,22,0.06),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <div>
            <p className={lp.sectionEyebrow}>Lifestyle &amp; Comfort</p>
            <h2 className={lp.sectionTitleLeft}>
              <span className="text-theme-orange">50+</span> World-Class Amenities
            </h2>
            <div className={lp.accentBar} />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
              Curated amenities for modern families — wellness, recreation &amp; entertainment within your community.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {AMENITIES.map(({ icon: Icon, label }) => (
                <div key={label} className={lp.amenityTile}>
                  <div className={cn("h-12 w-12 transition-transform duration-300 group-hover:scale-110", lp.iconCircle)}>
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className="mt-3 text-xs font-bold text-[#0f1729]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {gallery.length > 0 && (
            <div id="gallery" className="group grid grid-cols-[1.15fr_1fr] gap-3">
              <div className={lp.galleryMain}>
                <img src={gallery[0]} alt="" className="h-full min-h-[320px] w-full object-cover lg:min-h-[400px]" />
                <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f1729]/80 via-[#0f1729]/40 to-transparent px-4 py-3 text-sm font-bold text-white">
                  {amenityLabels[0]}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {gallery.slice(1, 4).map((src, i) => (
                  <div key={src + i} className={lp.galleryThumb}>
                    <img src={src} alt="" className="h-full min-h-[100px] w-full object-cover transition-transform duration-500 hover:scale-105" />
                    <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f1729]/75 to-transparent px-3 py-2 text-[11px] font-bold text-white">
                      {amenityLabels[i + 1] ?? `View ${i + 2}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Location */}
      <section id="location" className={cn("relative overflow-hidden py-14 sm:py-16", lp.sectionLocation)}>
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <div>
            <p className={lp.sectionEyebrow}>Connectivity &amp; Convenience</p>
            <h2 className={lp.sectionTitleLeft}>Prime Location Advantages</h2>
            <div className={lp.accentBar} />
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0f1729] px-4 py-2 text-sm font-semibold text-white shadow-md">
              <MapPin className="h-4 w-4 text-orange-400" />
              {launch.location}, {launch.city}
            </div>
            <div className="mt-8 space-y-3">
              {LOCATION_PERKS.map(({ icon: Icon, label }) => (
                <div key={label} className={lp.locationTile}>
                  <div className={lp.iconCircleNavy}>
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-bold text-[#0f1729]">{label}</p>
                </div>
              ))}
            </div>
            {launch.builder && (
              <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#1a2744]/15 bg-[#0f1729]/5 px-4 py-3">
                <Building2 className="h-5 w-5 text-orange-600" strokeWidth={1.5} />
                <p className="text-sm text-slate-600">
                  Developed by <strong className="font-bold text-[#0f1729]">{launch.builder}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2744]/5 to-orange-50 shadow-[0_16px_48px_rgba(15,23,41,0.1)] ring-1 ring-orange-200/50">
            {launch.image && (
              <img src={launch.image} alt="" className="h-full min-h-[320px] w-full object-cover opacity-30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-orange-50/40 to-[#1a2744]/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <div className="relative h-full w-full max-w-sm">
                <svg viewBox="0 0 400 280" className="h-full w-full text-orange-300/60" fill="none">
                  <path d="M40 140 Q120 80 200 120 T360 100" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                  <path d="M60 200 H340" stroke="currentColor" strokeWidth="3" />
                  <circle cx="200" cy="130" r="28" className="fill-orange-500/15 stroke-orange-500/50" strokeWidth="2" />
                </svg>
                <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme-orange text-white shadow-theme-orange">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="mt-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0f1729] shadow-lg ring-1 ring-orange-200">
                    {launch.name}
                  </p>
                </div>
              </div>
              <p className="mt-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                {launch.location}, {launch.city}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Period Offer bar (reference — compact, no form) */}
      <section className={lp.offerBar}>
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-5 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 ring-1 ring-orange-400/30">
              <Gift className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-base font-bold sm:text-lg">Limited Period Offer!</p>
              <p className="mt-0.5 text-sm font-semibold text-orange-300">{offerText}</p>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            {OFFER_PERKS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <Icon className="h-4 w-4 shrink-0 text-orange-400" strokeWidth={1.5} />
                <span className="text-[11px] font-semibold text-white/90 sm:text-xs">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex w-full shrink-0 flex-col items-stretch sm:w-auto sm:items-end">
            <a
              href="#footer-register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#0f1729] shadow-md transition-colors hover:bg-orange-50"
            >
              Enquire Now <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-1.5 text-center text-[10px] text-white/50 sm:text-right">Limited units available!</p>
          </div>
        </div>
      </section>

      {/* Footer lead form */}
      <section id="footer-register" className="border-t border-slate-100 bg-[#f5f7fa] py-12 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[200px_1fr]">
            <div className="hidden items-end justify-center lg:flex">
              <div className="relative opacity-30">
                <Building2 className="h-40 w-40 text-[#1a2744]" strokeWidth={0.75} />
                <Building2 className="absolute -right-8 bottom-0 h-28 w-28 text-[#1a2744]" strokeWidth={0.75} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f1729] sm:text-2xl">
                Your Dream Home is Just One Step Away!
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Register now to unlock exclusive pre-launch pricing &amp; floor plans.
              </p>
              <div className="mt-6">
                <LaunchInquiryForm
                  launch={launch}
                  variant="footer"
                  utmSource="launch-lp-footer"
                  utmCampaign={launch.slug}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar (reference — light gray strip) */}
      <section className={lp.trustBar}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-5 sm:px-6 lg:px-8">
          {TRUST_STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className={lp.iconCircleSm}>
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <p className="mt-2 text-lg font-extrabold text-[#0f1729] sm:text-xl">{value}</p>
              <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <LaunchLeadPopup launch={launch} />
      <LaunchFloatingCta />

      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t bg-white p-3 shadow-lg sm:hidden">
        <a href={phoneHref} className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold">
          <Phone className="h-4 w-4" /> Call
        </a>
        <a href="#register" className="flex flex-[2] items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white">
          Enquire Now
        </a>
      </div>
    </div>
  );
}

