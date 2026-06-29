"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home, Search, Menu, X, MapPin, Building2, IndianRupee, ChevronDown,
  ArrowUpRight, Play, Layers, Star,
} from "lucide-react";
import { WEBSITE_NAV, BRAND_NAME } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

export const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop",
];

export function HeroSection() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("search", location);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative">
      {/* Video hero */}
      <div className="relative min-h-[88vh] overflow-hidden sm:min-h-[92vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="relative z-10 flex min-h-[88vh] flex-col sm:min-h-[92vh]">
          {/* Navbar */}
          <nav className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient shadow-gold">
                <Layers className="h-5 w-5 text-white" />
              </span>
              <span className="font-serif text-xl font-semibold text-white">{BRAND_NAME}</span>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              {WEBSITE_NAV.slice(0, 5).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium text-white/80 hover:text-white",
                    item.label === "Home" && "text-white"
                  )}
                >
                  {item.label}
                  {item.label === "Home" && <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-gold-gradient" />}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <button onClick={handleSearch} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20">
                <Search className="h-4 w-4" />
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md lg:hidden">
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </nav>

          {menuOpen && (
            <div className="absolute right-5 top-16 z-40 w-52 rounded-2xl border border-white/10 bg-black/80 p-2 backdrop-blur-xl sm:right-8">
              {WEBSITE_NAV.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-2.5 text-sm text-white/80 hover:bg-white/10">
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Hero content */}
          <div className="flex flex-1 flex-col justify-center px-5 pb-32 sm:px-8 lg:px-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
                  <Home className="h-3.5 w-3.5 text-violet-300" />
                  <span className="text-xs text-white/90">Find Your <span className="font-semibold text-violet-300">Dream Home</span></span>
                </div>

                <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                  Discover Homes That<br />
                  <span className="text-gold-gradient">Define You</span>
                </h1>

                <p className="mt-4 max-w-md text-sm text-white/75 sm:text-base">
                  Explore beautiful, modern and comfortable homes. Buy, sell & invest with zero brokerage.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link href="/properties">
                    <button className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-white shadow-gold hover:brightness-110">
                      Explore Properties <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="flex items-center gap-2.5 text-sm font-semibold text-white">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md">
                        <Play className="h-4 w-4 fill-white" />
                      </span>
                      Watch Video
                    </button>
                  </Link>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {AVATARS.map((src, i) => (
                      <img key={i} src={src} alt="" className="h-9 w-9 rounded-full border-2 border-white/30 object-cover" />
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">{[0,1,2,3,4].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                    <p className="text-xs font-medium text-white/80">10K+ Happy Clients</p>
                  </div>
                </div>
              </div>

              {/* Floating property card on video */}
              <div className="hidden justify-end lg:flex">
                <div className="rounded-2xl border border-white/30 bg-white/95 px-5 py-3 shadow-2xl backdrop-blur-sm">
                  <p className="text-sm font-semibold text-navy">Luxury Villa</p>
                  <p className="text-xs text-slate-500">Pune, Maharashtra</p>
                  <p className="mt-1 text-lg font-bold text-gold">₹4.5 Cr</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating search bar */}
      <div className="relative z-20 mx-auto -mt-16 max-w-5xl px-4 sm:-mt-14 sm:px-6">
        <div className="rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
          <p className="mb-3 text-sm font-bold text-navy sm:hidden">Find Your Perfect Home</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <MapPin className="h-4 w-4 text-gold" />
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full cursor-pointer appearance-none bg-transparent text-sm text-slate-700 outline-none">
                <option value="">Location</option>
                <option>Mumbai</option><option>Pune</option><option>Bangalore</option><option>Delhi NCR</option><option>Hyderabad</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
            </div>
            <div className="relative flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Building2 className="h-4 w-4 text-gold" />
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full cursor-pointer appearance-none bg-transparent text-sm text-slate-700 outline-none">
                <option value="">Property Type</option>
                <option>Apartment</option><option>Villa</option><option>Plot</option><option>Commercial</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
            </div>
            <div className="relative flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <IndianRupee className="h-4 w-4 text-gold" />
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full cursor-pointer appearance-none bg-transparent text-sm text-slate-700 outline-none">
                <option value="">Price Range</option>
                <option>Under ₹50 Lakh</option><option>₹50L – ₹1 Cr</option><option>Above ₹2 Cr</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
            </div>
            <button onClick={handleSearch} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gold-gradient px-6 text-sm font-semibold text-white shadow-gold hover:brightness-110 sm:shrink-0">
              <Search className="h-4 w-4" /> Search Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
