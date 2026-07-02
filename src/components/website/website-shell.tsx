"use client";

import { type ReactNode } from "react";
import { Navbar } from "@/components/website/navbar";
import { Footer } from "@/components/website/footer";
import { SiteVisitBanner } from "@/components/website/site-visit-banner";
import { ContactProvider } from "@/lib/website/contact-context";
import type { HeroSearchData } from "@/lib/website/get-hero-data";

type WebsiteShellProps = {
  children: ReactNode;
  stats: HeroSearchData["stats"];
};

export function WebsiteShell({ children, stats }: WebsiteShellProps) {
  return (
    <ContactProvider>
      <Navbar stats={stats} />
      <main className="flex-1">{children}</main>
      <SiteVisitBanner />
      <Footer />
    </ContactProvider>
  );
}
