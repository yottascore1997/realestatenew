"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Pencil, Trash2, X, Loader2, MapPin, User, Phone, Calendar,
  CalendarCheck, Users, FileText, Clock, ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import {
  APPOINTMENT_TYPES, typeLabel, typeStyle, appointmentTiming,
  formatAppointmentTime, dateGroupLabel,
} from "@/lib/appointments/constants";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  title: string;
  type: string;
  location: string | null;
  startTime: string;
  endTime: string | null;
  notes: string | null;
  leadId: string | null;
  agentId: string | null;
  lead: { id: string; name: string; mobile: string; email: string | null } | null;
  agent: { id: string; name: string; phone: string | null } | null;
}

interface Stats { total: number; today: number; thisWeek: number; upcoming: number; past: number }

interface LeadOption { id: string; fullName: string }
interface AgentOption { id: string; name: string }

const TYPE_ICONS: Record<string, typeof Calendar> = {
  PROPERTY_SHOWING: Calendar,
  CLIENT_MEETING: Users,
  FOLLOW_UP_CALL: Phone,
  DOCUMENT_SIGNING: FileText,
  OTHER: CalendarCheck,
};

const PERIOD_OPTIONS = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

const emptyForm = {
  title: "", type: "PROPERTY_SHOWING", location: "", startTime: "", endTime: "",
  notes: "", leadId: "", agentId: "",
};

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function timingBadge(timing: "ongoing" | "upcoming" | "past") {
  if (timing === "ongoing") return { label: "Live Now", cls: "bg-emerald-100 text-emerald-700 ring-emerald-200 animate-pulse" };
  if (timing === "upcoming") return { label: "Upcoming", cls: "bg-violet-100 text-violet-700 ring-violet-200" };
  return { label: "Completed", cls: "bg-slate-100 text-slate-500 ring-slate-200" };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<LeadOption[]>([]);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("upcoming");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    if (periodFilter) params.set("period", periodFilter);

    Promise.all([
      fetch(`/api/appointments?${params}`).then((r) => r.json()),
      fetch("/api/leads?limit=200").then((r) => r.json()),
      fetch("/api/users/employees").then((r) => r.json()),
    ])
      .then(([apptData, leadsData, agentsData]) => {
        setAppointments(apptData.appointments ?? []);
        setStats(apptData.stats ?? null);
        const leadList = leadsData.leads ?? leadsData;
        setLeads(Array.isArray(leadList) ? leadList.map((l: { id: string; fullName: string }) => ({ id: l.id, fullName: l.fullName })) : []);
        setAgents(Array.isArray(agentsData) ? agentsData.map((a: { id: string; name: string }) => ({ id: a.id, name: a.name })) : []);
      })
      .finally(() => setLoading(false));
  }, [search, typeFilter, periodFilter]);

  useEffect(() => { load(); }, [load]);

  const grouped = useMemo(() => {
    const groups: { label: string; items: Appointment[] }[] = [];
    const map = new Map<string, Appointment[]>();
    appointments.forEach((a) => {
      const label = dateGroupLabel(a.startTime);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(a);
    });
    map.forEach((items, label) => groups.push({ label, items }));
    return groups;
  }, [appointments]);

  const openAdd = () => {
    setEditId(null);
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
    const end = new Date(now);
    end.setHours(end.getHours() + 1);
    setForm({
      ...emptyForm,
      startTime: toLocalInput(now.toISOString()),
      endTime: toLocalInput(end.toISOString()),
    });
    setShowForm(true);
  };

  const openEdit = (a: Appointment) => {
    setEditId(a.id);
    setForm({
      title: a.title,
      type: a.type,
      location: a.location ?? "",
      startTime: toLocalInput(a.startTime),
      endTime: a.endTime ? toLocalInput(a.endTime) : "",
      notes: a.notes ?? "",
      leadId: a.leadId ?? "",
      agentId: a.agentId ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.startTime) return;
    setSaving(true);
    const payload = {
      title: form.title,
      type: form.type,
      location: form.location,
      startTime: new Date(form.startTime).toISOString(),
      endTime: form.endTime ? new Date(form.endTime).toISOString() : null,
      notes: form.notes,
      leadId: form.leadId || null,
      agentId: form.agentId || null,
    };
    const url = editId ? `/api/appointments/${editId}` : "/api/appointments";
    const res = await fetch(url, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { setShowForm(false); load(); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete appointment "${title}"?`)) return;
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  if (loading && appointments.length === 0 && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-4 text-sm text-slate-500">Loading appointments...</p>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">CRM · Schedule</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Appointments</h2>
            <p className="mt-1 text-sm text-white/75">Site visits, client meetings & follow-ups — sab ek jagah</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg transition-transform hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Today", value: stats.today, period: "today", border: "border-violet-100", bg: "bg-violet-50", text: "text-violet-700" },
            { label: "This Week", value: stats.thisWeek, period: "week", border: "border-indigo-100", bg: "bg-indigo-50", text: "text-indigo-700" },
            { label: "Upcoming", value: stats.upcoming, period: "upcoming", border: "border-emerald-100", bg: "bg-emerald-50", text: "text-emerald-700" },
            { label: "Total", value: stats.total, period: "all", border: "border-slate-100", bg: "bg-slate-50", text: "text-slate-700" },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setPeriodFilter(s.period)}
              className={cn("crm-card rounded-2xl border p-4 text-left transition-all hover:ring-2 hover:ring-violet-200", s.border, s.bg, periodFilter === s.period && "ring-2 ring-violet-300")}
            >
              <p className={cn("text-2xl font-extrabold", s.text)}>{s.value}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-600">{s.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search title, lead, location, agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 crm-card"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-400 crm-card"
        >
          <option value="">All Types</option>
          {APPOINTMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 crm-card">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriodFilter(p.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                periodFilter === p.value ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {appointments.length === 0 ? (
        <div className="crm-card rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <CalendarCheck className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No appointments found</p>
          <p className="mt-1 text-xs text-slate-400">Book a site visit or client meeting to get started</p>
          <button onClick={openAdd} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
            <Plus className="h-4 w-4" /> Book Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-sm font-bold text-slate-800">{group.label}</h3>
                <div className="h-px flex-1 bg-slate-100" />
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">{group.items.length}</span>
              </div>
              <div className="space-y-3">
                {group.items.map((a) => {
                  const style = typeStyle(a.type);
                  const Icon = TYPE_ICONS[a.type] ?? CalendarCheck;
                  const timing = appointmentTiming(a.startTime, a.endTime);
                  const badge = timingBadge(timing);

                  return (
                    <div
                      key={a.id}
                      className={cn(
                        "crm-card group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all hover:shadow-md sm:p-5",
                        timing === "ongoing" ? "border-emerald-200 ring-1 ring-emerald-100" : "border-slate-100 hover:border-violet-100"
                      )}
                    >
                      {timing === "ongoing" && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
                      )}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm", style.bg)}>
                          <Icon className={cn("h-5 w-5", style.color)} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-slate-900">{a.title}</h4>
                                <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ring-1", badge.cls)}>
                                  {badge.label}
                                </span>
                              </div>
                              <span className={cn("mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold", style.bg, style.color)}>
                                {typeLabel(a.type)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(a)} className="rounded-lg border border-violet-200 p-2 text-violet-600 hover:bg-violet-50">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleDelete(a.id, a.title)} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                            <span className="flex items-center gap-1.5 font-semibold text-violet-700">
                              <Clock className="h-3.5 w-3.5" />
                              {formatAppointmentTime(a.startTime, a.endTime)}
                            </span>
                            {a.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                {a.location}
                              </span>
                            )}
                            {a.lead && (
                              <Link href={`/crm/leads/${a.lead.id}`} className="flex items-center gap-1.5 text-violet-600 hover:underline">
                                <User className="h-3.5 w-3.5" />
                                {a.lead.name}
                                <span className="text-slate-400">· {a.lead.mobile}</span>
                                <ChevronRight className="h-3 w-3" />
                              </Link>
                            )}
                            {a.agent && (
                              <span className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-slate-400" />
                                {a.agent.name}
                              </span>
                            )}
                          </div>

                          {a.notes && (
                            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">{a.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editId ? "Edit Appointment" : "Book Appointment"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FormSection title="Appointment Details">
              <FormGrid cols={1}>
                <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Site visit — Skyline Towers" />
                <Select
                  label="Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  options={APPOINTMENT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                />
                <FormGrid cols={2}>
                  <Input label="Start *" type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                  <Input label="End" type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </FormGrid>
                <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Address or meeting link" />
                <Select
                  label="Lead"
                  value={form.leadId}
                  onChange={(e) => setForm({ ...form, leadId: e.target.value })}
                  placeholder="Select lead (optional)"
                  options={leads.map((l) => ({ value: l.id, label: l.fullName }))}
                />
                <Select
                  label="Assign Employee"
                  value={form.agentId}
                  onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                  placeholder="Select employee (optional)"
                  options={agents.map((a) => ({ value: a.id, label: a.name }))}
                />
                <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Agenda, documents needed..." />
              </FormGrid>
            </FormSection>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.startTime}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : editId ? "Update" : "Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
