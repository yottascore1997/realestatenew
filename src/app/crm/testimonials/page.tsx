"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Star, X, Loader2, MapPin, Quote,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  city: string;
  text: string;
  rating: number;
  image?: string | null;
  avatar?: string | null;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
}

const emptyForm = {
  name: "", role: "Homeowner", city: "", text: "",
  rating: "5", image: "", avatar: "",
  featured: "false", published: "true", sortOrder: "0",
};

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=420&fit=crop";

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/testimonials?published=false")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return items;
    return items.filter((t) =>
      [t.name, t.city, t.role, t.text].some((v) => v?.toLowerCase().includes(q))
    );
  }, [items, search]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (t: Testimonial) => {
    setEditId(t.id);
    setForm({
      name: t.name,
      role: t.role ?? "Homeowner",
      city: t.city,
      text: t.text,
      rating: String(t.rating),
      image: t.image ?? "",
      avatar: t.avatar ?? "",
      featured: t.featured ? "true" : "false",
      published: t.published !== false ? "true" : "false",
      sortOrder: String(t.sortOrder ?? 0),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim() || !form.text.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      rating: Number(form.rating),
      featured: form.featured === "true",
      published: form.published === "true",
      sortOrder: Number(form.sortOrder),
    };
    const url = editId ? `/api/testimonials/${editId}` : "/api/testimonials";
    const res = await fetch(url, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { setShowForm(false); load(); }
    else alert("Failed to save testimonial");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  const togglePublished = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !t.published }),
    });
    load();
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-4 text-sm text-slate-500">Loading testimonials...</p>
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
            <h2 className="text-2xl font-extrabold tracking-tight">Testimonials</h2>
            <p className="mt-1 text-sm text-white/75">
              <span className="font-bold text-white">{items.filter((t) => t.published).length}</span> published on homepage
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg"
          >
            <Plus className="h-4 w-4" /> Add Testimonial
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        Published testimonials appear in the homepage carousel. Mark one as <strong>Featured</strong> for priority ordering.
      </div>

      <div className="relative min-w-[200px] rounded-2xl border border-slate-100 bg-white p-3 crm-card">
        <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search name, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="crm-card rounded-2xl py-16 text-center">
          <Quote className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No testimonials yet</p>
          <button onClick={openAdd} className="mt-3 text-sm font-semibold text-violet-600 hover:underline">Add your first review</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <div key={t.id} className="crm-card overflow-hidden rounded-2xl border border-slate-100 bg-white">
              <div className="relative h-36">
                <img src={t.image || PLACEHOLDER_IMG} alt="" className="h-full w-full object-cover" />
                {!t.published && (
                  <span className="absolute left-3 top-3 rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-white">Draft</span>
                )}
                {t.featured && (
                  <span className="absolute right-3 top-3 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">Featured</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-3 font-bold text-slate-900">{t.name}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" /> {t.role || "Homeowner"} · {t.city}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <button type="button" onClick={() => togglePublished(t)} className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs font-semibold",
                    t.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {t.published ? "Published" : "Publish"}
                  </button>
                  <button type="button" onClick={() => openEdit(t)} className="rounded-lg border border-violet-200 px-2.5 py-1.5 text-xs font-semibold text-violet-700">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(t.id, t.name)} className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600">
                    Delete
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
              <h3 className="text-lg font-bold">{editId ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-5">
              <FormSection title="Client Details">
                <FormGrid cols={2}>
                  <Input label="Name *" value={form.name} onChange={(e) => update("name", e.target.value)} />
                  <Input label="Role" value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Homeowner" />
                  <Input label="City *" value={form.city} onChange={(e) => update("city", e.target.value)} />
                  <Select label="Rating" value={form.rating} onChange={(e) => update("rating", e.target.value)}
                    options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} Stars` }))} />
                  <Input label="Property Image URL" value={form.image} onChange={(e) => update("image", e.target.value)} className="md:col-span-2" />
                  <Input label="Avatar URL" value={form.avatar} onChange={(e) => update("avatar", e.target.value)} className="md:col-span-2" />
                </FormGrid>
              </FormSection>
              <FormSection title="Review">
                <Textarea label="Testimonial *" value={form.text} onChange={(e) => update("text", e.target.value)} rows={4} />
                <FormGrid cols={3}>
                  <Select label="Featured" value={form.featured} onChange={(e) => update("featured", e.target.value)}
                    options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} />
                  <Select label="Published" value={form.published} onChange={(e) => update("published", e.target.value)}
                    options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} />
                  <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => update("sortOrder", e.target.value)} />
                </FormGrid>
              </FormSection>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.city.trim() || !form.text.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
