"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { formatINR } from "@/lib/finance/constants";
import { format } from "date-fns";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Record<string, unknown>[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ categoryId: "", projectId: "", amount: "", gstAmount: "", description: "", categoryName: "" });

  const load = () => fetch("/api/finance/expenses").then((r) => r.json()).then(setExpenses);

  useEffect(() => {
    load();
    fetch("/api/finance/expense-categories").then((r) => r.json()).then(setCategories).catch(() => {});
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cat = categories.find((c) => c.id === form.categoryId);
    const res = await fetch("/api/finance/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount), gstAmount: Number(form.gstAmount || 0), categoryName: cat?.name }),
    });
    setLoading(false);
    if (res.ok) { setShowForm(false); load(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> Add Expense</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <FormSection title="New Expense" description="Expenses above ₹50,000 require approval">
            <FormGrid>
              <Select label="Category *" value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} required
                options={categories.map((c) => ({ value: c.id, label: c.name }))} placeholder="Select category" />
              <Select label="Project" value={form.projectId} onChange={(e) => setForm((p) => ({ ...p, projectId: e.target.value }))}
                options={projects.map((p) => ({ value: p.id, label: p.name }))} placeholder="Select project" />
              <Input label="Amount (₹) *" type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />
              <Input label="GST (₹)" type="number" value={form.gstAmount} onChange={(e) => setForm((p) => ({ ...p, gstAmount: e.target.value }))} />
            </FormGrid>
            <div className="mt-4">
              <Textarea label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Expense"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </FormSection>
        </form>
      )}

      <Card className="overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <th className="px-4 py-3">Expense ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">GST</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => {
              const cat = e.category as { name: string } | null;
              const proj = e.project as { name: string } | null;
              const status = e.status as string;
              return (
                <tr key={e.id as string} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{e.expenseNumber as string}</td>
                  <td className="px-4 py-3 text-sm">{cat?.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{proj?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm">{formatINR(Number(e.amount))}</td>
                  <td className="px-4 py-3 text-sm">{formatINR(Number(e.gstAmount ?? 0))}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatINR(Number(e.totalAmount))}</td>
                  <td className="px-4 py-3 text-sm">{format(new Date(e.expenseDate as string), "dd MMM yyyy")}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
