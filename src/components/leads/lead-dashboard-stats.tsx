"use client";

import { Users, Flame, Phone, CheckCircle2, TrendingUp } from "lucide-react";
import type { LeadDashboardStats } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

function formatRevenue(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export function LeadDashboardStats({ stats }: { stats: LeadDashboardStats }) {
  const followUpsDue = stats.todaysFollowUps + stats.overdueFollowUps;

  const cards = [
    {
      label: "Revenue Generated",
      value: formatRevenue(stats.revenueGenerated),
      icon: TrendingUp,
      iconTint: "from-indigo-500 to-violet-600",
      bg: "bg-violet-50/70",
      border: "border-violet-100",
      valueClass: "text-violet-700",
    },
    {
      label: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      iconTint: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50/70",
      border: "border-blue-100",
      valueClass: "text-slate-900",
      note: stats.todaysLeads > 0 ? `+${stats.todaysLeads} today` : undefined,
      noteClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Hot Leads",
      value: stats.hotLeads,
      icon: Flame,
      iconTint: "from-orange-500 to-rose-500",
      bg: "bg-orange-50/70",
      border: "border-orange-100",
      valueClass: "text-slate-900",
    },
    {
      label: "Follow-ups Due",
      value: followUpsDue,
      icon: Phone,
      iconTint: "from-sky-500 to-cyan-500",
      bg: "bg-sky-50/70",
      border: "border-sky-100",
      valueClass: "text-slate-900",
      note: stats.overdueFollowUps > 0 ? `${stats.overdueFollowUps} overdue` : undefined,
      noteClass: "bg-rose-100 text-rose-600",
    },
    {
      label: "Booked",
      value: stats.bookedTotal,
      icon: CheckCircle2,
      iconTint: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
      valueClass: "text-slate-900",
      note: stats.bookingsThisMonth > 0 ? `${stats.bookingsThisMonth} this month` : undefined,
      noteClass: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ label, value, icon: Icon, iconTint, bg, border, valueClass, note, noteClass }, i) => (
        <div
          key={label}
          className={cn("crm-rise flex items-center gap-3 rounded-xl border p-3", bg, border)}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm", iconTint)}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className={cn("text-lg font-extrabold leading-none tracking-tight tabular-nums", valueClass)}>{value}</p>
              {note && (
                <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none", noteClass ?? "bg-slate-100 text-slate-600")}>{note}</span>
              )}
            </div>
            <p className="mt-1 truncate text-[11px] font-medium text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
