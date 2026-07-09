"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/website/navbar";
import { WebsiteHeader } from "@/components/website/website-header";
import { Footer } from "@/components/website/footer";
import { SiteVisitBanner } from "@/components/website/site-visit-banner";
import { ContactProvider } from "@/lib/website/contact-context";
import { FloatingContactCta } from "@/components/website/floating-contact-cta";
import type { HeroSearchData } from "@/lib/website/get-hero-data";

type WebsiteShellProps = {
  children: ReactNode;
  stats: HeroSearchData["stats"];
};

export function WebsiteShell({ children, stats }: WebsiteShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isLaunchLanding = /^\/launches\/[^/]+$/.test(pathname ?? "");

  return (
    <ContactProvider>
      {isHome || isLaunchLanding ? (
        <WebsiteHeader stats={stats} className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/95 backdrop-blur-md" />
      ) : (
        <Navbar stats={stats} />
      )}
      <main className="flex-1">{children}</main>
      <SiteVisitBanner />
      <Footer />
      <FloatingContactCta />
    </ContactProvider>
  );
}
