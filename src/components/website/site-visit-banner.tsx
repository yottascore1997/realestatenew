"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car } from "lucide-react";
import { useContactModal } from "@/lib/website/contact-context";
import { cn } from "@/lib/utils";

const ROUTE_PINS = [
  { label: "Project A", x: 18, y: 28 },
  { label: "Project B", x: 42, y: 12 },
  { label: "Project C", x: 68, y: 22 },
];

function CitySkyline() {
  return (
    <svg
      viewBox="0 0 1200 200"
      className="absolute inset-x-0 bottom-14 h-[55%] w-full text-[#c8cdd3] sm:bottom-16 sm:h-[65%]"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <path
        fill="currentColor"
        opacity="0.55"
        d="M0 200V120h40v-50h35v50h25V70h30v50h40V90h35v110h30V100h45v100h25V80h40v120h30V110h50v90h35V95h40v105h30V115h55v85h40V130h35v70h30V140h60v60H0z"
      />
      <path
        fill="currentColor"
        opacity="0.35"
        d="M200 200V150h20v-30h15v30h20V130h25v70h20V160h30v40h25V145h20v55h20V170h35v30H200z"
      />
    </svg>
  );
}

function RouteMap() {
  return (
    <svg viewBox="0 0 320 120" className="absolute left-[8%] top-[8%] hidden h-28 w-72 text-[#b8bcc4] sm:block lg:left-[12%] lg:top-[6%] lg:h-32 lg:w-80" aria-hidden>
      <path
        d="M55 75 Q95 25 130 45 T210 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      <path
        d="M210 35 Q250 55 265 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      {ROUTE_PINS.map(({ label, x, y }) => {
        const cx = x * 3.2;
        const cy = y * 3.2;
        return (
          <g key={label}>
            <circle cx={cx} cy={cy} r="14" fill="#22c55e" />
            <path
              d={`M${cx} ${cy - 5} C${cx - 4} ${cy - 2} ${cx - 4} ${cy + 4} ${cx} ${cy + 8} C${cx + 4} ${cy + 4} ${cx + 4} ${cy - 2} ${cx} ${cy - 5} Z`}
              fill="white"
            />
            <circle cx={cx} cy={cy + 1} r="2.5" fill="#22c55e" />
            <text x={cx} y={cy + 28} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TaxiIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative z-10 shrink-0", className)}>
      <svg viewBox="0 0 420 220" className="h-36 w-auto sm:h-44 lg:h-52" aria-hidden>
        {/* body */}
        <rect x="40" y="95" width="300" height="72" rx="14" fill="#facc15" />
        <rect x="55" y="78" width="195" height="42" rx="10" fill="#fde047" />
        <rect x="250" y="82" width="72" height="38" rx="8" fill="#93c5fd" opacity="0.85" />
        {/* checker */}
        <g transform="translate(175,108)">
          {Array.from({ length: 3 }).map((_, row) =>
            Array.from({ length: 4 }).map((__, col) => (
              <rect
                key={`${row}-${col}`}
                x={col * 12}
                y={row * 12}
                width="12"
                height="12"
                fill={(row + col) % 2 === 0 ? "#111827" : "#f8fafc"}
              />
            ))
          )}
        </g>
        {/* wheels */}
        <circle cx="110" cy="168" r="22" fill="#111827" />
        <circle cx="110" cy="168" r="10" fill="#64748b" />
        <circle cx="280" cy="168" r="22" fill="#111827" />
        <circle cx="280" cy="168" r="10" fill="#64748b" />
        {/* ola badge */}
        <circle cx="330" cy="118" r="34" fill="#111827" />
        <text x="330" y="125" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Arial,sans-serif">
          OLA
        </text>
        {/* taxi sign */}
        <rect x="145" y="62" width="58" height="18" rx="4" fill="#111827" />
        <text x="174" y="75" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
          TAXI
        </text>
      </svg>
    </div>
  );
}

function OlaLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-bold tracking-tight text-[#111827]", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111827] text-[10px] font-black text-white">
        OLA
      </span>
    </span>
  );
}

export function SiteVisitBanner() {
  const router = useRouter();
  const { openContact } = useContactModal();
  const [query, setQuery] = useState("");

  const handleBook = () => {
    const trimmed = query.trim();
    openContact({
      inquiryType: "Request Site Visit",
      title: "Book Free Site Visit",
      subtitle: "Schedule a cab visit to multiple projects — 100% free with our OLA partner.",
      defaultMessage: trimmed
        ? `I would like to book a free site visit for: ${trimmed}. Please arrange cab pickup and project tour.`
        : "I would like to book a free site visit for multiple projects. Please contact me to schedule.",
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/properties?search=${encodeURIComponent(trimmed)}`);
      return;
    }
    handleBook();
  };

  return (
    <section className="relative overflow-hidden bg-[#eceff3]">
      <CitySkyline />
      <RouteMap />

      {/* road */}
      <div className="absolute inset-x-0 bottom-0 z-[1] h-14 bg-[#111827] sm:h-16">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 border-t-2 border-dashed border-white/80" />
      </div>

      <div className="relative z-[2] mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-8 lg:pb-28">
        <TaxiIllustration className="self-start lg:-mb-2 lg:self-end" />

        {/* CTA card */}
        <div className="relative w-full max-w-xl shrink-0 rounded-2xl bg-[#0f2d5c] px-5 py-5 shadow-[0_20px_50px_rgba(15,45,92,0.35)] sm:px-6 sm:py-6 lg:max-w-lg lg:translate-y-[-24px]">
          <span className="absolute -right-1 -top-3 rounded-full bg-[#2563eb] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
            100% FREE
          </span>

          <h2 className="text-xl font-bold text-white sm:text-2xl">Book Free Site Visit</h2>

          <form onSubmit={handleSearchSubmit} className="mt-4">
            <div className="flex flex-col gap-2 rounded-xl bg-white p-1.5 sm:flex-row sm:items-center sm:rounded-full sm:pl-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search multiple projects for Site Visit"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:px-0 sm:py-2"
              />
              <div className="flex items-center gap-2 sm:pr-1">
                <OlaLogo className="hidden sm:inline-flex" />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#16a34a] sm:w-auto sm:rounded-full sm:px-5"
                >
                  Book Now
                  <Car className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          <p className="mt-3 flex items-center gap-2 text-xs text-white/60 sm:hidden">
            <OlaLogo className="text-white/80" />
            Partner cab for your site visits
          </p>
        </div>
      </div>
    </section>
  );
}
