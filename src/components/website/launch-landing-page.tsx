"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MapPin, Phone, Building2, ShieldCheck, Dumbbell, Waves, Baby, Footprints,
  Zap, TreePine, BadgeCheck, Landmark, ArrowRight, Car, ShoppingBag,
  GraduationCap, CheckCircle2, ChevronRight, User, Mail, Star, Compass, Check
} from "lucide-react";
import { LaunchLeadPopup } from "@/components/website/launch-lead-popup";
import { LaunchFloatingCta } from "@/components/website/launch-floating-cta";
import { BRAND_PHONE } from "@/lib/website/constants";
import { cn } from "@/lib/utils";
import type { LaunchLandingData } from "@/lib/website/launch-types";

type LaunchLandingPageProps = {
  launch: LaunchLandingData;
  stats?: unknown;
  similarLaunches?: LaunchLandingData[];
};

const AMENITIES = [
  { icon: Building2, label: "50,000 Sq.Ft. Clubhouse", desc: "Multi-level entertainment hub" },
  { icon: Waves, label: "Infinity Swimming Pool", desc: "Temperature-controlled deck" },
  { icon: Dumbbell, label: "State-of-the-art Gym", desc: "Cardio & strength equipment" },
  { icon: Baby, label: "Kids Play Zone", desc: "Indoor & outdoor activity area" },
  { icon: TreePine, label: "Landscaped Gardens", desc: "Theme parks & nature trails" },
  { icon: Footprints, label: "Jogging & Cycling Track", desc: "Cushioned professional track" },
  { icon: Zap, label: "Power Backup", desc: "100% automatic generator backup" },
  { icon: ShieldCheck, label: "4-tier Security", desc: "CCTV, RFID access & guards" },
  { icon: Car, label: "Multi-level Parking", desc: "Reserved slot with EV chargers" },
];

const FLOOR_PLANS = [
  {
    bhk: "2 BHK Luxury",
    size: "1,180 - 1,260 Sq.Ft.",
    price: "₹68 Lakh - ₹78 Lakh",
    carpet: "840 Sq.Ft.",
    deck: "65 Sq.Ft. Premium deck",
    details: "Ideal for young families. Features master bedroom with attached bath, spacious modular kitchen, dining deck, and separate dry balcony."
  },
  {
    bhk: "3 BHK Premium",
    size: "1,580 - 1,820 Sq.Ft.",
    price: "₹95 Lakh - ₹1.18 Cr",
    carpet: "1,120 Sq.Ft.",
    deck: "90 Sq.Ft. Double-height deck",
    details: "Perfect lifestyle balance. Includes large family living-dining hall, 3 balconies, parent's bedroom, grand master bedroom, and premium fittings."
  },
  {
    bhk: "4 BHK Signature",
    size: "2,250 - 2,680 Sq.Ft.",
    price: "₹1.42 Cr - ₹1.55 Cr",
    carpet: "1,690 Sq.Ft.",
    deck: "140 Sq.Ft. Panoramic sky deck",
    details: "Unmatched luxury. Private elevator lobby, double-height deck overlooking central gardens, servant quarters, wet & dry kitchen, and Italian marble."
  }
];

const BUDGET_OPTIONS = [
  "Under ₹50 Lakh",
  "₹50 L - ₹1 Cr",
  "₹1 Cr - ₹2 Cr",
  "₹2 Cr - ₹5 Cr",
  "Above ₹5 Cr",
];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK", "Plot / Villa"];

const LOCATION_HUBS = [
  {
    category: "IT & Business Parks",
    icon: Building2,
    items: [
      { name: "Prestige Tech Park", time: "10 Mins" },
      { name: "Wipro Corporate Office", time: "5 Mins" },
      { name: "RGA Tech Park", time: "8 Mins" },
      { name: "Outer Ring Road (ORR) Hub", time: "12 Mins" }
    ]
  },
  {
    category: "Schools & Education",
    icon: GraduationCap,
    items: [
      { name: "Greenwood High School", time: "5 Mins" },
      { name: "Oakridge International School", time: "4 Mins" },
      { name: "The International School Bangalore (TISB)", time: "6 Mins" },
      { name: "Inventure Academy", time: "8 Mins" }
    ]
  },
  {
    category: "Hospitals & Care",
    icon: Landmark,
    items: [
      { name: "Motherhood Hospital", time: "8 Mins" },
      { name: "Columbia Asia / Manipal Hospital", time: "10 Mins" },
      { name: "Sakra World Hospital", time: "15 Mins" }
    ]
  },
  {
    category: "Shopping & Transit",
    icon: ShoppingBag,
    items: [
      { name: "Sarjapur Forum Mall", time: "12 Mins" },
      { name: "Decathlon Sarjapur", time: "5 Mins" },
      { name: "Proposed Metro Station", time: "10 Mins" },
      { name: "Kempegowda Int. Airport", time: "55 Mins" }
    ]
  }
];

function formatPrice(from?: number | null, to?: number | null) {
  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)} Cr`;
    return `₹${(n / 100000).toFixed(0)} Lakh`;
  };
  if (!from) return "Price on Request";
  if (to && to > from) return `${fmt(from)} - ${fmt(to)}`;
  return `${fmt(from)} onwards`;
}

export function LaunchLandingPage({ launch, similarLaunches = [] }: LaunchLandingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    bhk: launch.bhk ?? "",
    budget: "",
    message: `I'm interested in ${launch.name}. Please share floor plans, pricing & site visit slots.`,
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const phoneHref = `tel:${BRAND_PHONE.replace(/\s/g, "")}`;
  
  const getDynamicRera = (city: string, slug: string) => {
    if (city.toLowerCase().includes("pune") || city.toLowerCase().includes("mumbai")) {
      return `MHRD/MH/RERA/P521000${slug === "royal-gardens" ? "43120" : "004312"}`;
    }
    return `PRM/KA/RERA/1251/310/PR/210928/004312`;
  };
  
  const reraNumber = getDynamicRera(launch.city, launch.slug);
  const startPrice = formatPrice(launch.priceFrom, launch.priceTo);
  const bhkOptions = launch.bhk ? [...new Set([launch.bhk, ...BHK_OPTIONS])] : BHK_OPTIONS;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.mobile.trim()) {
      setError("Please enter your name and mobile number.");
      return;
    }
    const digits = form.mobile.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/launches/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          mobile: form.mobile,
          email: form.email,
          bhk: form.bhk,
          budget: form.budget,
          message: form.message,
          launchSlug: launch.slug,
          launchName: launch.name,
          launchCity: launch.city,
          launchLocation: launch.location,
          projectId: launch.projectId,
          utmSource: "launch-lp-hero",
          utmCampaign: launch.slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-orange-500/10 selection:text-orange-950 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-0 relative font-sans">
      
      {/* 1. Header Details Area (CoFynd Style Header Area with Premium Dark Background) */}
      <section className="bg-[#0b1329] border-b border-slate-800/80 pt-8 pb-8 text-white relative overflow-hidden">
        {/* Ambient gold glow spotlight behind the dark header */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-l from-amber-500/10 to-transparent blur-[80px] pointer-events-none z-0" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              {/* Builder Info */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  {launch.builder ?? "PREMIUM BUILDER"}
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">OFFICIAL LAUNCH</span>
              </div>

              {/* Title & Location details */}
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                {launch.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-350">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span className="font-bold text-slate-200">{launch.location}, {launch.city}</span>
                </div>
                <div className="h-3.5 w-[1px] bg-slate-800 hidden sm:block" />
                <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>RERA Regd: <strong>{reraNumber.split("/").slice(-1)[0]}</strong></span>
                </div>
                <div className="h-3.5 w-[1px] bg-slate-800 hidden sm:block" />
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-450 fill-amber-450" />
                  <span className="font-black text-white">4.9</span>
                  <span className="text-slate-400 font-medium">(120+ Reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick Pricing Callout on right header */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 md:min-w-[200px] shadow-lg backdrop-blur-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Starting Price</span>
              <span className="text-xl sm:text-2xl font-black text-orange-400 leading-none">{startPrice}</span>
              <span className="text-[9px] font-bold text-slate-400">*Govt. Taxes Extra</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Image Gallery Grid Layout (CoFynd / Booking.com Style) */}
      <section className="bg-slate-100 border-b border-slate-200 py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 rounded-2xl overflow-hidden shadow-md">
            
            {/* Left Big image (Featured photo) */}
            <div className="md:col-span-2 relative aspect-[16/9] md:aspect-auto md:h-[400px] bg-slate-200">
              {launch.image && (
                <img
                  src={launch.image}
                  alt={launch.name}
                  className="h-full w-full object-cover"
                />
              )}
              <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                Exterior Rendering
              </span>
            </div>

            {/* Right stacked stacked image mock gallery */}
            <div className="hidden md:flex flex-col gap-2.5 h-[400px]">
              <div className="flex-1 relative bg-slate-200 overflow-hidden">
                {launch.image ? (
                  <img
                    src={launch.image}
                    alt="Clubhouse Rendering"
                    className="h-full w-full object-cover scale-110 rotate-1 transform filter saturate-[1.1]"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-300" />
                )}
                <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                  Clubhouse
                </span>
              </div>
              <div className="flex-1 relative bg-slate-200 overflow-hidden">
                {launch.image ? (
                  <img
                    src={launch.image}
                    alt="Master Plan Blueprint"
                    className="h-full w-full object-cover scale-125 translate-x-3 filter saturate-[0.85] contrast-[1.15]"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-400" />
                )}
                <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                  Landscape Garden
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Split Page Layout (Left content, Right sticky Inquiry Form) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1.15fr] gap-8 items-start">
          
          {/* LEFT MAIN DETAILS COLUMN */}
          <div className="space-y-8">
            
            {/* Highlights quick specs section */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Project Key Highlights
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Building2, label: "Clubhouse Size", val: "50,000+ Sq.Ft." },
                  { icon: GraduationCap, label: "Campus Education", val: "International School" },
                  { icon: ShoppingBag, label: "Shopping Mall", val: "High Street Retail" },
                  { icon: Landmark, label: "Medical Facilities", val: "Multi-Speciality" }
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider leading-none">{label}</p>
                      <p className="text-xs font-black text-slate-800 mt-1 leading-tight">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About / Description */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                About BHIVE &amp; Prestige Lakeside
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Prestige Lakeside brings you premium residential luxury designed to accommodate global citizens looking for the ultimate lifestyle in Bangalore. Placed strategically near major business parks, this signature development blends luxury 2, 3 &amp; 4 BHK spaces with ecological landscaping, a multi-tier premium clubhouse, and premium specs.
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                Our design focuses on natural lighting, double-height private decks, cross-ventilated bedroom windows, and soundproof study walls to support hybrid and work-from-home specialists.
              </p>
            </div>

            {/* Floor Plans & Pricing Section */}
            <div id="floor-plans" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                  Floor Plans &amp; Cost Options
                </h3>
                <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Plans Verified
                </span>
              </div>

              {/* Floor tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {FLOOR_PLANS.map((plan, i) => (
                  <button
                    key={plan.bhk}
                    type="button"
                    onClick={() => setSelectedPlan(i)}
                    className={cn(
                      "px-4 py-2 text-xs font-black rounded-lg border transition-all",
                      selectedPlan === i 
                        ? "bg-slate-900 border-slate-900 text-white shadow" 
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                    )}
                  >
                    {plan.bhk}
                  </button>
                ))}
              </div>

              {/* Showcase Detail Grid */}
              <div className="grid gap-6 md:grid-cols-5 items-stretch">
                <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-sm font-extrabold text-slate-900">{FLOOR_PLANS[selectedPlan].bhk} Premium Layout Details</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {FLOOR_PLANS[selectedPlan].details}
                    </p>
                    {/* Key stats */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Super Area</span>
                        <p className="text-xs font-black text-slate-800 mt-0.5">{FLOOR_PLANS[selectedPlan].size}</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Carpet Area</span>
                        <p className="text-xs font-black text-slate-800 mt-0.5">{FLOOR_PLANS[selectedPlan].carpet}</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Balcony Deck</span>
                        <p className="text-xs font-black text-slate-800 mt-0.5">{FLOOR_PLANS[selectedPlan].deck}</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Price Range</span>
                        <p className="text-xs font-black text-orange-655 mt-0.5">{FLOOR_PLANS[selectedPlan].price}</p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href="#register-form" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 mt-2"
                  >
                    Request Brochure PDF <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Simulated Blueprint Graphic */}
                <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:15px_15px]" />
                  <div className="relative text-center">
                    <Compass className="h-10 w-10 text-orange-500/25 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Layout Schematic</p>
                    <a href="#register-form" className="text-[9px] font-black text-orange-500 uppercase tracking-wider block mt-1 hover:underline">
                      Download Plan Document
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing list table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Detailed Pricing Table
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">BHK Type</th>
                      <th className="px-4 py-3">Super Area</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {FLOOR_PLANS.map((plan) => (
                      <tr key={plan.bhk} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3.5 font-bold text-slate-800">{plan.bhk}</td>
                        <td className="px-4 py-3.5 text-slate-500">{plan.size}</td>
                        <td className="px-4 py-3.5 font-black text-orange-600">{plan.price.split(" ")[0]}*</td>
                        <td className="px-4 py-3.5 text-right">
                          <a href="#register-form" className="text-xs font-bold text-orange-500 hover:underline">
                            Request Cost Sheet
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Amenities Grid List */}
            <div id="amenities" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Premium Township Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {AMENITIES.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 border border-slate-200/60 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connectivity Advantage */}
            <div id="location" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Connectivity &amp; Location Advantages
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {LOCATION_HUBS.map((hub) => (
                  <div key={hub.category} className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200/60 text-slate-800 font-extrabold text-xs uppercase tracking-wider">
                      <hub.icon className="h-4 w-4 text-orange-500" />
                      <span>{hub.category}</span>
                    </div>
                    <div className="space-y-2">
                      {hub.items.map((item) => (
                        <div key={item.name} className="flex justify-between text-xs text-slate-500">
                          <span>{item.name}</span>
                          <span className="font-bold text-slate-800">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (STICKY TOUR BOOKING FORM) */}
          <div className="sticky top-24 z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              id="register-form"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100"
            >
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                  <h3 className="mt-4 text-base font-bold text-slate-900">Tour Booking Confirmed!</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                    Our coordinator will callback within <strong>2 hours</strong> with private site visit invitation slots and layout maps.
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <span className="rounded bg-orange-655 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm shadow-orange-500/15">
                      VIP ACCESS
                    </span>
                    <h3 className="mt-2 text-base font-black text-slate-900">Schedule a Site Tour</h3>
                    <p className="text-[11px] text-slate-550 mt-0.5 leading-none">Choose timing slots &amp; get brochure copies</p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-3.5">
                    {/* Name input */}
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        placeholder="Full Name *"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pl-9.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                      />
                    </div>

                    {/* Mobile input */}
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="tel"
                        placeholder="Mobile Number *"
                        value={form.mobile}
                        onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pl-9.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                      />
                    </div>

                    {/* Email input */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pl-9.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                      />
                    </div>

                    {/* BHK Dropdown */}
                    <select
                      value={form.bhk}
                      onChange={(e) => setForm((f) => ({ ...f, bhk: e.target.value }))}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                    >
                      <option value="">Select BHK Layout</option>
                      {bhkOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>

                    {/* Budget Dropdown */}
                    <select
                      value={form.budget}
                      onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                    >
                      <option value="">Select Budget Range</option>
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>

                    {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                    {/* Submit CTA button */}
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-black text-white shadow-lg shadow-orange-500/20 hover:opacity-95 transition-all"
                    >
                      {loading ? "Booking Tour..." : (
                        <>
                          Book Free Site Tour <ArrowRight className="h-4 w-4 shrink-0" />
                        </>
                      )}
                    </button>

                    {/* Form promises */}
                    <div className="mt-3.5 space-y-2 border-t border-slate-100 pt-3">
                      {[
                        "Zero Brokerage Policy",
                        "Free Cab Service for Site Visit",
                        "100% Secure & Private Details"
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-[10px] text-slate-555 font-bold leading-none">
                          <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>

        </div>
      </section>

      {/* 4. Similar Properties / Launches in the Same Area Section */}
      {similarLaunches.length > 0 && (
        <section className="bg-slate-100 border-t border-b border-slate-200 py-16 sm:py-20 z-10 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-550/10 px-3 py-1 rounded border border-orange-500/20">
                  Recommendations
                </span>
                <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl leading-tight">
                  Similar Properties in {launch.city}
                </h2>
                <p className="text-sm text-slate-500 mt-1.5">
                  Explore other high-end residential new launches and premium townships nearby.
                </p>
              </div>
              
              <a 
                href="/launches" 
                className="inline-flex items-center gap-1.5 text-xs font-black text-slate-900 bg-white border border-slate-200 shadow-sm rounded-xl px-4.5 py-2.5 hover:bg-slate-50 transition-colors w-fit"
              >
                View All New Launches <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarLaunches.map((item) => (
                <div 
                  key={item.id} 
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-200 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                    
                    {/* Status / Builder Overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="rounded bg-slate-900/90 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 backdrop-blur-md">
                        {item.builder ?? "PREMIUM"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight group-hover:text-orange-500 transition-colors">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.location}, {item.city}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Starting from</p>
                        <p className="text-sm font-black text-orange-600 mt-1 leading-none">
                          {formatPrice(item.priceFrom, item.priceTo).split(" ")[0]}*
                        </p>
                      </div>
                      
                      <a 
                        href={`/launches/${item.slug}`} 
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 text-[11px] font-black text-white px-3.5 py-2 shadow group-hover:bg-orange-500 transition-colors"
                      >
                        Explore Project <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Footer Disclaimer & RERA */}
      <section className="bg-[#0c2340] border-t border-slate-900 py-10 text-slate-455">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 items-center justify-between border-b border-slate-800 pb-8 md:flex-row">
            
            {/* Branding & Logo */}
            <div className="text-center md:text-left">
              <h3 className="text-base font-black text-white uppercase tracking-widest">Triyards Realty</h3>
              <p className="text-xs mt-1">India&apos;s Premium Real Estate Platform</p>
            </div>

            {/* Zero Brokerage Statement */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-emerald-400 text-xs shadow-sm">
              <BadgeCheck className="h-4 w-4 shrink-0" />
              <span><strong>Zero Brokerage Policy</strong>. Certified channel partner platform.</span>
            </div>

            {/* RERA Certificate Tag in Green */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-emerald-400 text-xs shadow-sm">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span><strong>RERA Regd. No</strong>: {reraNumber}</span>
            </div>

          </div>

          <div className="mt-8 text-center text-[10px] sm:text-xs leading-relaxed max-w-4xl mx-auto space-y-4 text-slate-400">
            <p>
              Disclaimer: All information, images, blueprints, and metrics presented on this page are tentative marketing resources provided in good faith. The final specifications, pricing structures, layouts, and handovers will be governed exclusively by the registered builder Agreements and official RERA disclosures.
            </p>
            <p>
              &copy; {new Date().getFullYear()} Triyards Realty. Developed in partnership with registered A-grade developers. All rights reserved.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Calling bar for mobile screens */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t border-slate-100 bg-white/95 p-3 shadow-2xl backdrop-blur-md pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:hidden">
        <a href={phoneHref} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700">
          <Phone className="h-4 w-4 text-orange-500" /> Call Specialist
        </a>
        <a href="#register-form" className="flex flex-[2] items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20">
          Enquire Now
        </a>
      </div>

      <LaunchLeadPopup launch={launch} />
      <LaunchFloatingCta />

    </div>
  );
}
