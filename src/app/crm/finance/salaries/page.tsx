"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/finance/constants";

export default function SalariesPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { fetch("/api/finance/reports").then((r) => r.json()).then((d) => setItems(d.salaries ?? [])); }, []);
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead><tr className="border-b bg-slate-50 text-xs uppercase text-slate-500"><th className="px-4 py-3 text-left">Employee</th><th className="px-4 py-3 text-left">Month</th><th className="px-4 py-3 text-left">Salary</th><th className="px-4 py-3 text-left">Commission</th><th className="px-4 py-3 text-left">Bonus</th><th className="px-4 py-3 text-left">Final</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
        <tbody>{items.map((s) => { const emp = s.employee as { name: string }; return <tr key={s.id as string} className="border-b"><td className="px-4 py-3">{emp?.name}</td><td className="px-4 py-3">{s.month as string}</td><td className="px-4 py-3">{formatINR(Number(s.baseSalary))}</td><td className="px-4 py-3">{formatINR(Number(s.commission ?? 0))}</td><td className="px-4 py-3">{formatINR(Number(s.bonus ?? 0))}</td><td className="px-4 py-3 font-medium">{formatINR(Number(s.finalSalary))}</td><td className="px-4 py-3">{s.status as string}</td></tr>; })}</tbody>
      </table>
    </Card>
  );
}
