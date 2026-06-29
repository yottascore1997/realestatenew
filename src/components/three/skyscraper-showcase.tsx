"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import {
  Building2,
  ArrowRight,
  Play,
  MapPin,
  Search,
  Home,
  IndianRupee,
  ChevronDown,
  Sparkles,
  ChevronsDown,
} from "lucide-react";

const SkyscraperScene = dynamic(() => import("./skyscraper-scene"), { ssr: false });

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      gsap.to(obj, {
        v: to,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = prefix + obj.v.toFixed(decimals) + suffix;
        },
      });
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix, prefix, decimals, duration]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/*  Showcase                                                           */
/* ------------------------------------------------------------------ */

export function SkyscraperShowcase() {
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-anim]", {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={rootRef} className="relative w-full bg-[#0b1020] font-sans text-white">
      {/* ============ HERO ============ */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <SkyscraperScene />
        </div>

        {!ready && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0b1020]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300/30 border-t-amber-300" />
              <p className="text-sm font-medium tracking-[0.25em] text-amber-200/80">RENDERING SUNRISE</p>
            </div>
          </div>
        )}

        {/* scrims */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#0b1020] via-black/40 to-transparent" />

        {/* overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col">
          {/* top bar */}
          <header className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
            <div data-anim className="pointer-events-auto flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg shadow-amber-500/30">
                <Building2 className="h-5 w-5 text-[#0b1020]" />
              </div>
              <div className="leading-tight">
                <p className="font-serif text-lg font-bold">The Apex</p>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-amber-200/80">RESIDENCES</p>
              </div>
            </div>

            <nav data-anim className="pointer-events-auto hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 backdrop-blur-xl md:flex">
              {["Overview", "Amenities", "Floor Plans", "Gallery"].map((item) => (
                <button key={item} className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                  {item}
                </button>
              ))}
            </nav>

            <button data-anim className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl transition-all hover:bg-white/20">
              <MapPin className="h-4 w-4 text-amber-300" />
              <span className="hidden sm:inline">Mumbai</span>
            </button>
          </header>

          {/* hero copy */}
          <div className="mt-auto px-6 pb-10 sm:px-10 sm:pb-12">
            <div className="max-w-2xl">
              <span data-anim className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-200 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Now Pre-Launching
              </span>

              <h1 data-anim className="mt-4 font-serif text-5xl font-bold leading-[0.98] tracking-tight drop-shadow-2xl sm:text-7xl">
                Live Above
                <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  The Skyline
                </span>
              </h1>

              <p data-anim className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                An architectural icon of glass and light. Curated sky residences with panoramic
                sunrise views, private elevators and five-star concierge.
              </p>
            </div>

            {/* glass property search */}
            <div data-anim className="pointer-events-auto mt-7 w-full max-w-4xl">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-2xl sm:rounded-full">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  {[
                    { icon: MapPin, label: "Location", el: (
                      <input placeholder="Mumbai, Worli" className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/40 outline-none" />
                    )},
                    { icon: Home, label: "Residence", el: (
                      <div className="relative">
                        <select className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-white outline-none [&>option]:text-black">
                          <option>3 BHK Sky Suite</option>
                          <option>4 BHK Sky Villa</option>
                          <option>Penthouse</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                      </div>
                    )},
                    { icon: IndianRupee, label: "Budget", el: (
                      <div className="relative">
                        <select className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-white outline-none [&>option]:text-black">
                          <option>₹4 Cr – ₹6 Cr</option>
                          <option>₹6 Cr – ₹9 Cr</option>
                          <option>₹9 Cr+</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                      </div>
                    )},
                  ].map(({ icon: Icon, label, el }, i) => (
                    <div key={label} className={`flex flex-1 items-center gap-3 px-5 py-3.5 ${i < 2 ? "border-b border-white/10 sm:border-b-0 sm:border-r" : ""}`}>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-300/20">
                        <Icon className="h-4 w-4 text-amber-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">{label}</p>
                        {el}
                      </div>
                    </div>
                  ))}
                  <div className="p-2.5">
                    <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3 text-sm font-bold text-[#0b1020] shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.03]">
                      <Search className="h-4 w-4" />
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* scroll hint */}
          <div data-anim className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/50">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <ChevronsDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============ STATS / COUNTERS ============ */}
      <section className="relative border-t border-white/5 bg-gradient-to-b from-[#0b1020] to-[#0e1426] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300/80">By The Numbers</p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">
              A landmark measured in <span className="text-amber-300">superlatives</span>
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {[
              { to: 120, suffix: "+", label: "Floors of Living" },
              { to: 4.85, prefix: "₹", suffix: " Cr", decimals: 2, label: "Starting Price" },
              { to: 98, suffix: "%", label: "Already Sold" },
              { to: 360, suffix: "°", label: "Skyline Views" },
            ].map((s) => (
              <div key={s.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:border-amber-300/30">
                <p className="font-serif text-4xl font-bold text-white sm:text-5xl">
                  <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative bg-[#0e1426] pb-28 pt-6">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-300/10 via-white/5 to-transparent p-10 backdrop-blur-xl sm:p-16">
            <div className="relative z-10 max-w-xl">
              <h3 className="font-serif text-3xl font-bold sm:text-4xl">
                Your address in the clouds awaits
              </h3>
              <p className="mt-3 text-white/70">
                Schedule a private viewing at our experience center and walk through a life
                elevated above the city.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3.5 text-sm font-bold text-[#0b1020] shadow-xl shadow-amber-500/30 transition-transform hover:scale-[1.03]">
                  Book a Private Tour
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b1020]/15 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
                <button className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold backdrop-blur-xl transition-all hover:bg-white/15">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <Play className="h-3.5 w-3.5 fill-white" />
                  </span>
                  Watch Film
                </button>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
