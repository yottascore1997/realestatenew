"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { BrandLogo } from "@/components/website/brand-logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "#overview" },
  { label: "Highlights", href: "#highlights" },
  { label: "Amenities", href: "#amenities" },
  { label: "Location", href: "#location" },
  { label: "Gallery", href: "#gallery" },
] as const;

export function LaunchPageHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/98 backdrop-blur-md">
      <div className="relative mx-auto flex h-[64px] max-w-7xl items-center px-4 sm:h-[68px] sm:px-6 lg:px-8">
        <BrandLogo href="/" height={48} variant="full" theme="dark" showTagline={false} />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex">
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-[13px] font-medium text-slate-600 transition-colors hover:text-orange-600"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#register"
          className="ml-auto hidden items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(5,150,105,0.3)] transition-colors hover:bg-emerald-700 lg:inline-flex"
        >
          <Phone className="h-4 w-4" strokeWidth={2.5} />
          Enquire Now
        </a>

        <button
          type="button"
          className="ml-auto lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6 text-[#0f1729]" /> : <Menu className="h-6 w-6 text-[#0f1729]" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {label}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setOpen(false)}
              className={cn(
                "mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white"
              )}
            >
              <Phone className="h-4 w-4" /> Enquire Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
