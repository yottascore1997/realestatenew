import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { BRAND_PHONE, BRAND_EMAIL } from "@/lib/website/constants";
import { BrandLogo } from "@/components/website/brand-logo";
import { BrandWordmark } from "@/components/website/brand-wordmark";

const SOCIAL = ["Facebook", "Instagram", "LinkedIn", "YouTube"];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0a0814] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="mb-5">
              <BrandLogo href="/" height={52} />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              India&apos;s premium real estate platform — verified listings, trusted builders, zero brokerage.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIAL.map((label) => (
                <a key={label} href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-xs font-bold text-white/50 ring-1 ring-white/10 transition-all hover:bg-violet-500/20 hover:text-violet-300 hover:ring-violet-400/30">
                  {label.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="website-badge-text mb-4 text-violet-400/80">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              <li><Link href="/contact" className="transition-colors hover:text-violet-300">About Us</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-violet-300">Careers</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-violet-300">Blog</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-violet-300">Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="website-badge-text mb-4 text-violet-400/80">Properties</h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              <li><Link href="/properties" className="transition-colors hover:text-violet-300">Buy</Link></li>
              <li><Link href="/properties" className="transition-colors hover:text-violet-300">Rent</Link></li>
              <li><Link href="/projects" className="transition-colors hover:text-violet-300">New Projects</Link></li>
              <li><Link href="/properties" className="transition-colors hover:text-violet-300">Commercial</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="website-badge-text mb-4 text-violet-400/80">Services</h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              <li><Link href="/contact" className="transition-colors hover:text-violet-300">Home Loans</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-violet-300">Legal Support</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-violet-300">Interiors</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-violet-300">Property Management</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="website-badge-text mb-4 text-violet-400/80">Contact</h4>
            <ul className="space-y-3 text-sm text-white/55">
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-violet-400" />{BRAND_PHONE}</li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-violet-400" />{BRAND_EMAIL}</li>
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/8 pt-6 text-center text-xs text-white/30">
          © 2026 <BrandWordmark uppercase={false} size="inherit" className="inline text-xs tracking-[0.06em]" />. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
