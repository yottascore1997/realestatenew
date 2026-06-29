import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const VARIANTS = {
  violet: { iconBg: "bg-violet-100", iconColor: "text-violet-600", accent: "from-violet-500/10 to-transparent" },
  indigo: { iconBg: "bg-indigo-100", iconColor: "text-indigo-600", accent: "from-indigo-500/10 to-transparent" },
  emerald: { iconBg: "bg-emerald-100", iconColor: "text-emerald-600", accent: "from-emerald-500/10 to-transparent" },
  amber: { iconBg: "bg-amber-100", iconColor: "text-amber-600", accent: "from-amber-500/10 to-transparent" },
  rose: { iconBg: "bg-rose-100", iconColor: "text-rose-600", accent: "from-rose-500/10 to-transparent" },
};

interface StatCardProps {
  title: string;
  value: number | string;
  trend: number;
  icon: LucideIcon;
  variant?: keyof typeof VARIANTS;
  isCurrency?: boolean;
  delay?: number;
}

export function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  variant = "violet",
  isCurrency,
  delay = 0,
}: StatCardProps) {
  const v = VARIANTS[variant];
  const displayValue =
    typeof value === "number"
      ? isCurrency ? formatCurrency(value) : formatNumber(value)
      : value;
  const up = trend >= 0;

  return (
    <div
      className="crm-card crm-card-hover crm-rise group relative overflow-hidden rounded-2xl border border-slate-100/80 bg-white p-5"
      style={{ animationDelay: `${delay * 60}ms` }}
    >
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", v.accent)} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900">{displayValue}</p>
          <div className={cn("mt-2 flex items-center gap-1 text-xs font-medium", up ? "text-emerald-600" : "text-rose-500")}>
            {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span>{up ? "+" : ""}{trend}% vs last month</span>
          </div>
        </div>
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110", v.iconBg)}>
          <Icon className={cn("h-5 w-5", v.iconColor)} />
        </div>
      </div>
    </div>
  );
}
