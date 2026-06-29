"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/finance/constants";
import { format } from "date-fns";

type ReportData = Record<string, unknown>;

export default function FinanceReportsPage({ type }: { type?: string }) {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch("/api/finance/reports").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="py-12 text-center text-slate-500">Loading...</div>;

  const commissions = data.commissions as Record<string, unknown>[];
  const installments = data.installments as Record<string, unknown>[];
  const outstanding = data.outstanding as Record<string, unknown>[];
  const refunds = data.refunds as Record<string, unknown>[];
  const projectWisePL = data.projectWisePL as { projectName: string; revenue: number; expense: number; profit: number }[];
  const companyLedger = data.companyLedger as Record<string, unknown>[];
  const gst = data.gst as Record<string, unknown>[];

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-lg font-semibold">Project-wise P&L</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectWisePL.map((p) => (
            <Card key={p.projectName} className="p-4">
              <p className="font-semibold text-slate-900">{p.projectName}</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Revenue</span><span className="text-emerald-600">{formatINR(p.revenue)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Expense</span><span className="text-red-600">{formatINR(p.expense)}</span></div>
                <div className="flex justify-between border-t pt-1 font-medium"><span>Profit</span><span className="text-[#4F6BF5]">{formatINR(p.profit)}</span></div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Commissions</h3>
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="px-4 py-3">Agent</th><th className="px-4 py-3">Booking</th><th className="px-4 py-3">%</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th>
            </tr></thead>
            <tbody>
              {commissions?.map((c) => {
                const agent = c.agent as { name: string };
                const booking = c.booking as { bookingNumber: string };
                return (
                  <tr key={c.id as string} className="border-b">
                    <td className="px-4 py-3">{agent?.name}</td>
                    <td className="px-4 py-3">{booking?.bookingNumber}</td>
                    <td className="px-4 py-3">{String(c.commissionPercent)}%</td>
                    <td className="px-4 py-3">{formatINR(Number(c.commissionAmount))}</td>
                    <td className="px-4 py-3">{c.status as string}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Company Ledger</h3>
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="px-4 py-3">Date</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Amount</th>
            </tr></thead>
            <tbody>
              {companyLedger?.map((e) => (
                <tr key={e.id as string} className="border-b">
                  <td className="px-4 py-3">{format(new Date(e.entryDate as string), "dd MMM yyyy")}</td>
                  <td className="px-4 py-3">{e.type as string}</td>
                  <td className="px-4 py-3">{e.category as string}</td>
                  <td className="px-4 py-3 text-slate-500">{e.description as string}</td>
                  <td className={`px-4 py-3 font-medium ${e.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>{formatINR(Number(e.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
