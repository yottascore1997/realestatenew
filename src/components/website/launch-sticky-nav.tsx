"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Highlights", href: "#highlights" },
  { label: "Details", href: "#details" },
  { label: "Amenities", href: "#amenities" },
  { label: "Location", href: "#location" },
  { label: "Gallery", href: "#gallery" },
  { label: "Floor Plans", href: "#floor-plans" },
  { label: "FAQ", href: "#faq" },
] as const;

export function LaunchStickyNav() {
  const [active, setActive] = useState("#overview");

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(`#${id}`);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      aria-label="Launch page sections"
      className="sticky top-[72px] z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sm:top-[76px]"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 scrollbar-hide sm:px-6 lg:px-8">
        {LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={cn(
              "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-[13px]",
              active === href
                ? "bg-[#0f1729] text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#0f1729]"
            )}
          >
            {label}
          </a>
        ))}
        <a
          href="#register"
          className="ml-auto shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 sm:text-[13px]"
        >
          Enquire Now
        </a>
      </div>
    </nav>
  );
}
