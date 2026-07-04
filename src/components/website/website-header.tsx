"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { WEBSITE_NAV, BRAND_PHONE } from "@/lib/website/constants";
import { BrandLogo } from "@/components/website/brand-logo";
import { ContactTrigger } from "@/components/website/contact-trigger";
import type { HeroSearchData } from "@/lib/website/get-hero-data";

function navBadge(label: string, stats: HeroSearchData["stats"]) {
  if (label === "New Projects" && stats.projectCount > 0) return stats.projectCount;
  if (label === "Buy" && stats.propertyCount > 0) return stats.propertyCount;
  return null;
}

type WebsiteHeaderProps = {
  stats?: HeroSearchData["stats"];
  className?: string;
};

export function WebsiteHeader({ stats, className }: WebsiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const displayStats = stats ?? { propertyCount: 0, projectCount: 0, launchCount: 0, cityCount: 0 };

  return (
    <header className={className ?? "sticky top-0 z-50 border-b border-slate-100/80 bg-white/95 backdrop-blur-md"}>
      <div className="relative mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:h-[76px] sm:px-6 lg:px-8">
        <BrandLogo href="/" height={56} variant="full" theme="dark" showTagline={false} />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 xl:flex">
          {WEBSITE_NAV.map((item) => {
            const badge = navBadge(item.label, displayStats);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group relative flex items-center gap-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:text-[#0f1729]"
              >
                {item.label}
                {badge !== null && (
                  <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                    {badge}
                  </span>
                )}
                {item.label === "Services" && <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-5 lg:flex">
          <a href={`tel:${BRAND_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-sm font-semibold text-[#0f1729]">
            <Phone className="h-4 w-4 text-orange-500" strokeWidth={2} />
            {BRAND_PHONE}
          </a>
          <ContactTrigger>
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block rounded-lg bg-[#0f1729] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a2744]"
            >
              Contact Us
            </motion.span>
          </ContactTrigger>
        </div>

        <button type="button" className="ml-auto lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X className="h-6 w-6 text-[#0f1729]" /> : <Menu className="h-6 w-6 text-[#0f1729]" />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden border-t border-slate-100 bg-white px-4 py-3 lg:hidden"
        >
          {WEBSITE_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-700"
            >
              {item.label}
            </Link>
          ))}
          <ContactTrigger
            onClick={() => setMenuOpen(false)}
            className="mt-2 w-full rounded-lg bg-[#0f1729] py-2.5 text-sm font-semibold text-white"
          >
            Contact Us
          </ContactTrigger>
        </motion.div>
      )}
    </header>
  );
}
