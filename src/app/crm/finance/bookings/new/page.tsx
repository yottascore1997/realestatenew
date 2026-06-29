"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { useRouter } from "next/navigation";

export default function NewBookingPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerId: "", projectId: "", agentId: "", salePrice: "", bookingAmount: "",
    agreementAmount: "", registrationAmount: "", discount: "", gstAmount: "", commissionPercent: "2",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/finance/customers").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/users/employees").then((r) => r.json()),
    ]).then(([cust, proj, emps]) => {
      setCustomers(cust);
      setProjects(proj);
      setAgents(Array.isArray(emps) ? emps : []);
    });
  }, []);

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/finance/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        salePrice: Number(form.salePrice),
        bookingAmount: Number(form.bookingAmount),
        agreementAmount: form.agreementAmount ? Number(form.agreementAmount) : null,
        registrationAmount: form.registrationAmount ? Number(form.registrationAmount) : null,
        discount: Number(form.discount || 0),
        gstAmount: Number(form.gstAmount || 0),
        commissionPercent: Number(form.commissionPercent),
        schedules: [
          { label: "Booking Amount", percentage: 20, amount: Number(form.bookingAmount), dueDate: new Date().toISOString() },
          { label: "Agreement", percentage: 40, amount: Number(form.salePrice) * 0.4, dueDate: new Date(Date.now() + 30 * 86400000).toISOString() },
          { label: "Registration", percentage: 20, amount: Number(form.salePrice) * 0.2, dueDate: new Date(Date.now() + 60 * 86400000).toISOString() },
          { label: "Possession", percentage: 20, amount: Number(form.salePrice) * 0.2, dueDate: new Date(Date.now() + 90 * 86400000).toISOString() },
        ],
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/crm/finance/bookings");
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <FormSection title="Booking Details" description="Create a new property booking">
        <FormGrid>
          <Select label="Customer *" value={form.customerId} onChange={(e) => update("customerId", e.target.value)} required
            options={customers.map((c) => ({ value: c.id, label: c.name }))} placeholder="Select customer" />
          <Select label="Project" value={form.projectId} onChange={(e) => update("projectId", e.target.value)}
            options={projects.map((p) => ({ value: p.id, label: p.name }))} placeholder="Select project" />
          <Select label="Sales Employee" value={form.agentId} onChange={(e) => update("agentId", e.target.value)}
            options={agents.map((a) => ({ value: a.id, label: a.name }))} placeholder="Select employee" />
          <Input label="Sale Price (₹) *" type="number" value={form.salePrice} onChange={(e) => update("salePrice", e.target.value)} required />
          <Input label="Booking Amount (₹) *" type="number" value={form.bookingAmount} onChange={(e) => update("bookingAmount", e.target.value)} required />
          <Input label="Agreement Amount (₹)" type="number" value={form.agreementAmount} onChange={(e) => update("agreementAmount", e.target.value)} />
          <Input label="Registration Amount (₹)" type="number" value={form.registrationAmount} onChange={(e) => update("registrationAmount", e.target.value)} />
          <Input label="Discount (₹)" type="number" value={form.discount} onChange={(e) => update("discount", e.target.value)} />
          <Input label="GST (₹)" type="number" value={form.gstAmount} onChange={(e) => update("gstAmount", e.target.value)} />
          <Input label="Commission %" type="number" value={form.commissionPercent} onChange={(e) => update("commissionPercent", e.target.value)} />
        </FormGrid>
      </FormSection>
      <div className="flex justify-end gap-3">
        <Link href="/crm/finance/bookings"><Button type="button" variant="outline">Cancel</Button></Link>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Booking"}</Button>
      </div>
    </form>
  );
}
