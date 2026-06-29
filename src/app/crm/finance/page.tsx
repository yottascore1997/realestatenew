"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, Clock, Calendar, ArrowDownLeft, ArrowUpRight, AlertCircle,
} from "lucide-react";
import { formatINR } from "@/lib/finance/constants";
import { cn } from "@/lib/utils";

interface DashboardData {
  totalSales: number;
  totalRevenueReceived: number;
  pendingCollection: number;
  todaysCollection: number;
  monthlyCollection: number;
  totalExpenses: number;
  netProfit: number;
  netLoss: number;
  monthlyRevenue: { month: string; revenue: number; expenses: number }[];
  cashFlow: { received: number; spent: number; balance: number };
  recentPayments: { id: string; amount: number; mode: string; date: string; customer: string; project: string; bookingNumber: string }[];
  recentExpenses: { id: string; amount: number; category: string; description: string; date: string }[];
}

function MetricCard({
  label, value, sub, icon: Icon, variant,
}: {
  label: string; value: string; sub?: string;
  icon: typeof Wallet; variant: "green" | "amber" | "violet" | "slate";
}) {
  const v = {
    green: { grad: "from-emerald-500/10", icon: "text-emerald-600", bg: "bg-emerald-100" },
    amber: { grad: "from-amber-500/10", icon: "text-amber-600", bg: "bg-amber-100" },
    violet: { grad: "from-violet-500/10", icon: "text-violet-600", bg: "bg-violet-100" },
    slate: { grad: "from-slate-500/10", icon: "text-slate-600", bg: "bg-slate-100" },
  }[variant];

  return (
    <div className="crm-card crm-card-hover relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5">
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-70", v.grad)} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", v.bg)}>
          <Icon className={cn("h-5 w-5", v.icon)} />
        </div>
      </div>
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function FinanceDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/finance/dashboard")
      .then((r) => { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-3 text-sm text-slate-500">Loading finance data...</p>
      </div>
    );
  }
  if (error || !data) {
    return <div className="rounded-2xl border border-red-100 bg-red-50 py-12 text-center text-sm text-red-600">Could not load finance data. {error}</div>;
  }

  const isProfit = data.cashFlow.balance >= 0;
  const chartHasData = data.monthlyRevenue.some((m) => m.revenue > 0 || m.expenses > 0);
  const receivedPct = data.cashFlow.received + data.cashFlow.spent > 0
    ? Math.round((data.cashFlow.received / (data.cashFlow.received + data.cashFlow.spent)) * 100)
    : 50;

  return (
    <div className="space-y-5">
      {/* Key numbers — 4 cards only */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Collected"
          value={formatINR(data.totalRevenueReceived)}
          sub={`${data.totalSales} bookings · Today ${formatINR(data.todaysCollection)}`}
          icon={TrendingUp}
          variant="green"
        />
        <MetricCard
          label="Pending Collection"
          value={formatINR(data.pendingCollection)}
          sub={data.pendingCollection > 0 ? "Needs follow-up" : "All clear"}
          icon={Clock}
          variant="amber"
        />
        <MetricCard
          label="This Month"
          value={formatINR(data.monthlyCollection)}
          sub="Payments received"
          icon={Calendar}
          variant="violet"
        />
        <MetricCard
          label={isProfit ? "Net Balance" : "Net Loss"}
          value={formatINR(Math.abs(data.cashFlow.balance))}
          sub={`Expenses ${formatINR(data.totalExpenses)}`}
          icon={isProfit ? Wallet : AlertCircle}
          variant={isProfit ? "green" : "slate"}
        />
      </div>

      {/* Cash flow strip — simple visual */}
      <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-slate-800">Money Flow Summary</p>
        <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all" style={{ width: `${receivedPct}%` }} />
          <div className="bg-gradient-to-r from-rose-400 to-rose-500 flex-1" />
        </div>
        <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-4">
          <div className="rounded-xl bg-emerald-50 px-3 py-3">
            <div className="mb-1 flex items-center justify-center gap-1 text-xs font-medium text-emerald-700">
              <ArrowDownLeft className="h-3.5 w-3.5" /> Received
            </div>
            <p className="text-lg font-bold text-emerald-800">{formatINR(data.cashFlow.received)}</p>
          </div>
          <div className="rounded-xl bg-rose-50 px-3 py-3">
            <div className="mb-1 flex items-center justify-center gap-1 text-xs font-medium text-rose-700">
              <ArrowUpRight className="h-3.5 w-3.5" /> Spent
            </div>
            <p className="text-lg font-bold text-rose-800">{formatINR(data.cashFlow.spent)}</p>
          </div>
          <div className={cn("rounded-xl px-3 py-3", isProfit ? "bg-violet-50" : "bg-slate-100")}>
            <div className={cn("mb-1 flex items-center justify-center gap-1 text-xs font-medium", isProfit ? "text-violet-700" : "text-slate-600")}>
              {isProfit ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />} Balance
            </div>
            <p className={cn("text-lg font-bold", isProfit ? "text-violet-800" : "text-slate-800")}>
              {formatINR(data.cashFlow.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Single chart */}
      <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
        <p className="mb-1 text-sm font-semibold text-slate-800">Monthly Revenue vs Expenses</p>
        <p className="mb-4 text-xs text-slate-400">This year — live from your records</p>
        {chartHasData ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.monthlyRevenue} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${v}`} />
              <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#7c3aed" name="Collected" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" fill="#f87171" name="Expenses" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">
            No transactions yet — record a payment or expense to see trends
          </div>
        )}
      </div>

      {/* Recent activity — payments + expenses side by side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Recent Payments</p>
              <p className="text-xs text-slate-400">Money coming in</p>
            </div>
            <Link href="/crm/finance/payments" className="text-xs font-semibold text-violet-600 hover:underline">View all</Link>
          </div>
          {data.recentPayments.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No payments recorded yet</p>
          ) : (
            <ul className="space-y-2">
              {data.recentPayments.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{p.customer}</p>
                    <p className="truncate text-xs text-slate-500">{p.project} · {p.mode} · {fmtDate(p.date)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-emerald-700">+{formatINR(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Recent Expenses</p>
              <p className="text-xs text-slate-400">Money going out</p>
            </div>
            <Link href="/crm/finance/expenses" className="text-xs font-semibold text-violet-600 hover:underline">View all</Link>
          </div>
          {data.recentExpenses.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No expenses recorded yet</p>
          ) : (
            <ul className="space-y-2">
              {data.recentExpenses.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{e.category}</p>
                    <p className="truncate text-xs text-slate-500">{e.description} · {fmtDate(e.date)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-rose-600">−{formatINR(e.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {data.pendingCollection > 0 && (
        <Link href="/crm/finance/outstanding">
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 transition-colors hover:bg-amber-100/80">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">{formatINR(data.pendingCollection)} pending collection</p>
              <p className="text-xs text-amber-700">Tap to view outstanding bookings and follow up</p>
            </div>
            <span className="text-sm font-semibold text-amber-800">View →</span>
          </div>
        </Link>
      )}
    </div>
  );
}
