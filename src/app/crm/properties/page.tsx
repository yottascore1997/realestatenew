"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Pencil, Trash2, Bed, Bath, Maximize, Building2, X, Loader2, MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { formatINR, cn } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  state?: string | null;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number | null;
  image?: string | null;
  featured?: boolean;
  projectId?: string | null;
  project?: { name: string } | null;
}

interface ProjectOption { id: string; name: string }

const TYPE_OPTIONS = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "HOUSE", label: "House" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "LAND", label: "Land" },
  { value: "PENTHOUSE", label: "Penthouse" },
];

const STATUS_OPTIONS = [
  { value: "FOR_SALE", label: "For Sale" },
  { value: "FOR_RENT", label: "For Rent" },
  { value: "SOLD", label: "Sold" },
  { value: "RENTED", label: "Rented" },
  { value: "OFF_MARKET", label: "Off Market" },
];

const emptyForm = {
  title: "", description: "", address: "", city: "", state: "",
  price: "", type: "APARTMENT", status: "FOR_SALE",
  bedrooms: "2", bathrooms: "2", sqft: "", image: "", projectId: "",
};

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop";

function statusStyle(status: string) {
  if (status === "FOR_SALE") return "bg-violet-100 text-violet-700";
  if (status === "FOR_RENT") return "bg-emerald-100 text-emerald-700";
  if (status === "SOLD") return "bg-slate-100 text-slate-600";
  return "bg-amber-100 text-amber-700";
}

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status.replace("_", " ");
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
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
      fetch("/api/properties").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([props, projs]) => {
        setProperties(Array.isArray(props) ? props : []);
        setProjects(Array.isArray(projs) ? projs.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })) : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return properties.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (!q) return true;
      return [p.title, p.city, p.address, p.project?.name].some((v) => v?.toLowerCase().includes(q));
    });
  }, [properties, search, statusFilter]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (p: Property) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? "",
      address: p.address,
      city: p.city,
      state: p.state ?? "",
      price: String(p.price),
      type: p.type,
      status: p.status,
      bedrooms: String(p.bedrooms),
      bathrooms: String(p.bathrooms),
      sqft: p.sqft ? String(p.sqft) : "",
      image: p.image ?? "",
      projectId: p.projectId ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.city.trim()) return;
    setSaving(true);
    const url = editId ? `/api/properties/${editId}` : "/api/properties";
    const res = await fetch(url, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setShowForm(false); load(); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error || "Failed to delete");
    }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (loading && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-4 text-sm text-slate-500">Loading properties...</p>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">CRM · Inventory</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Properties</h2>
            <p className="mt-1 text-sm text-white/75">
              <span className="font-bold text-white">{properties.length}</span> listings in database
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-4 w-4" /> Add Property
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 crm-card">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search title, city, address..."
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
          <Building2 className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No properties found</p>
          <button onClick={openAdd} className="mt-3 text-sm font-semibold text-violet-600 hover:underline">Add your first property</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="crm-card crm-card-hover group overflow-hidden rounded-2xl border border-slate-100 bg-white"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.image || PLACEHOLDER_IMG}
                  alt={property.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className={cn("absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", statusStyle(property.status))}>
                  {statusLabel(property.status)}
                </span>
                {property.featured && (
                  <span className="absolute right-3 top-3 rounded-lg bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">Featured</span>
                )}
                <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(property)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-violet-700 shadow-lg hover:bg-violet-50"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(property.id, property.title)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-rose-600 shadow-lg hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 line-clamp-1">{property.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {property.address}, {property.city}
                </p>
                {property.project && (
                  <p className="mt-0.5 text-xs text-violet-600">{property.project.name}</p>
                )}
                <p className="mt-2 text-xl font-extrabold text-violet-700">{formatINR(property.price)}</p>
                <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{property.bedrooms} Beds</span>
                  <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{property.bathrooms} Baths</span>
                  {property.sqft && (
                    <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{property.sqft.toLocaleString()} sqft</span>
                  )}
                </div>
                <div className="mt-3 flex gap-2 sm:hidden">
                  <button onClick={() => openEdit(property)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-violet-200 py-2 text-xs font-semibold text-violet-700">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(property.id, property.title)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 py-2 text-xs font-semibold text-rose-600">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editId ? "Edit Property" : "Add Property"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FormSection title="Basic Details">
              <FormGrid cols={2}>
                <Input label="Title *" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. 3BHK Luxury Apartment" />
                <Input label="Price (₹) *" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} />
                <Select label="Type" value={form.type} onChange={(e) => update("type", e.target.value)} options={TYPE_OPTIONS} />
                <Select label="Status" value={form.status} onChange={(e) => update("status", e.target.value)} options={STATUS_OPTIONS} />
                <Input label="City *" value={form.city} onChange={(e) => update("city", e.target.value)} />
                <Input label="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
                <div className="md:col-span-2">
                  <Input label="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Input label="Image URL" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." />
                </div>
                <Select label="Project" value={form.projectId} onChange={(e) => update("projectId", e.target.value)}
                  options={projects.map((p) => ({ value: p.id, label: p.name }))} placeholder="Optional" />
              </FormGrid>
            </FormSection>
            <FormSection title="Specs">
              <FormGrid cols={3}>
                <Input label="Bedrooms" type="number" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
                <Input label="Bathrooms" type="number" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
                <Input label="Sqft" type="number" value={form.sqft} onChange={(e) => update("sqft", e.target.value)} />
              </FormGrid>
              <div className="mt-4">
                <Textarea label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} />
              </div>
            </FormSection>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-60"
              >
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : editId ? "Save Changes" : "Create Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
