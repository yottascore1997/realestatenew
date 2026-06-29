"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Menu, X, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";
import { WEBSITE_NAV, WEBSITE_NAV_MORE, BRAND_NAME, BRAND_PHONE } from "@/lib/website/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);

  if (isHome) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient shadow-gold sm:h-10 sm:w-10">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-navy sm:text-xl">{BRAND_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {WEBSITE_NAV.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-gold-dark">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={`tel:${BRAND_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Phone className="h-4 w-4 text-gold" /> {BRAND_PHONE}
          </a>
          <Link href="/contact">
            <button className="flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-gold transition-all hover:brightness-110">
              Contact Us <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        <button className="text-navy lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          {WEBSITE_NAV.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="block border-b border-slate-50 py-3 text-sm font-medium text-slate-700">
              {item.label}
            </Link>
          ))}
          {WEBSITE_NAV_MORE.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b border-slate-50 py-3 text-sm font-medium text-slate-600">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}>
            <button className="mt-4 w-full rounded-full bg-gold-gradient py-3 text-sm font-semibold text-white">Contact Us</button>
          </Link>
        </div>
      )}
    </header>
  );
}
