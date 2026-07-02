"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Pencil, Trash2, Rocket, X, Loader2, MapPin,
  Sparkles, Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, FilterSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { formatINR, cn } from "@/lib/utils";

interface Launch {
  id: string;
  name: string;
  description?: string;
  location: string;
  city: string;
  status: string;
  launchDate?: string | null;
  image?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  builder?: string | null;
  bhk?: string | null;
  possession?: string | null;
  offer?: string | null;
  featured?: boolean;
  projectId?: string | null;
  project?: { name: string; builder?: { name: string } | null } | null;
}

interface ProjectOption { id: string; name: string }

const STATUS_OPTIONS = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "LIVE", label: "Live" },
  { value: "SOLD_OUT", label: "Sold Out" },
  { value: "CLOSED", label: "Closed" },
];

const emptyForm = {
  name: "", description: "", location: "", city: "", status: "UPCOMING",
  launchDate: "", image: "", priceFrom: "", priceTo: "",
  builder: "", bhk: "", possession: "", offer: "",
  featured: "false", projectId: "",
};

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=520&fit=crop";

function statusStyle(status: string) {
  if (status === "LIVE") return "bg-emerald-100 text-emerald-700";
  if (status === "UPCOMING") return "bg-amber-100 text-amber-700";
  if (status === "SOLD_OUT") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status.replace(/_/g, " ");
}

function formatDateInput(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const featuredCount = useMemo(() => launches.filter((l) => l.featured).length, [launches]);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/launches").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([l, p]) => {
        setLaunches(Array.isArray(l) ? l : []);
        setProjects(Array.isArray(p) ? p.map(({ id, name }: ProjectOption) => ({ id, name })) : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return launches.filter((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (featuredFilter === "featured" && !l.featured) return false;
      if (featuredFilter === "not-featured" && l.featured) return false;
      if (!q) return true;
      return [l.name, l.city, l.location, l.builder, l.project?.name].some((v) => v?.toLowerCase().includes(q));
    });
  }, [launches, search, statusFilter, featuredFilter]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (l: Launch) => {
    setEditId(l.id);
    setForm({
      name: l.name,
      description: l.description ?? "",
      location: l.location,
      city: l.city,
      status: l.status,
      launchDate: formatDateInput(l.launchDate),
      image: l.image ?? "",
      priceFrom: l.priceFrom ? String(l.priceFrom) : "",
      priceTo: l.priceTo ? String(l.priceTo) : "",
      builder: l.builder ?? l.project?.builder?.name ?? "",
      bhk: l.bhk ?? "",
      possession: l.possession ?? "",
      offer: l.offer ?? "",
      featured: l.featured ? "true" : "false",
      projectId: l.projectId ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim() || !form.location.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      featured: form.featured === "true",
      projectId: form.projectId || null,
    };
    const url = editId ? `/api/launches/${editId}` : "/api/launches";
    const res = await fetch(url, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { setShowForm(false); load(); }
    else {
      const data = await res.json();
      alert(data.error || "Failed to save launch");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/launches/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error || "Failed to delete");
    }
  };

  const toggleFeatured = async (l: Launch) => {
    const res = await fetch(`/api/launches/${l.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !l.featured }),
    });
    if (res.ok) load();
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (loading && launches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-4 text-sm text-slate-500">Loading launches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="gradient-violet relative overflow-hidden rounded-3xl px-6 py-5 text-white sm:px-8">
        <div className="bg-grid-faint absolute inset-0 opacity-30" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">CRM · Website</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Featured New Launches</h2>
            <p className="mt-1 text-sm text-white/75">
              <span className="font-bold text-white">{launches.length}</span> total ·{" "}
              <span className="font-bold text-amber-300">{featuredCount}</span> on homepage carousel
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Add Launch
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        <p className="font-semibold">Homepage carousel</p>
        <p className="mt-0.5 text-amber-800/90">
          Mark launches as <strong>Featured</strong> to show them in the &quot;Featured New Launch&quot; section on the website (up to 4 slides).
        </p>
      </div>

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
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Status"
          options={STATUS_OPTIONS}
        />
        <FilterSelect
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          placeholder="All Launches"
          options={[
            { value: "featured", label: "Featured on Homepage" },
            { value: "not-featured", label: "Not Featured" },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="crm-card rounded-2xl py-16 text-center">
          <Rocket className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No launches found</p>
          <button onClick={openAdd} className="mt-3 text-sm font-semibold text-violet-600 hover:underline">Add your first launch</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((l) => (
            <div
              key={l.id}
              className="crm-card crm-card-hover group overflow-hidden rounded-2xl border border-slate-100 bg-white"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={l.image || PLACEHOLDER_IMG}
                  alt={l.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className={cn("absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", statusStyle(l.status))}>
                  {statusLabel(l.status)}
                </span>
                {l.featured && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    <Star className="h-3 w-3 fill-current" /> Featured
                  </span>
                )}
                <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(l)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-violet-700 shadow-lg hover:bg-violet-50"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(l.id, l.name)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-rose-600 shadow-lg hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 line-clamp-1">{l.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {l.location}, {l.city}
                </p>
                {l.builder && (
                  <p className="mt-1 text-xs font-medium text-violet-600">{l.builder}</p>
                )}
                {l.priceFrom != null && l.priceFrom > 0 && (
                  <p className="mt-2 text-lg font-extrabold text-emerald-700">
                    From {formatINR(l.priceFrom)}
                    {l.priceTo != null && l.priceTo > l.priceFrom && (
                      <span className="text-sm font-medium text-slate-400"> – {formatINR(l.priceTo)}</span>
                    )}
                  </p>
                )}
                {l.offer && (
                  <p className="mt-2 flex items-start gap-1 text-xs text-pink-700">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
                    <span className="line-clamp-2">{l.offer}</span>
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(l)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors",
                      l.featured
                        ? "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                        : "border border-violet-200 text-violet-700 hover:bg-violet-50"
                    )}
                  >
                    <Star className={cn("h-3.5 w-3.5", l.featured && "fill-current")} />
                    {l.featured ? "On Homepage" : "Feature on Homepage"}
                  </button>
                  <button onClick={() => openEdit(l)} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:hidden">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editId ? "Edit Launch" : "Add New Launch"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5">
              <FormSection title="Launch Details">
                <FormGrid cols={2}>
                  <Input label="Project Name *" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Lodha Altamount" />
                  <Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)} options={STATUS_OPTIONS} />
                  <Input label="City *" value={form.city} onChange={(e) => update("city", e.target.value)} />
                  <Input label="Location *" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Altamount Road" />
                  <Input label="Builder Name" value={form.builder} onChange={(e) => update("builder", e.target.value)} placeholder="e.g. Lodha Group" />
                  <Input label="Launch Date" type="date" value={form.launchDate} onChange={(e) => update("launchDate", e.target.value)} />
                  <Select
                    label="Link to Project"
                    value={form.projectId}
                    onChange={(e) => update("projectId", e.target.value)}
                    options={projects.map((p) => ({ value: p.id, label: p.name }))}
                    placeholder="Optional"
                  />
                  <Select
                    label="Show on Homepage Carousel"
                    value={form.featured}
                    onChange={(e) => update("featured", e.target.value)}
                    options={[
                      { value: "true", label: "Yes — Featured New Launch" },
                      { value: "false", label: "No" },
                    ]}
                  />
                  <div className="md:col-span-2">
                    <Input label="Image URL" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." />
                    {form.image && (
                      <img src={form.image} alt="Preview" className="mt-2 h-32 w-full rounded-lg object-cover" />
                    )}
                  </div>
                </FormGrid>
              </FormSection>

              <FormSection title="Pricing & Display">
                <FormGrid cols={2}>
                  <Input label="Price From (₹)" type="number" value={form.priceFrom} onChange={(e) => update("priceFrom", e.target.value)} />
                  <Input label="Price To (₹)" type="number" value={form.priceTo} onChange={(e) => update("priceTo", e.target.value)} />
                  <Input label="BHK / Configuration" value={form.bhk} onChange={(e) => update("bhk", e.target.value)} placeholder="e.g. 2, 3 & 4 BHK" />
                  <Input label="Possession" value={form.possession} onChange={(e) => update("possession", e.target.value)} placeholder="e.g. Dec 2027" />
                  <div className="md:col-span-2">
                    <Input label="Special Offer" value={form.offer} onChange={(e) => update("offer", e.target.value)} placeholder="e.g. 5% launch discount + flexible payment plan" />
                  </div>
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
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : editId ? "Save Changes" : "Publish Launch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
