"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/finance/constants";
import { format } from "date-fns";

export default function InstallmentsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { fetch("/api/finance/reports").then((r) => r.json()).then((d) => setItems(d.installments ?? [])); }, []);
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead><tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
          <th className="px-4 py-3">Booking</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Due Date</th><th className="px-4 py-3">Paid</th><th className="px-4 py-3">Status</th>
        </tr></thead>
        <tbody>
          {items.map((i) => {
            const booking = i.booking as { bookingNumber: string; customer: { name: string } };
            return (
              <tr key={i.id as string} className="border-b">
                <td className="px-4 py-3">{booking?.bookingNumber} — {booking?.customer?.name}</td>
                <td className="px-4 py-3">{i.label as string}</td>
                <td className="px-4 py-3">{formatINR(Number(i.amount))}</td>
                <td className="px-4 py-3">{format(new Date(i.dueDate as string), "dd MMM yyyy")}</td>
                <td className="px-4 py-3">{i.paidDate ? format(new Date(i.paidDate as string), "dd MMM yyyy") : "—"}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs">{i.status as string}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
