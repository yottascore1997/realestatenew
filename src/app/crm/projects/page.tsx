"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Pencil, Trash2, FolderKanban, X, Loader2, MapPin,
  Building2, Users, HardHat,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { formatINR, cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description?: string;
  location: string;
  city: string;
  status: string;
  developer?: string | null;
  builderId?: string | null;
  builder?: { name: string } | null;
  totalUnits?: number | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  image?: string | null;
  featured?: boolean;
  _count?: { properties: number; leads: number };
}

interface Builder { id: string; name: string }

const STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planning" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
  { value: "READY_TO_MOVE", label: "Ready to Move" },
  { value: "COMPLETED", label: "Completed" },
];

const emptyForm = {
  name: "", description: "", location: "", city: "", developer: "",
  builderId: "", status: "UNDER_CONSTRUCTION", totalUnits: "",
  priceFrom: "", priceTo: "", image: "",
};

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop";

function statusStyle(status: string) {
  if (status === "READY_TO_MOVE") return "bg-emerald-100 text-emerald-700";
  if (status === "UNDER_CONSTRUCTION") return "bg-amber-100 text-amber-700";
  if (status === "COMPLETED") return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-600";
}

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status.replace(/_/g, " ");
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/builders").then((r) => r.json()).then((b) =>
        setBuilders(Array.isArray(b) ? b : (b.builders ?? []))
      ),
    ])
      .then(([p, b]) => {
        setProjects(Array.isArray(p) ? p : []);
        setBuilders(Array.isArray(b) ? b : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (!q) return true;
      return [p.name, p.city, p.location, p.developer, p.builder?.name].some((v) => v?.toLowerCase().includes(q));
    });
  }, [projects, search, statusFilter]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (p: Project) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      location: p.location,
      city: p.city,
      developer: p.developer ?? "",
      builderId: p.builderId ?? "",
      status: p.status,
      totalUnits: p.totalUnits ? String(p.totalUnits) : "",
      priceFrom: p.priceFrom ? String(p.priceFrom) : "",
      priceTo: p.priceTo ? String(p.priceTo) : "",
      image: p.image ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim() || !form.location.trim()) return;
    setSaving(true);
    const url = editId ? `/api/projects/${editId}` : "/api/projects";
    const res = await fetch(url, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setShowForm(false); load(); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error || "Failed to delete");
    }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-4 text-sm text-slate-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="gradient-violet relative overflow-hidden rounded-3xl px-6 py-5 text-white sm:px-8">
        <div className="bg-grid-faint absolute inset-0 opacity-30" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">CRM · Developments</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Projects</h2>
            <p className="mt-1 text-sm text-white/75">
              <span className="font-bold text-white">{projects.length}</span> active projects
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 crm-card">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search name, city, builder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 outline-none focus:border-violet-400"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="crm-card rounded-2xl py-16 text-center">
          <FolderKanban className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No projects found</p>
          <button onClick={openAdd} className="mt-3 text-sm font-semibold text-violet-600 hover:underline">Add your first project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="crm-card crm-card-hover group overflow-hidden rounded-2xl border border-slate-100 bg-white"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.image || PLACEHOLDER_IMG}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className={cn("absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", statusStyle(p.status))}>
                  {statusLabel(p.status)}
                </span>
                {p.featured && (
                  <span className="absolute right-3 top-3 rounded-lg bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">Featured</span>
                )}
                <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-violet-700 shadow-lg hover:bg-violet-50"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-rose-600 shadow-lg hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 line-clamp-1">{p.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {p.location}, {p.city}
                </p>
                {(p.builder || p.developer) && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-violet-600">
                    <HardHat className="h-3 w-3" />
                    {p.builder?.name ?? p.developer}
                  </p>
                )}
                {p.priceFrom != null && p.priceFrom > 0 && (
                  <p className="mt-2 text-xl font-extrabold text-violet-700">
                    From {formatINR(p.priceFrom)}
                    {p.priceTo != null && p.priceTo > p.priceFrom && (
                      <span className="text-sm font-medium text-slate-400"> – {formatINR(p.priceTo)}</span>
                    )}
                  </p>
                )}
                <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  {p.totalUnits != null && p.totalUnits > 0 && (
                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{p.totalUnits} units</span>
                  )}
                  <span className="flex items-center gap-1"><FolderKanban className="h-3.5 w-3.5" />{p._count?.properties ?? 0} properties</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p._count?.leads ?? 0} leads</span>
                </div>
                <div className="mt-3 flex gap-2 sm:hidden">
                  <button onClick={() => openEdit(p)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-violet-200 py-2 text-xs font-semibold text-violet-700">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id, p.name)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 py-2 text-xs font-semibold text-rose-600">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editId ? "Edit Project" : "Add Project"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5">
              <FormSection title="Project Details">
                <FormGrid cols={2}>
                  <Input label="Project Name *" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Skyline Residences" />
                  <Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)} options={STATUS_OPTIONS} />
                  <Input label="City *" value={form.city} onChange={(e) => update("city", e.target.value)} />
                  <Input label="Location *" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Wakad" />
                  <Select label="Builder" value={form.builderId} onChange={(e) => update("builderId", e.target.value)}
                    options={builders.map((b) => ({ value: b.id, label: b.name }))} placeholder="Optional" />
                  <Input label="Developer" value={form.developer} onChange={(e) => update("developer", e.target.value)} />
                  <div className="md:col-span-2">
                    <Input label="Image URL" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." />
                  </div>
                </FormGrid>
              </FormSection>
              <FormSection title="Pricing & Units">
                <FormGrid cols={3}>
                  <Input label="Total Units" type="number" value={form.totalUnits} onChange={(e) => update("totalUnits", e.target.value)} />
                  <Input label="Price From (₹)" type="number" value={form.priceFrom} onChange={(e) => update("priceFrom", e.target.value)} />
                  <Input label="Price To (₹)" type="number" value={form.priceTo} onChange={(e) => update("priceTo", e.target.value)} />
                </FormGrid>
                <div className="mt-4">
                  <Textarea label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} />
                </div>
              </FormSection>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.city.trim() || !form.location.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-60"
              >
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : editId ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
