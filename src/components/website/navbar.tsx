"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { WEBSITE_NAV, WEBSITE_NAV_MORE, BRAND_PHONE } from "@/lib/website/constants";
import { BrandWordmark } from "@/components/website/brand-wordmark";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);

  if (isHome) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a2744]">
            <Layers className="h-4 w-4 text-amber-400" />
          </span>
          <BrandWordmark className="text-[#1a2744]" />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {WEBSITE_NAV.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-[#1a2744]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${BRAND_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-sm font-semibold text-[#1a2744]">
            <Phone className="h-4 w-4 text-amber-500" /> {BRAND_PHONE}
          </a>
          <Link href="/contact">
            <button className="rounded-lg bg-[#1a2744] px-4 py-2 text-sm font-semibold text-white hover:bg-[#243660]">
              Contact Us
            </button>
          </Link>
        </div>

        <button type="button" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6 text-[#1a2744]" /> : <Menu className="h-6 w-6 text-[#1a2744]" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {WEBSITE_NAV.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-medium text-slate-700">
              {item.label}
            </Link>
          ))}
          {WEBSITE_NAV_MORE.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-medium text-slate-600">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}>
            <button className="mt-2 w-full rounded-lg bg-[#1a2744] py-2.5 text-sm font-semibold text-white">Contact Us</button>
          </Link>
        </div>
      )}
    </header>
  );
}
