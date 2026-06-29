"use client";

import { useEffect, useState } from "react";
import { Building2, Users, TrendingUp, Shield } from "lucide-react";
import { BRAND_NAME } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

const SHOWCASE_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=1400&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=1400&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=1400&fit=crop",
];

const FEATURES = [
  { icon: Users, text: "Lead Management" },
  { icon: Building2, text: "Projects & Properties" },
  { icon: TrendingUp, text: "Revenue Tracking" },
  { icon: Shield, text: "Secure Access" },
];

const STATS = [
  { value: "500+", label: "Projects" },
  { value: "10K+", label: "Leads Managed" },
  { value: "50+", label: "Cities" },
];

export function LoginShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SHOWCASE_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden h-screen w-[52%] shrink-0 overflow-hidden lg:block xl:w-1/2">
      {/* Full-bleed slideshow */}
      {SHOWCASE_IMAGES.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 scale-105 bg-cover bg-center transition-all duration-[1.4s] ease-in-out",
            i === active ? "scale-100 opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* Layered overlays — text readable, image visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a1d] via-[#0c0a1d]/75 to-[#0c0a1d]/30" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/60 via-transparent to-indigo-950/50" />
      <div className="bg-grid-faint absolute inset-0 opacity-[0.12]" />
      <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />

      <div className="relative flex h-full flex-col justify-end p-8 xl:p-10">
        <div className="space-y-4 xl:space-y-5">
          <div>
            <h1 className="text-2xl font-extrabold leading-[1.2] text-white xl:text-[2rem]">
              Your Property Business,
              <br />
              <span className="text-violet-200">One Smart Dashboard</span>
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
              Leads, site visits, bookings aur team performance — sab manage karein ek secure, premium CRM se.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {FEATURES.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-violet-200" />
                {text}
              </span>
            ))}
          </div>

          {/* Stats glass bar */}
          <div className="flex divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
            {STATS.map((s) => (
              <div key={s.label} className="flex-1 px-4 py-3 text-center">
                <p className="text-lg font-extrabold text-white">{s.value}</p>
                <p className="text-[10px] font-medium text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-xs text-white/40">© {new Date().getFullYear()} {BRAND_NAME} · Trusted by professionals</p>
      </div>
    </div>
  );
}
