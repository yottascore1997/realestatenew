"use client";

import { Users, Flame, Phone, CheckCircle2, TrendingUp } from "lucide-react";
import type { LeadDashboardStats } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

export type LeadStatFilter = "all" | "booked" | "hot" | "follow_up_due" | "today" | "booked_month";

function formatRevenue(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

type CardDef = {
  filter: LeadStatFilter;
  label: string;
  value: string | number;
  icon: typeof Users;
  iconTint: string;
  bg: string;
  border: string;
  activeBorder: string;
  valueClass: string;
  note?: string;
  noteFilter?: LeadStatFilter;
  noteClass?: string;
};

export function LeadDashboardStats({
  stats,
  activeFilter,
  onFilterChange,
}: {
  stats: LeadDashboardStats;
  activeFilter: LeadStatFilter | null;
  onFilterChange: (filter: LeadStatFilter | null) => void;
}) {
  const followUpsDue = stats.todaysFollowUps + stats.overdueFollowUps;

  const cards: CardDef[] = [
    {
      filter: "booked",
      label: "Revenue Generated",
      value: formatRevenue(stats.revenueGenerated),
      icon: TrendingUp,
      iconTint: "from-indigo-500 to-violet-600",
      bg: "bg-violet-50/70",
      border: "border-violet-100",
      activeBorder: "ring-2 ring-violet-400 border-violet-300",
      valueClass: "text-violet-700",
    },
    {
      filter: "all",
      label: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      iconTint: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50/70",
      border: "border-blue-100",
      activeBorder: "ring-2 ring-blue-400 border-blue-300",
      valueClass: "text-slate-900",
      note: stats.todaysLeads > 0 ? `+${stats.todaysLeads} today` : undefined,
      noteFilter: "today",
      noteClass: "bg-blue-100 text-blue-600",
    },
    {
      filter: "hot",
      label: "Hot Leads",
      value: stats.hotLeads,
      icon: Flame,
      iconTint: "from-orange-500 to-rose-500",
      bg: "bg-orange-50/70",
      border: "border-orange-100",
      activeBorder: "ring-2 ring-orange-400 border-orange-300",
      valueClass: "text-slate-900",
    },
    {
      filter: "follow_up_due",
      label: "Follow-ups Due",
      value: followUpsDue,
      icon: Phone,
      iconTint: "from-sky-500 to-cyan-500",
      bg: "bg-sky-50/70",
      border: "border-sky-100",
      activeBorder: "ring-2 ring-sky-400 border-sky-300",
      valueClass: "text-slate-900",
      note: stats.overdueFollowUps > 0 ? `${stats.overdueFollowUps} overdue` : undefined,
      noteClass: "bg-rose-100 text-rose-600",
    },
    {
      filter: "booked",
      label: "Booked",
      value: stats.bookedTotal,
      icon: CheckCircle2,
      iconTint: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
      activeBorder: "ring-2 ring-emerald-400 border-emerald-300",
      valueClass: "text-slate-900",
      note: stats.bookingsThisMonth > 0 ? `${stats.bookingsThisMonth} this month` : undefined,
      noteFilter: "booked_month",
      noteClass: "bg-emerald-100 text-emerald-600",
    },
  ];

  const handleClick = (filter: LeadStatFilter) => {
    if (filter === "all") {
      onFilterChange(null);
      return;
    }
    onFilterChange(activeFilter === filter ? null : filter);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ filter, label, value, icon: Icon, iconTint, bg, border, activeBorder, valueClass, note, noteFilter, noteClass }, i) => {
        const isActive =
          activeFilter !== null &&
          (activeFilter === filter || (noteFilter != null && activeFilter === noteFilter));
        return (
          <button
            key={label}
            type="button"
            onClick={() => handleClick(filter)}
            className={cn(
              "crm-rise flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all hover:scale-[1.02] hover:shadow-md",
              bg,
              border,
              isActive && activeBorder,
              "cursor-pointer"
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm", iconTint)}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={cn("text-lg font-extrabold leading-none tracking-tight tabular-nums", valueClass)}>{value}</p>
                {note && (
                  <span
                    role={noteFilter ? "button" : undefined}
                    onClick={noteFilter ? (e) => {
                      e.stopPropagation();
                      onFilterChange(activeFilter === noteFilter ? null : noteFilter!);
                    } : undefined}
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none",
                      noteClass ?? "bg-slate-100 text-slate-600",
                      noteFilter && "cursor-pointer hover:opacity-80"
                    )}
                  >
                    {note}
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-[11px] font-medium text-slate-500">{label}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export const STAT_FILTER_LABELS: Record<LeadStatFilter, string> = {
  all: "All Leads",
  hot: "Hot Leads",
  follow_up_due: "Follow-ups Due",
  booked: "Booked Leads",
  booked_month: "Booked This Month",
  today: "Leads Added Today",
};
