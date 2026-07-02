"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Handshake, Building2, Home, Users } from "lucide-react";
import { BUILDER_LOGOS, BUILDER_PARTNER_STATS } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

function SkylineDivider() {
  return (
    <div className="relative my-4 flex items-center sm:my-5">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9a962]/60 to-[#c9a962]/30" />
      <svg viewBox="0 0 120 24" className="mx-3 h-5 w-16 text-[#c9a962]/70" aria-hidden>
        <path
          fill="currentColor"
          d="M0 24V14h10v-6h8v6h6V8h7v6h9V12h8v12h6V10h7v14h5V16h8v8H0z"
        />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#c9a962]/60 to-[#c9a962]/30" />
    </div>
  );
}

function BuilderLogoCard({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex h-14 w-36 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white px-4 shadow-[0_2px_14px_rgba(15,23,42,0.08)] sm:h-16 sm:w-40">
      <img
        src={logo}
        alt={name}
        className="max-h-9 max-w-[120px] object-contain sm:max-h-10"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}

function BuilderLogoMarquee() {
  const track = [...BUILDER_LOGOS, ...BUILDER_LOGOS];

  return (
    <div className="relative overflow-hidden">
      <div className="builder-logo-marquee flex w-max gap-3 sm:gap-4">
        {track.map((builder, i) => (
          <BuilderLogoCard key={`${builder.name}-${i}`} name={builder.name} logo={builder.logo} />
        ))}
      </div>
    </div>
  );
}

export function TrustedBuildersSection() {
  return (
    <section className="relative overflow-hidden py-6 sm:py-8">
      {/* Background image + light white wash */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=600&fit=crop&q=80"
          alt=""
          className="h-full w-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-white/28" />
      </div>

      {/* Side building accents */}
      <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-44 opacity-40 lg:block">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=700&fit=crop&q=80"
          alt=""
          className="h-full w-full object-cover [mask-image:linear-gradient(to_right,black,transparent)]"
        />
      </div>
      <div className="pointer-events-none absolute -right-6 top-0 hidden h-full w-44 opacity-40 lg:block">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=700&fit=crop&q=80"
          alt=""
          className="h-full w-full object-cover [mask-image:linear-gradient(to_left,black,transparent)]"
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-24 opacity-35">
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200&h=200&fit=crop&q=80"
          alt=""
          className="h-full w-full rounded-full object-cover blur-sm"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-sm">
            <ShieldCheck className="h-3 w-3" />
            Strong Partnerships
          </span>

          <h2 className="website-section-title mx-auto mt-3 max-w-2xl">
            Trusted By India&apos;s{" "}
            <span className="website-section-title-accent">Top Builders</span>
          </h2>

          <p className="website-section-desc mx-auto mt-2 max-w-xl text-xs sm:text-sm">
            We collaborate with India&apos;s most reputed real estate developers to bring you the finest properties.
          </p>
        </motion.div>

        <SkylineDivider />

        <BuilderLogoMarquee />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 flex flex-col overflow-hidden rounded-xl bg-[#0c2340]/95 backdrop-blur-sm sm:mt-5 sm:flex-row sm:items-stretch"
        >
          <div className="flex flex-1 items-center gap-2.5 border-b border-white/10 px-4 py-3 sm:border-b-0 sm:border-r sm:py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c9a962]/15 text-[#c9a962]">
              <Home className="h-4 w-4" />
            </span>
            <p className="text-[11px] leading-snug text-white/90 sm:text-xs">
              Working with the best to{" "}
              <span className="font-semibold text-[#c9a962]">bring you the best.</span>
            </p>
          </div>

          {BUILDER_PARTNER_STATS.map(({ label, value }, i) => {
            const Icon = i === 0 ? Building2 : i === 1 ? Handshake : Users;
            return (
              <div
                key={label}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 px-3 py-2.5 sm:py-3",
                  i < BUILDER_PARTNER_STATS.length - 1 && "border-b border-white/10 sm:border-b-0 sm:border-r"
                )}
              >
                <Icon className="hidden h-4 w-4 shrink-0 text-[#c9a962] sm:block" />
                <p className="text-center text-[11px] text-white/85 sm:text-xs">
                  <span className="font-bold text-white">{value}</span> {label}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
