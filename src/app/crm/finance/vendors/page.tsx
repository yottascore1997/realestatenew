"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/finance/constants";

export default function VendorsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { fetch("/api/finance/reports").then((r) => r.json()).then((d) => setItems(d.vendors ?? [])); }, []);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((v) => {
        const expenses = v.expenses as { totalAmount: unknown }[];
        const total = expenses?.reduce((s, e) => s + Number(e.totalAmount), 0) ?? 0;
        return (
          <Card key={v.id as string} className="p-4">
            <p className="font-semibold">{v.name as string}</p>
            <p className="text-sm text-slate-500">{v.category as string}</p>
            <p className="mt-2 text-lg font-bold text-[#4F6BF5]">{formatINR(total)}</p>
            <p className="text-xs text-slate-400">{expenses?.length ?? 0} bills</p>
          </Card>
        );
      })}
    </div>
  );
}
