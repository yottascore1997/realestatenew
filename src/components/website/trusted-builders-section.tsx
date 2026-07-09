"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { BUILDER_LOGOS } from "@/lib/website/constants";

function SkylineDivider() {
  return (
    <div className="relative my-2.5 flex items-center sm:my-3">
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

function getBuilderTextStyle(name: string) {
  const lowercase = name.toLowerCase();
  if (lowercase.includes("lodha")) {
    return {
      font: "font-serif tracking-widest uppercase font-black",
      color: "text-[#8A1A1A]", // Crimson Red
      text: "LODHA"
    };
  }
  if (lowercase.includes("godrej")) {
    return {
      font: "font-sans font-extrabold tracking-tight italic",
      color: "text-[#006838]", // Green
      text: "Godrej"
    };
  }
  if (lowercase.includes("dlf")) {
    return {
      font: "font-sans font-black tracking-wide uppercase italic",
      color: "text-[#003366]", // Navy
      text: "DLF"
    };
  }
  if (lowercase.includes("piramal")) {
    return {
      font: "font-sans font-semibold tracking-[0.25em] uppercase text-xs sm:text-sm",
      color: "text-[#a37c24]", // Gold/Bronze
      text: "PIRAMAL"
    };
  }
  if (lowercase.includes("prestige")) {
    return {
      font: "font-serif font-black tracking-wider uppercase",
      color: "text-[#1d3557]", // Deep Navy Blue
      text: "PRESTIGE"
    };
  }
  if (lowercase.includes("tata")) {
    return {
      font: "font-sans font-black tracking-[0.3em] uppercase italic text-sm sm:text-base",
      color: "text-[#004B87]", // Tata Corporate Blue
      text: "TATA"
    };
  }
  if (lowercase.includes("shapoorji")) {
    return {
      font: "font-serif font-extrabold tracking-tighter uppercase text-sm sm:text-base",
      color: "text-[#0c2340]", // Dark Slate Navy
      text: "SHAPOORJI"
    };
  }
  if (lowercase.includes("raheja")) {
    return {
      font: "font-sans font-black tracking-widest uppercase",
      color: "text-[#d35400]", // Rich Amber Orange
      text: "RAHEJA"
    };
  }
  if (lowercase.includes("brigade")) {
    return {
      font: "font-sans font-extrabold italic tracking-tight uppercase",
      color: "text-[#b22222]", // Firebrick Red
      text: "BRIGADE"
    };
  }
  if (lowercase.includes("mahindra")) {
    return {
      font: "font-sans font-black tracking-tighter uppercase italic text-sm sm:text-base",
      color: "text-[#e50914]", // Mahindra Red
      text: "Mahindra"
    };
  }
  return {
    font: "font-sans font-bold tracking-wide uppercase",
    color: "text-slate-800",
    text: name
  };
}

function BuilderLogoCard({ name }: { name: string }) {
  const style = getBuilderTextStyle(name);
  const showSub = name.includes("Properties") || name.includes("Realty") || name.includes("Group") || name.includes("Housing") || name.includes("Lifespaces");
  const subText = name.includes("Properties") ? "Properties" : name.includes("Realty") ? "Realty" : name.includes("Group") ? "Group" : name.includes("Housing") ? "Housing" : "Lifespaces";

  return (
    <div className="flex h-16 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white px-4 shadow-[0_4px_18px_rgba(15,23,42,0.06)] sm:h-20 sm:w-48 transition-transform hover:scale-105">
      <div className="text-center">
        <span className={`${style.font} ${style.color} text-sm sm:text-base block`}>
          {style.text}
        </span>
        {showSub && (
          <span className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-[0.22em] block mt-0.5 sm:mt-1">
            {subText}
          </span>
        )}
      </div>
    </div>
  );
}

function BuilderLogoMarquee() {
  const track = [...BUILDER_LOGOS, ...BUILDER_LOGOS];

  return (
    <div className="relative overflow-hidden">
      <div className="builder-logo-marquee flex w-max gap-3 sm:gap-4">
        {track.map((builder, i) => (
          <BuilderLogoCard key={`${builder.name}-${i}`} name={builder.name} />
        ))}
      </div>
    </div>
  );
}

export function TrustedBuildersSection() {
  return (
    <section className="relative overflow-hidden py-6 sm:py-8">
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&h=600&fit=crop&q=80"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Side building accents */}
      <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-44 opacity-40 lg:block">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=700&fit=crop&q=80"
          alt=""
          className="h-full w-full object-cover [mask-image:linear-gradient(to_right,black,transparent)]"
        />
      </div>
      <div className="pointer-events-none absolute -right-6 top-0 hidden h-full w-44 opacity-40 lg:block">
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=700&fit=crop&q=80"
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
          className="mx-auto max-w-3xl rounded-2xl border border-white/20 bg-white/80 p-6 text-center backdrop-blur-md shadow-lg sm:p-8"
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
      </div>
    </section>
  );
}
