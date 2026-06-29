"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface LeadSourcesChartProps {
  data: { name: string; value: number; color: string; count: number }[];
  total: number;
}

export function LeadSourcesChart({ data, total }: LeadSourcesChartProps) {
  return (
    <Card className="crm-card border-slate-100/80">
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Lead Sources</CardTitle>
          <p className="mt-0.5 text-xs text-slate-400">From your actual leads</p>
        </div>
      </CardHeader>
      {data.length === 0 ? (
        <div className="flex h-44 items-center justify-center text-sm text-slate-400">
          No leads yet
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="count" strokeWidth={0}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(_, __, props) => [`${props.payload.count} leads (${props.payload.value}%)`, props.payload.name]}
                  contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-extrabold text-slate-900">{formatNumber(total)}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Total Leads</p>
            </div>
          </div>
          <ul className="w-full flex-1 space-y-2.5">
            {data.map((item) => (
              <li key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50/80 px-3 py-2 text-sm">
                <span className="flex items-center gap-2.5 text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.count} <span className="font-normal text-slate-400">({item.value}%)</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
