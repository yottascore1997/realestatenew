"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { formatINR, BOOKING_STATUS_LABELS } from "@/lib/finance/constants";
import { cn } from "@/lib/utils";

export default function OutstandingPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finance/reports")
      .then((r) => r.json())
      .then((d) => setItems(d.outstanding ?? []))
      .finally(() => setLoading(false));
  }, []);

  const totalPending = items.reduce((s, b) => s + Number(b.remainingBalance ?? 0), 0);

  if (loading) {
    return <div className="py-12 text-center text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="crm-card flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
          <Clock className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Total Outstanding</p>
          <p className="text-2xl font-extrabold text-amber-700">{formatINR(totalPending)}</p>
        </div>
        <p className="ml-auto hidden text-sm text-slate-500 sm:block">{items.length} bookings pending payment</p>
      </div>

      {items.length === 0 ? (
        <div className="crm-card rounded-2xl py-16 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-emerald-400" />
          <p className="mt-3 text-sm font-medium text-slate-600">No outstanding payments — all caught up!</p>
        </div>
      ) : (
        <div className="crm-card overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Pending</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => {
                  const customer = b.customer as { name: string };
                  const project = b.project as { name: string } | null;
                  const payments = b.payments as { amount: unknown }[];
                  const received = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
                  const status = b.status as string;
                  return (
                    <tr key={b.id as string} className="border-b last:border-0 hover:bg-violet-50/30">
                      <td className="px-4 py-3 font-semibold text-slate-900">{customer?.name}</td>
                      <td className="px-4 py-3 text-slate-500">{project?.name ?? "—"}</td>
                      <td className="px-4 py-3">{formatINR(Number(b.totalAmount))}</td>
                      <td className="px-4 py-3 font-medium text-emerald-600">{formatINR(received)}</td>
                      <td className="px-4 py-3 font-bold text-amber-600">{formatINR(Number(b.remainingBalance))}</td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          status === "FULLY_PAID" ? "bg-emerald-100 text-emerald-700" :
                          status === "PARTIAL_PAID" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {BOOKING_STATUS_LABELS[status] ?? status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
