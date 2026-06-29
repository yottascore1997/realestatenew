"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/finance/constants";

export default function GstPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { fetch("/api/finance/reports").then((r) => r.json()).then((d) => setItems(d.gst ?? [])); }, []);
  const collected = items.filter((i) => i.type === "COLLECTED").reduce((s, i) => s + Number(i.amount), 0);
  const paid = items.filter((i) => i.type === "PAID").reduce((s, i) => s + Number(i.amount), 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4"><p className="text-sm text-slate-500">GST Collected</p><p className="text-xl font-bold text-emerald-600">{formatINR(collected)}</p></Card>
        <Card className="p-4"><p className="text-sm text-slate-500">GST Paid</p><p className="text-xl font-bold text-red-600">{formatINR(paid)}</p></Card>
        <Card className="p-4"><p className="text-sm text-slate-500">GST Pending</p><p className="text-xl font-bold text-amber-600">{formatINR(collected - paid)}</p></Card>
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-xs uppercase text-slate-500"><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Description</th></tr></thead>
          <tbody>{items.map((i) => <tr key={i.id as string} className="border-b"><td className="px-4 py-3">{i.type as string}</td><td className="px-4 py-3">{formatINR(Number(i.amount))}</td><td className="px-4 py-3 text-slate-500">{i.description as string}</td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}
