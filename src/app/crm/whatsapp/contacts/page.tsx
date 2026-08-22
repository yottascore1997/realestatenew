"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: string;
  fullName: string;
  phone: string;
  city: string | null;
  status: string;
  source: string;
  temperature: string;
}

export default function WhatsAppContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<{ city: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    setLoading(true);
    fetch(`/api/whatsapp/contacts?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setContacts(d.contacts);
        setTotal(d.total);
        setCities(d.cities ?? []);
      })
      .finally(() => setLoading(false));
  }, [search, city]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Contacts</h3>
          <p className="text-sm text-slate-500">{total.toLocaleString("en-IN")} leads — CRM se auto-sync</p>
        </div>
        <Link
          href="/crm/whatsapp/campaigns/new"
          className="rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 py-2 text-sm font-semibold text-white"
        >
          Send to selected
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search name or phone..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c.city} value={c.city}>{c.city} ({c.count})</option>
          ))}
        </select>
      </div>

      <div className="crm-card overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {loading ? (
          <div className="py-16 text-center text-slate-500">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <Users className="mb-3 h-10 w-10 text-slate-300" />
            <p>No contacts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">City</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Source</th>
                  <th className="px-5 py-3 font-semibold">Temp</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-t border-slate-50 hover:bg-green-50/30">
                    <td className="px-5 py-3 font-medium text-slate-900">
                      <Link href={`/crm/leads/${c.id}`} className="hover:text-green-700 hover:underline">{c.fullName}</Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{c.phone}</td>
                    <td className="px-5 py-3 text-slate-500">{c.city ?? "—"}</td>
                    <td className="px-5 py-3"><Badge variant="default">{c.status.replace(/_/g, " ")}</Badge></td>
                    <td className="px-5 py-3 text-slate-500">{c.source.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3"><Badge variant={c.temperature === "HOT" ? "danger" : "default"}>{c.temperature}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
