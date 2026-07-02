"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, Contact, CalendarCheck, Calendar,
  UsersRound, Settings, Home, IndianRupee, FolderKanban,
  UserCog, HardHat, Layers, LogOut, X, Rocket, Quote, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CRM_NAV, CRM_SETTINGS_NAV } from "@/lib/constants";
import { BRAND_NAME } from "@/lib/website/constants";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Building2, Users, Contact, CalendarCheck, Calendar,
  UsersRound, Settings, IndianRupee, FolderKanban, UserCog, HardHat, Rocket, Quote,
};

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/crm" ? pathname === "/crm" : pathname.startsWith(href));

  const NavLink = ({ href, label, icon }: { href: string; label: string; icon: string }) => {
    const Icon = iconMap[icon];
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={onClose}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          active
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", active && "drop-shadow-sm")} />
        <span className="flex-1">{label}</span>
        {active && <span className="h-1.5 w-1.5 rounded-full bg-white/80" />}
      </Link>
    );
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#0c0a1d] text-white transition-transform duration-300 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="relative overflow-hidden border-b border-white/10 px-5 py-5">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-600/20 blur-2xl" />
          <div className="relative flex items-center justify-between gap-3">
            <Link href="/crm" className="flex min-w-0 flex-1 items-center gap-3" onClick={onClose}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/40">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold leading-tight">{BRAND_NAME}</p>
                <p className="text-[10px] font-medium text-violet-300/70">Real Estate CRM</p>
              </div>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Main Menu</p>
          <ul className="space-y-1">
            {CRM_NAV.map((item) => (
              <li key={item.href}><NavLink href={item.href} label={item.label} icon={item.icon} /></li>
            ))}
          </ul>

          <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Settings</p>
          <ul className="space-y-1">
            {CRM_SETTINGS_NAV.map((item) => (
              <li key={item.href}><NavLink href={item.href} label={item.label} icon={item.icon} /></li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-violet-300"
          >
            <Home className="h-3.5 w-3.5" /> Back to Website
          </Link>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/crm/login";
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-rose-300"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
