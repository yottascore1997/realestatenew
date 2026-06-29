"use client";

import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, ComposedChart,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";

interface SalesChartProps {
  data: { date: string; thisMonth: number; lastMonth: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  const isRevenue = data.some((d) => d.thisMonth >= 1000 || d.lastMonth >= 1000);
  const empty = data.length === 0 || data.every((d) => d.thisMonth === 0 && d.lastMonth === 0);

  const formatY = (v: number) => {
    if (isRevenue) return v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${v}`;
    return String(v);
  };

  const formatTip = (value: number) => (isRevenue ? formatINR(value) : `${value} leads`);

  return (
    <Card className="crm-card col-span-2 border-slate-100/80 !p-0 overflow-hidden" padding={false}>
      <div className="p-5 pb-0">
        <CardHeader className="mb-2">
          <div>
            <CardTitle className="text-lg">{isRevenue ? "Revenue Overview" : "Leads Overview"}</CardTitle>
            <p className="mt-0.5 text-xs text-slate-400">Last 8 weeks · real data</p>
          </div>
        </CardHeader>
        <div className="mb-3 flex items-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500" />
            Current period
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-5 border-t-2 border-dashed border-slate-300" />
            Previous period
          </span>
        </div>
      </div>
      {empty ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">
          No data yet — add leads or bookings to see trends
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={formatY} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              formatter={(value) => [formatTip(Number(value)), ""]}
            />
            <Area type="monotone" dataKey="thisMonth" fill="url(#salesGrad)" stroke="none" />
            <Line type="monotone" dataKey="thisMonth" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="lastMonth" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
