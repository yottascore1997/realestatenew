"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { pct } from "@/lib/whatsapp/constants";

interface ReportData {
  periodDays: number;
  totals: {
    recipients: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    deliveryRate: string;
    readRate: string;
    failureRate: string;
  };
  daily: { date: string; sent: number; delivered: number; read: number; failed: number }[];
  campaigns: { id: string; name: string; sentCount: number; deliveredCount: number; readCount: number; failedCount: number; status: string }[];
}

export default function WhatsAppReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch("/api/whatsapp/reports?days=30").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <div className="py-16 text-center text-slate-500">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Reports</h3>
        <p className="text-sm text-slate-500">Last {data.periodDays} days campaign analytics</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[
          { label: "Recipients", value: data.totals.recipients },
          { label: "Sent", value: data.totals.sent },
          { label: "Delivered", value: data.totals.delivered, sub: data.totals.deliveryRate },
          { label: "Read", value: data.totals.read, sub: data.totals.readRate },
          { label: "Failed", value: data.totals.failed, sub: data.totals.failureRate },
        ].map((s) => (
          <div key={s.label} className="crm-card rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{s.value.toLocaleString("en-IN")}</p>
            {s.sub && <p className="text-xs text-slate-500">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
        <h4 className="mb-4 font-semibold text-slate-900">Daily Messages</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="delivered" fill="#22c55e" name="Delivered" stackId="a" />
              <Bar dataKey="read" fill="#15803d" name="Read" stackId="a" />
              <Bar dataKey="failed" fill="#ef4444" name="Failed" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="crm-card overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3">Campaign</th>
              <th className="px-5 py-3">Sent</th>
              <th className="px-5 py-3">Delivered</th>
              <th className="px-5 py-3">Read</th>
              <th className="px-5 py-3">Failed</th>
            </tr>
          </thead>
          <tbody>
            {data.campaigns.map((c) => (
              <tr key={c.id} className="border-t border-slate-50">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3">{c.sentCount}</td>
                <td className="px-5 py-3">{pct(c.deliveredCount, c.sentCount)}</td>
                <td className="px-5 py-3">{pct(c.readCount, c.sentCount)}</td>
                <td className="px-5 py-3">{c.failedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
