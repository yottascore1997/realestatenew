"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatINR, BOOKING_STATUS_LABELS } from "@/lib/finance/constants";
import { cn } from "@/lib/utils";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finance/bookings").then((r) => r.json()).then(setBookings).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-12 text-center text-slate-500">Loading bookings...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/crm/finance/bookings/new">
          <Button><Plus className="h-4 w-4" /> New Booking</Button>
        </Link>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Sale Price</th>
                <th className="px-4 py-3">Booking Amt</th>
                <th className="px-4 py-3">GST</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: Record<string, unknown>) => {
                const customer = b.customer as { name: string } | null;
                const project = b.project as { name: string } | null;
                const status = b.status as string;
                return (
                  <tr key={b.id as string} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-[#4F6BF5]">{b.bookingNumber as string}</td>
                    <td className="px-4 py-3 text-sm">{customer?.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{project?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-sm">{formatINR(Number(b.salePrice))}</td>
                    <td className="px-4 py-3 text-sm">{formatINR(Number(b.bookingAmount))}</td>
                    <td className="px-4 py-3 text-sm">{formatINR(Number(b.gstAmount ?? 0))}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatINR(Number(b.totalAmount))}</td>
                    <td className="px-4 py-3 text-sm text-amber-600">{formatINR(Number(b.remainingBalance))}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold",
                        status === "FULLY_PAID" ? "bg-emerald-100 text-emerald-700" :
                        status === "PARTIAL_PAID" ? "bg-amber-100 text-amber-700" :
                        status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      )}>{BOOKING_STATUS_LABELS[status] ?? status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {bookings.length === 0 && <div className="py-12 text-center text-slate-500">No bookings yet. Create your first booking.</div>}
      </Card>
    </div>
  );
}
