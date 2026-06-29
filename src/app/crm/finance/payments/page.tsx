"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { formatINR, PAYMENT_MODES } from "@/lib/finance/constants";
import { format } from "date-fns";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ bookingId: "", customerId: "", amount: "", mode: "UPI", transactionId: "", referenceNo: "", notes: "" });

  const load = () => {
    fetch("/api/finance/payments").then((r) => r.json()).then(setPayments);
    fetch("/api/finance/bookings").then((r) => r.json()).then(setBookings);
  };

  useEffect(() => { load(); }, []);

  const handleBookingSelect = (bookingId: string) => {
    const b = bookings.find((x) => x.id === bookingId) as Record<string, unknown> | undefined;
    if (b) setForm((p) => ({ ...p, bookingId, customerId: b.customerId as string }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/finance/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    setLoading(false);
    if (res.ok) { setShowForm(false); load(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> Record Payment</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <FormSection title="Record Payment" description="Add a new payment collection">
            <FormGrid>
              <Select label="Booking *" value={form.bookingId} onChange={(e) => handleBookingSelect(e.target.value)} required
                options={bookings.map((b) => ({ value: b.id as string, label: `${b.bookingNumber} - ${(b.customer as {name:string})?.name}` }))}
                placeholder="Select booking" />
              <Input label="Amount (₹) *" type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />
              <Select label="Payment Mode *" value={form.mode} onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}
                options={PAYMENT_MODES} />
              <Input label="Transaction ID" value={form.transactionId} onChange={(e) => setForm((p) => ({ ...p, transactionId: e.target.value }))} />
              <Input label="Reference No" value={form.referenceNo} onChange={(e) => setForm((p) => ({ ...p, referenceNo: e.target.value }))} />
              <Input label="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            </FormGrid>
            <div className="mt-4 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Payment"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </FormSection>
        </form>
      )}

      <Card className="overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <th className="px-4 py-3">Receipt No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Received By</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const customer = p.customer as { name: string } | null;
              const receiver = p.receivedBy as { name: string } | null;
              return (
                <tr key={p.id as string} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-[#4F6BF5]">{p.receiptNo as string}</td>
                  <td className="px-4 py-3 text-sm">{customer?.name}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatINR(Number(p.amount))}</td>
                  <td className="px-4 py-3 text-sm">{format(new Date(p.paymentDate as string), "dd MMM yyyy")}</td>
                  <td className="px-4 py-3 text-sm">{(p.mode as string).replace("_", " ")}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{p.transactionId as string ?? "—"}</td>
                  <td className="px-4 py-3 text-sm">{receiver?.name ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {payments.length === 0 && <div className="py-12 text-center text-slate-500">No payments recorded</div>}
      </Card>
    </div>
  );
}
