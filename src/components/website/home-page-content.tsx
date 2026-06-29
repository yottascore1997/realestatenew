"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart, Bed, Bath, Maximize, ArrowRight, ChevronLeft, ChevronRight,
  LayoutGrid, ShieldCheck, Leaf, Headphones, Users, Building2, Award, Quote, Star,
} from "lucide-react";
import { HeroSection } from "@/components/website/hero-section";
import { TRUST_STATS, TESTIMONIALS, BRAND_NAME } from "@/lib/website/constants";
import { formatINR, cn } from "@/lib/utils";

const FEATURES = [
  { icon: LayoutGrid, bg: "bg-violet-100 text-violet-600", title: "Modern Design", desc: "Exclusive modern architecture for your lifestyle." },
  { icon: ShieldCheck, bg: "bg-rose-100 text-rose-600", title: "Trusted & Safe", desc: "Secure and trusted properties only." },
  { icon: Leaf, bg: "bg-emerald-100 text-emerald-600", title: "Eco Friendly", desc: "Sustainable living for a better future." },
  { icon: Headphones, bg: "bg-sky-100 text-sky-600", title: "24/7 Support", desc: "We are always here to help you." },
];

const STAT_ICONS = [Users, Building2, Award, Users];

const PLACEHOLDER_PROPERTIES = [
  { id: "1", title: "Modern Villa", city: "Pune, MH", price: 24500000, status: "FOR_SALE", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", beds: 4, baths: 3, sqft: 3200 },
  { id: "2", title: "Luxury Apartment", city: "Mumbai, MH", price: 18500000, status: "FOR_SALE", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", beds: 3, baths: 2, sqft: 1800 },
  { id: "3", title: "Premium Penthouse", city: "Bangalore, KA", price: 65000, status: "FOR_RENT", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop", beds: 3, baths: 2, sqft: 2100, rent: true },
  { id: "4", title: "Garden Villa", city: "Hyderabad, TS", price: 32000000, status: "FOR_SALE", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop", beds: 5, baths: 4, sqft: 4500 },
];

interface PropertyItem {
  id: string; title: string; address: string; city: string; image?: string | null;
  price: number; bedrooms?: number | null; bathrooms?: number | null; sqft?: number | null; status: string;
}
interface HomePageContentProps {
  projects: unknown[];
  properties: PropertyItem[];
  launches: unknown[];
}

export function HomePageContent({ properties }: HomePageContentProps) {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [email, setEmail] = useState("");

  const source = properties.length >= 4 ? properties.slice(0, 4) : null;
  const displayProperties = (source ?? PLACEHOLDER_PROPERTIES).map((p) => {
    const isApi = "bedrooms" in p;
    return {
      id: p.id,
      title: p.title,
      city: p.city,
      price: Number(p.price),
      image: p.image ?? undefined,
      beds: isApi ? (p.bedrooms ?? 3) : p.beds,
      baths: isApi ? (p.bathrooms ?? 2) : p.baths,
      sqft: p.sqft ?? 1800,
      rent: p.status === "FOR_RENT" || ("rent" in p && !!p.rent),
    };
  });

  const t = TESTIMONIALS[testimonialIdx];

  return (
    <div className="bg-white">
      <HeroSection />

      {/* Features */}
      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, bg, title, desc }) => (
              <div key={title} className="text-center sm:text-left">
                <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl", bg)}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-navy">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Residences */}
      <section className="bg-slate-50/80 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">Properties</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-navy sm:text-3xl">Our Popular Residences</h2>
            </div>
            <Link href="/properties" className="flex items-center gap-1 text-sm font-semibold text-gold-dark hover:text-gold">
              View All Properties <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayProperties.map((p) => (
              <Link key={p.id} href="/properties" className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.image || ""} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className={cn(
                    "absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white",
                    p.rent ? "bg-emerald-500" : "bg-gold-gradient shadow-gold"
                  )}>
                    {p.rent ? "For Rent" : "For Sale"}
                  </span>
                  <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow" onClick={(e) => e.preventDefault()}>
                    <Heart className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-navy">{p.title}</h3>
                  <p className="text-sm text-slate-500">{p.city}</p>
                  <p className="mt-2 text-lg font-bold text-gold-dark">
                    {p.rent ? `${formatINR(p.price)}/mo` : formatINR(p.price)}
                  </p>
                  <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{p.beds} Beds</span>
                    <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{p.baths} Baths</span>
                    <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{Number(p.sqft).toLocaleString()} sqft</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-3">
            <div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-navy sm:text-3xl">
                We Provide The Best Property <span className="text-gold-gradient">For You</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                {BRAND_NAME} offers verified listings, zero brokerage, and end-to-end support from search to registration.
              </p>
              <Link href="/contact">
                <button className="mt-6 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-white shadow-gold hover:brightness-110">
                  Learn More About Us
                </button>
              </Link>
            </div>

            <div className="space-y-4">
              {TRUST_STATS.map(({ value, label }, i) => {
                const Icon = STAT_ICONS[i] ?? Users;
                return (
                  <div key={label} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xl font-bold text-navy">{value}</p>
                      <p className="text-sm text-slate-500">{label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=500&fit=crop"
                alt="Luxury home"
                className="w-full rounded-2xl object-cover shadow-lg"
              />
              <div className="absolute right-4 top-4 rounded-xl bg-gold-gradient px-4 py-2 text-center text-white shadow-gold">
                <p className="text-xs font-medium opacity-90">Trusted by</p>
                <p className="text-sm font-bold">Thousands of Families</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50/80 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center font-serif text-2xl font-semibold text-navy sm:text-3xl">
            Trusted By Thousands Of Happy Customers
          </h2>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="hidden items-end justify-center gap-6 lg:flex">
              <div className="h-48 w-40 rounded-2xl bg-gradient-to-br from-violet-200 to-violet-400 shadow-lg" />
              <div className="mb-8 h-32 w-24 rounded-full bg-emerald-100 shadow-md" />
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100 sm:p-8">
              <Quote className="h-10 w-10 text-gold/30" />
              <div className="mt-2 flex gap-1">{[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-light font-bold text-gold-dark">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-navy">{t.name}</p>
                    <p className="text-sm text-slate-500">Home Owner · {t.city}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setTestimonialIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-violet-50 px-6 py-8 sm:flex-row sm:px-10 sm:py-10">
            <div>
              <h3 className="font-serif text-xl font-semibold text-navy sm:text-2xl">Subscribe to our newsletter</h3>
              <p className="mt-1 text-sm text-slate-500">Get the latest property updates and offers.</p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 flex-1 rounded-xl border border-violet-100 bg-white px-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
              <button className="h-11 shrink-0 rounded-xl bg-gold-gradient px-5 text-sm font-semibold text-white shadow-gold hover:brightness-110">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
