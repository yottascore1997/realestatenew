"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Send, FileText, BarChart3, Settings, Plus, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_NAV } from "@/lib/whatsapp/constants";

const ICONS = { LayoutDashboard, Users, Send, FileText, BarChart3, Settings };

export default function WhatsAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOverview = pathname === "/crm/whatsapp";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-md shadow-green-200">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">WhatsApp Marketing</h2>
            <p className="text-xs text-slate-500">Bulk campaigns, templates & delivery reports — CRM leads se connected</p>
          </div>
        </div>
        {isOverview && (
          <Link
            href="/crm/whatsapp/campaigns/new"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-200 hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Create Campaign
          </Link>
        )}
      </div>

      <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-1.5 crm-card">
        {WHATSAPP_NAV.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          const active = pathname === item.href || (item.href !== "/crm/whatsapp" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-md shadow-green-200"
                  : "text-slate-600 hover:bg-green-50 hover:text-green-700",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
