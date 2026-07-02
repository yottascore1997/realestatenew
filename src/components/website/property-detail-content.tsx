"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize, Car, Building2, Heart, Share2, Camera,
  BadgeCheck, ChevronRight, ChevronDown, Calendar, Phone, Mail, Star, Download,
  Dumbbell, Waves, Users, Shield, Zap, TreePine, Home, FileText, Hash, Eye,
  Send, MessageSquare, Link2, Layers, Compass, Clock,
} from "lucide-react";
import { cn, formatINR } from "@/lib/utils";
import { ContactTrigger } from "@/components/website/contact-trigger";
import type { PropertyDetail } from "@/lib/website/property-detail-data";

const AMENITY_ICONS: Record<string, typeof Waves> = {
  "Swimming Pool": Waves,
  Gymnasium: Dumbbell,
  "Club House": Building2,
  "Landscaped Garden": TreePine,
  "Children's Play Area": Users,
  "24/7 Security": Shield,
  "Power Backup": Zap,
  "Covered Parking": Car,
  "Indoor Games": Layers,
  "Jogging Track": Compass,
};

function calcEmi(principal: number, rate: number, years: number) {
  const r = rate / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-6", className)}>
      <h2 className="text-base font-bold text-[#1a2744] sm:text-lg">{title}</h2>
      {children}
    </section>
  );
}

type PropertyDetailContentProps = {
  property: PropertyDetail;
};

export function PropertyDetailContent({ property }: PropertyDetailContentProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [readMore, setReadMore] = useState(false);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const images = property.images.length > 0 ? property.images : [property.image].filter(Boolean) as string[];
  const loanAmount = property.price * (1 - downPaymentPct / 100);
  const extraPhotos = Math.max(images.length - 4, 8);

  const emi = useMemo(
    () => Math.round(calcEmi(loanAmount, interestRate, tenure)),
    [loanAmount, interestRate, tenure]
  );

  const statusLabel = property.status.replace(/_/g, " ");

  const stats = [
    { icon: Bed, value: `${property.bedrooms} Bedrooms` },
    { icon: Bath, value: `${property.bathrooms} Bathrooms` },
    { icon: Maximize, value: `${property.sqft?.toLocaleString() ?? "—"} Sq.Ft.` },
    { icon: Car, value: `${property.parking} Parking` },
    { icon: Building2, value: `${property.floor} Floor (Total ${property.totalFloors} Floors)` },
  ];

  const highlights = [
    { icon: Hash, label: "Property ID", value: property.propertyId },
    { icon: FileText, label: "RERA ID", value: property.reraId },
    { icon: Home, label: "Property Type", value: property.type.replace(/_/g, " ") },
    { icon: Calendar, label: "Possession Status", value: property.possession },
    { icon: Layers, label: "Furnishing", value: property.furnishing },
    { icon: Clock, label: "Age of Property", value: property.propertyAge },
    { icon: Compass, label: "Facing", value: property.facing },
    { icon: Building2, label: "Floor", value: property.floor },
    { icon: Building2, label: "Total Floors", value: String(property.totalFloors) },
  ];

  return (
    <div className="min-h-screen bg-[#eef0f4] pb-14">
      {/* Breadcrumbs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-1 px-4 py-2.5 text-[13px] text-slate-500 sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-[#1a2744]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/properties" className="hover:text-[#1a2744]">Properties</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#1a2744]">{property.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6 lg:px-8">
        {/* Gallery — full width */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="relative aspect-[16/7] w-full sm:aspect-[21/9]">
            <img
              src={images[activeImage] || property.image || ""}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3 flex gap-2 sm:left-4 sm:top-4">
              {property.featured && (
                <span className="rounded-sm bg-theme-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Featured
                </span>
              )}
              <span className="rounded-sm bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1a2744]">
                {statusLabel}
              </span>
            </div>
            <div className="absolute right-3 top-3 flex gap-2 sm:right-4 sm:top-4">
              <button type="button" aria-label="Save" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md hover:text-rose-500">
                <Heart className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Share" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-md hover:text-slate-700">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded bg-black/60 px-3 py-1.5 text-xs font-semibold text-white sm:bottom-4 sm:left-4"
            >
              <Camera className="h-3.5 w-3.5" />
              View Photos
            </button>
          </div>
          <div className="grid grid-cols-5 gap-0 border-t border-slate-200">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden border-r border-slate-200 last:border-r-0",
                  activeImage === i && "ring-2 ring-inset ring-emerald-500"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
                {i === 4 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-bold text-white">
                    + {extraPhotos} More
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column body */}
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          {/* LEFT */}
          <div className="min-w-0 space-y-5">
            {/* Title header */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-2">
                  <h1 className="text-xl font-bold leading-snug text-[#1a2744] sm:text-2xl lg:text-[1.65rem]">
                    {property.title}
                  </h1>
                  <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500 sm:h-6 sm:w-6" />
                </div>
                <div className="lg:hidden">
                  <p className="text-xl font-bold text-emerald-600">{formatINR(property.price)}</p>
                  <p className="text-xs text-slate-400">All Inclusive</p>
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </p>

              {/* Stats row — mockup style */}
              <div className="mt-5 flex flex-wrap divide-x divide-slate-200 border-y border-slate-200">
                {stats.map(({ icon: Icon, value }) => (
                  <div key={value} className="flex min-w-[50%] flex-1 items-center gap-2 px-3 py-3 sm:min-w-0 sm:flex-col sm:px-4 sm:text-center">
                    <Icon className="h-4 w-4 shrink-0 text-slate-400 sm:mx-auto" />
                    <span className="text-xs font-medium text-[#1a2744] sm:text-[13px]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <SectionCard title="Overview">
              <p className={cn("mt-3 text-sm leading-relaxed text-slate-600", !readMore && "line-clamp-3")}>
                {property.description}
              </p>
              <button
                type="button"
                onClick={() => setReadMore((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {readMore ? "Read Less" : "Read More"}
                <ChevronDown className={cn("h-4 w-4 transition-transform", readMore && "rotate-180")} />
              </button>
            </SectionCard>

            {/* Amenities — icon grid */}
            <SectionCard title="Amenities">
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {property.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a] ?? Home;
                  return (
                    <div key={a} className="flex flex-col items-center rounded-md border border-slate-100 bg-slate-50/60 px-2 py-4 text-center">
                      <Icon className="h-5 w-5 text-slate-500" strokeWidth={1.5} />
                      <span className="mt-2 text-[11px] font-medium leading-tight text-slate-600 sm:text-xs">{a}</span>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className="mt-4 rounded border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
              >
                View All Amenities
              </button>
            </SectionCard>

            {/* Nearby */}
            <SectionCard title="Nearby Places">
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {property.nearby.map((place) => (
                  <div key={place.name} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 px-4 py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={1.5} />
                      <span className="truncate text-sm font-medium text-[#1a2744]">{place.name}</span>
                    </div>
                    <span className="ml-2 shrink-0 text-xs font-medium text-slate-400">{place.distance}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-4 rounded border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
              >
                View All
              </button>
            </SectionCard>

            {/* Floor plan */}
            <SectionCard title="Floor Plan">
              <div className="mt-4 flex flex-col overflow-hidden rounded-md border border-slate-200 sm:flex-row">
                <div className="h-44 shrink-0 sm:h-auto sm:w-[45%]">
                  <img
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop&q=85"
                    alt="Floor plan"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center border-t border-slate-200 p-5 sm:border-l sm:border-t-0 sm:p-6">
                  <p className="font-bold text-[#1a2744]">
                    {property.bedrooms} BHK {property.type.charAt(0) + property.type.slice(1).toLowerCase().replace(/_/g, " ")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Carpet Area: {property.sqft?.toLocaleString() ?? "—"} Sq.Ft.
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex w-fit items-center gap-2 rounded border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                  >
                    <Eye className="h-4 w-4" />
                    View Floor Plan
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT SIDEBAR — sticky */}
          <aside className="space-y-4 lg:sticky lg:top-20">
            {/* Price card */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-2xl font-bold text-emerald-600 sm:text-3xl">{formatINR(property.price)}</p>
              <p className="mt-0.5 text-xs text-slate-400">All Inclusive</p>
              <ContactTrigger
                inquiryType="Request Site Visit"
                context={property.title}
                defaultMessage={`I would like to schedule a site visit for ${property.title} in ${property.city}.`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <Calendar className="h-4 w-4" />
                Request a Visit
              </ContactTrigger>
              <ContactTrigger
                inquiryType="Buy Property"
                context={property.title}
                defaultMessage={`Please share more details about ${property.title}.`}
                className="mt-2.5 flex w-full items-center justify-center rounded border-2 border-emerald-600 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
              >
                Get More Details
              </ContactTrigger>
            </div>

            {/* Contact Agent */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-bold text-[#1a2744]">Contact Agent</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-base font-bold text-[#1a2744]">
                  {property.agent.avatar ? (
                    <img src={property.agent.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    property.agent.name.split(" ").map((n) => n[0]).join("")
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#1a2744]">{property.agent.name}</p>
                  <p className="truncate text-xs text-slate-500">{property.agent.designation}</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-600">{property.agent.rating}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${property.agent.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-1.5 rounded border border-slate-200 py-2.5 text-xs font-semibold text-[#1a2744] hover:bg-slate-50 sm:text-sm"
                >
                  <Phone className="h-4 w-4 text-emerald-600" />
                  Call
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center justify-center gap-1.5 rounded border border-slate-200 py-2.5 text-xs font-semibold text-[#1a2744] hover:bg-slate-50 sm:text-sm"
                >
                  <Mail className="h-4 w-4 text-emerald-600" />
                  Email
                </a>
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-bold text-[#1a2744]">Property Highlights</h3>
              <ul className="mt-3 space-y-0">
                {highlights.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.5} />
                      <span className="text-xs text-slate-500 sm:text-sm">{label}</span>
                    </div>
                    <span className="shrink-0 text-right text-xs font-semibold text-[#1a2744] sm:text-sm">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-bold text-[#1a2744]">Share this Property</h3>
              <div className="mt-3 flex gap-2">
                {[Share2, Send, MessageSquare, Mail, Link2].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label="Share"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Brochure */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-red-50">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a2744]">Download Brochure</p>
                  <p className="text-xs text-slate-400">{property.title.replace(/\s+/g, "_")}.pdf</p>
                </div>
              </div>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-slate-200 py-2.5 text-sm font-semibold text-[#1a2744] hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>

            {/* EMI Calculator */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-bold text-[#1a2744]">Mortgage Calculator</h3>
              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-slate-500">Property Price</label>
                  <p className="mt-0.5 text-sm font-bold text-[#1a2744]">{formatINR(property.price)}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-500">Down Payment</label>
                    <span className="text-xs font-bold text-emerald-600">{downPaymentPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="mt-1.5 h-1 w-full accent-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Loan Tenure</label>
                  <select
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm text-[#1a2744]"
                  >
                    {[10, 15, 20, 25, 30].map((y) => (
                      <option key={y} value={y}>{y} Years</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm text-[#1a2744]"
                  />
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-500">Estimated EMI</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ₹ {emi.toLocaleString("en-IN")}{" "}
                    <span className="text-sm font-normal text-slate-400">/ month</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full rounded bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Calculate EMI
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
