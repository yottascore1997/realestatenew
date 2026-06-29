"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/finance/constants";

export default function RefundsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { fetch("/api/finance/reports").then((r) => r.json()).then((d) => setItems(d.refunds ?? [])); }, []);
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead><tr className="border-b bg-slate-50 text-xs uppercase text-slate-500"><th className="px-4 py-3 text-left">Refund ID</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Reason</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
        <tbody>{items.map((r) => { const c = r.customer as { name: string }; return <tr key={r.id as string} className="border-b"><td className="px-4 py-3">{r.refundNumber as string}</td><td className="px-4 py-3">{c?.name}</td><td className="px-4 py-3 text-slate-500">{r.reason as string}</td><td className="px-4 py-3">{formatINR(Number(r.amount))}</td><td className="px-4 py-3">{r.status as string}</td></tr>; })}</tbody>
      </table>
    </Card>
  );
}
