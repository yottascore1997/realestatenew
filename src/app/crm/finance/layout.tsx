"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Wallet, Receipt, Clock, Plus, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { FINANCE_NAV } from "@/lib/finance/constants";

const ICONS = { LayoutDashboard, FileText, Wallet, Receipt, Clock };

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOverview = pathname === "/crm/finance";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200">
              <IndianRupee className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Finance</h2>
              <p className="text-xs text-slate-500">Collections, expenses & outstanding — at a glance</p>
            </div>
          </div>
        </div>
        {isOverview && (
          <div className="flex flex-wrap gap-2">
            <Link href="/crm/finance/bookings/new">
              <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                <Plus className="h-4 w-4" /> New Booking
              </button>
            </Link>
            <Link href="/crm/finance/payments">
              <button className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 hover:brightness-110">
                <Plus className="h-4 w-4" /> Record Payment
              </button>
            </Link>
          </div>
        )}
      </div>

      <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-1.5 crm-card">
        {FINANCE_NAV.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
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
