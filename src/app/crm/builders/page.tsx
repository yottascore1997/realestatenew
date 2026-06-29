"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus, Search, Pencil, Trash2, HardHat, X, Loader2, Phone, Mail, MapPin,
  FolderKanban, Building2, Users, ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { BuilderAnalytics } from "@/components/crm/builder-analytics";
import { PROJECT_STATUS, statusLabel, statusColor } from "@/lib/builders/constants";
import { formatINR, cn } from "@/lib/utils";

interface ProjectRow {
  id: string;
  name: string;
  location: string;
  city: string;
  status: string;
  totalUnits: number | null;
  priceFrom: number | null;
  priceTo: number | null;
  propertiesCount: number;
  leadsCount: number;
}

interface Builder {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  gstNumber?: string | null;
  projectCount: number;
  activeProjects: number;
  projects: ProjectRow[];
  statusSummary: Record<string, number>;
}

const emptyForm = { name: "", company: "", email: "", phone: "", address: "", city: "", gstNumber: "" };

export default function BuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/builders")
      .then((r) => r.json())
      .then((data) => {
        const list: Builder[] = data.builders ?? data;
        setBuilders(list);
        if (list.length && !selectedId) setSelectedId(list[0].id);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return builders;
    return builders.filter((b) =>
      [b.name, b.company, b.city, b.phone, b.email].some((v) => v?.toLowerCase().includes(q))
    );
  }, [builders, search]);

  const selected = builders.find((b) => b.id === selectedId) ?? filtered[0] ?? null;

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (b: Builder) => {
    setEditId(b.id);
    setForm({
      name: b.name, company: b.company ?? "", email: b.email ?? "", phone: b.phone ?? "",
      address: b.address ?? "", city: b.city ?? "", gstNumber: b.gstNumber ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const url = editId ? `/api/builders/${editId}` : "/api/builders";
    const res = await fetch(url, { method: editId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) { setShowForm(false); load(); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete builder "${name}"?`)) return;
    const res = await fetch(`/api/builders/${id}`, { method: "DELETE" });
    if (res.ok) { setSelectedId(null); load(); }
    else { const d = await res.json(); alert(d.error || "Failed to delete"); }
  };

  if (loading && builders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-4 text-sm text-slate-500">Loading builders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="gradient-violet relative overflow-hidden rounded-3xl px-6 py-5 text-white sm:px-8">
        <div className="bg-grid-faint absolute inset-0 opacity-30" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">CRM · Partners</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Builders</h2>
            <p className="mt-1 text-sm text-white/75">Builder-wise project performance — charts & counts upar, detail neeche</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg hover:scale-[1.02] transition-transform">
            <Plus className="h-4 w-4" /> Add Builder
          </button>
        </div>
      </div>

      <BuilderAnalytics builders={builders} onSelectBuilder={setSelectedId} />

      <div className="relative min-w-[200px]">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search builder name, city, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 crm-card"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="crm-card rounded-2xl py-16 text-center">
          <HardHat className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-600">No builders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Builder list */}
          <div className="space-y-2 lg:col-span-4">
            {filtered.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={cn(
                  "crm-card w-full rounded-2xl border p-4 text-left transition-all",
                  selectedId === b.id ? "border-violet-300 bg-violet-50/50 ring-2 ring-violet-200" : "border-slate-100 bg-white hover:border-violet-100"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                    <HardHat className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-bold text-slate-900">{b.name}</h3>
                      <ChevronRight className={cn("h-4 w-4 shrink-0 text-slate-400", selectedId === b.id && "text-violet-600")} />
                    </div>
                    {b.company && <p className="truncate text-xs text-slate-500">{b.company}</p>}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                        {b.projectCount} projects
                      </span>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {b.activeProjects} active
                      </span>
                    </div>
                    {/* Mini status bar */}
                    {b.projectCount > 0 && (
                      <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
                        {PROJECT_STATUS.map((s) => {
                          const n = b.statusSummary[s.value] ?? 0;
                          if (!n) return null;
                          return (
                            <div key={s.value} className={cn(s.bar, "h-full")} style={{ width: `${(n / b.projectCount) * 100}%` }} title={`${s.label}: ${n}`} />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8">
            {selected ? (
              <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selected.name}</h3>
                    {selected.company && <p className="text-sm text-slate-500">{selected.company}</p>}
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                      {selected.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-violet-500" />{selected.phone}</span>}
                      {selected.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-violet-500" />{selected.email}</span>}
                      {selected.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-violet-500" />{selected.city}</span>}
                      {selected.gstNumber && <span className="text-xs text-slate-400">GST: {selected.gstNumber}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(selected)} className="flex items-center gap-1.5 rounded-xl border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50">
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button onClick={() => handleDelete(selected.id, selected.name)} className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status breakdown for this builder */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PROJECT_STATUS.map((s) => (
                    <div key={s.value} className={cn("rounded-xl px-3 py-3 text-center", s.color.split(" ")[0])}>
                      <p className="text-2xl font-extrabold text-slate-900">{selected.statusSummary[s.value] ?? 0}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Projects table */}
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <FolderKanban className="h-4 w-4 text-violet-600" />
                      Projects under {selected.name} ({selected.projectCount})
                    </h4>
                    <Link href="/crm/projects" className="text-xs font-semibold text-violet-600 hover:underline">Manage Projects →</Link>
                  </div>

                  {selected.projects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                      No projects linked yet — assign a builder when creating a project
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <th className="px-4 py-3">Project</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Units</th>
                            <th className="px-4 py-3">Price From</th>
                            <th className="px-4 py-3">Props / Leads</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selected.projects.map((p) => (
                            <tr key={p.id} className="hover:bg-violet-50/30">
                              <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                              <td className="px-4 py-3 text-slate-500">{p.location}, {p.city}</td>
                              <td className="px-4 py-3">
                                <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase", statusColor(p.status))}>
                                  {statusLabel(p.status)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-600">{p.totalUnits ?? "—"}</td>
                              <td className="px-4 py-3 font-medium text-violet-700">
                                {p.priceFrom ? formatINR(p.priceFrom) : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-3 text-xs text-slate-500">
                                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{p.propertiesCount}</span>
                                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.leadsCount}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="crm-card flex h-64 items-center justify-center rounded-2xl text-slate-400">
                Select a builder to view projects
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editId ? "Edit Builder" : "Add Builder"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <FormSection title="Builder Details">
              <FormGrid cols={2}>
                <Input label="Builder Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Input label="GST Number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
                <div className="md:col-span-2">
                  <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </FormGrid>
            </FormSection>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
