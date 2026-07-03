"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, LayoutList, Columns3, Upload, Search, Download, X } from "lucide-react";
import { LeadDashboardStats, STAT_FILTER_LABELS, type LeadStatFilter } from "@/components/leads/lead-dashboard-stats";
import { LeadTable } from "@/components/leads/lead-table";
import { LeadKanban } from "@/components/leads/lead-kanban";
import { LeadRemindersBanner } from "@/components/leads/lead-reminders-banner";
import { LeadStatusModal, type StatusUpdatePayload } from "@/components/leads/lead-status-modal";
import { LeadImportModal } from "@/components/leads/lead-import-modal";
import { CitySelect } from "@/components/leads/city-select";
import { LEAD_PIPELINE, LEAD_SOURCES, KANBAN_COLUMNS } from "@/lib/leads/constants";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/leads/types";
import type { LeadDashboardStats as StatsType } from "@/lib/leads/types";

const PAGE_SIZE = 10;

export default function LeadsPage() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [quickFilter, setQuickFilter] = useState<LeadStatFilter | null>(null);
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<{ leadId: string; status: string; lead: Lead } | null>(null);

  const loadLeads = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (sourceFilter) params.set("source", sourceFilter);
    if (locationFilter) params.set("location", locationFilter);
    if (quickFilter && quickFilter !== "all") params.set("quickFilter", quickFilter);
    return fetch(`/api/leads?${params}`).then((r) => {
      if (!r.ok) throw new Error("Failed to load leads");
      return r.json();
    });
  }, [page, search, statusFilter, sourceFilter, locationFilter, quickFilter]);

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([
      loadLeads(),
      fetch("/api/leads?dashboard=true").then((r) => r.json()),
    ])
      .then(([data, statsData]) => {
        setLeads(data.leads ?? data);
        setTotal(data.total ?? (data.leads ?? data).length);
        setTotalPages(data.totalPages ?? 1);
        setStats(statsData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [loadLeads]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => { setPage(1); }, [search, statusFilter, sourceFilter, locationFilter, quickFilter]);

  const handleQuickFilterChange = (filter: LeadStatFilter | null) => {
    setQuickFilter(filter);
    if (filter) {
      setStatusFilter("");
      setView("list");
    }
  };

  const kanbanData = useMemo(() => {
    const columns: Record<string, Lead[]> = {};
    KANBAN_COLUMNS.forEach((s) => {
      columns[s.key] = leads.filter((l) => l.status === s.key);
    });
    return columns;
  }, [leads]);

  const patchLead = async (leadId: string, data: Record<string, unknown>) => {
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const handleStatusChangeRequest = (leadId: string, status: string, lead: Lead) => {
    if (status === lead.status) return;
    setStatusModal({ leadId, status, lead });
  };

  const handleStatusSave = async (payload: StatusUpdatePayload) => {
    if (!statusModal) return;
    const { leadId } = statusModal;
    const body: Record<string, unknown> = {
      status: payload.status,
      lastStatusRemark: payload.remark || null,
      trackingProject: payload.trackingProject || null,
      trackingLocation: payload.trackingLocation || null,
    };
    if (payload.remark) body.notes = payload.remark;
    if (payload.status === "VC_SCHEDULED" && payload.vcScheduledDate) {
      body.vcScheduledDate = new Date(payload.vcScheduledDate).toISOString();
      body.vcScheduledTime = payload.vcScheduledTime;
    }
    setLeads((prev) => prev.map((l) => l.id === leadId ? {
      ...l,
      status: payload.status,
      lastStatusRemark: payload.remark,
      trackingProject: payload.trackingProject,
      trackingLocation: payload.trackingLocation,
      notes: payload.remark || l.notes,
      vcScheduledDate: body.vcScheduledDate as string | undefined,
      vcScheduledTime: payload.vcScheduledTime,
    } : l));
    setStatusModal(null);
    await patchLead(leadId, body);
  };

  const handleKanbanDrop = (leadId: string, status: string, lead: Lead) => {
    handleStatusChangeRequest(leadId, status, lead);
  };

  const handleFollowUpChange = async (leadId: string, date: string, time?: string) => {
    const iso = date ? new Date(date).toISOString() : null;
    setLeads((prev) => prev.map((l) => l.id === leadId ? {
      ...l,
      nextFollowUpDate: iso,
      nextFollowUpTime: time ?? l.nextFollowUpTime,
    } : l));
    await patchLead(leadId, {
      nextFollowUpDate: iso,
      ...(time !== undefined ? { nextFollowUpTime: time || null } : {}),
    });
  };

  const handleTrackingChange = async (leadId: string, project: string, location: string) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? {
      ...l,
      trackingProject: project,
      trackingLocation: location,
    } : l));
    await patchLead(leadId, { trackingProject: project || null, trackingLocation: location || null });
  };

  const handleRemarkSave = async (leadId: string, notes: string) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, notes } : l));
    await patchLead(leadId, { notes });
  };

  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      if (locationFilter) params.set("location", locationFilter);
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      const rows: Lead[] = Array.isArray(data) ? data : (data.leads ?? []);

      const headers = ["Name", "Mobile", "Email", "Source", "Status", "Budget", "Agent", "Location", "Follow-up Date", "Temperature", "Priority", "Remark", "Created At"];
      const esc = (v: unknown) => {
        const s = v == null ? "" : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const lines = [headers.join(",")];
      rows.forEach((l) => {
        lines.push([
          l.fullName, l.mobile, l.email ?? "", l.source, l.status, l.budget ?? "",
          l.agentName ?? "", l.preferredLocation ?? l.city ?? "",
          l.nextFollowUpDate ? new Date(l.nextFollowUpDate).toLocaleDateString("en-IN") : "",
          l.temperature, l.priority, l.notes ?? "",
          l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-IN") : "",
        ].map(esc).join(","));
      });

      const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (error) return <div className="py-20 text-center text-red-500">Database error: {error}. Run npm run db:push && npm run db:seed</div>;
  if (loading && leads.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
      <p className="mt-4 text-sm font-medium text-slate-500">Loading leads...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* premium banner */}
      <div className="gradient-violet relative overflow-hidden rounded-3xl px-6 py-6 text-white sm:px-8">
        <div className="bg-grid-faint absolute inset-0 opacity-40" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">CRM · Pipeline</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Lead Management</h2>
            <p className="mt-1 text-sm text-white/75">
              <span className="font-bold text-white tabular-nums">{total}</span> active leads in your pipeline
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-md">
              <button onClick={() => setView("list")} className={cn("flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all", view === "list" ? "bg-white text-violet-700 shadow" : "text-white/80 hover:text-white")}>
                <LayoutList className="h-4 w-4" /> List
              </button>
              <button onClick={() => setView("kanban")} className={cn("flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all", view === "kanban" ? "bg-white text-violet-700 shadow" : "text-white/80 hover:text-white")}>
                <Columns3 className="h-4 w-4" /> Kanban
              </button>
            </div>
            <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:opacity-60">
              <Download className="h-4 w-4" /> {exporting ? "Exporting..." : "Export"}
            </button>
            <button onClick={() => setImportOpen(true)} className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
              <Upload className="h-4 w-4" /> Import
            </button>
            <Link href="/crm/leads/new">
              <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg transition-transform hover:scale-[1.03]">
                <Plus className="h-4 w-4" /> Add Lead
              </button>
            </Link>
          </div>
        </div>
      </div>

      {stats && (
        <LeadDashboardStats
          stats={stats}
          activeFilter={quickFilter}
          onFilterChange={handleQuickFilterChange}
        />
      )}

      {quickFilter && (
        <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm">
          <span className="font-medium text-violet-800">
            Showing: <span className="font-bold">{STAT_FILTER_LABELS[quickFilter]}</span>
            <span className="ml-1 tabular-nums text-violet-600">({total})</span>
          </span>
          <button
            type="button"
            onClick={() => setQuickFilter(null)}
            className="ml-auto flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-violet-700 shadow-sm hover:bg-violet-100"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        </div>
      )}

      <LeadRemindersBanner />

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 crm-card">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search name, mobile, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 outline-none transition-colors focus:border-violet-400">
          <option value="">All Status</option>
          {LEAD_PIPELINE.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 outline-none transition-colors focus:border-violet-400">
          <option value="">All Sources</option>
          {LEAD_SOURCES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <CitySelect value={locationFilter} onChange={setLocationFilter} placeholder="All Cities" />
      </div>

      {view === "list" ? (
        <LeadTable
          leads={leads}
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
          onStatusChangeRequest={handleStatusChangeRequest}
          onFollowUpChange={handleFollowUpChange}
          onRemarkSave={handleRemarkSave}
          onTrackingChange={handleTrackingChange}
        />
      ) : (
        <LeadKanban columns={kanbanData} onStatusChangeRequest={handleKanbanDrop} />
      )}

      <LeadImportModal open={importOpen} onClose={() => setImportOpen(false)} onImported={refresh} />

      {statusModal && (
        <LeadStatusModal
          open
          leadName={statusModal.lead.fullName}
          status={statusModal.status}
          initialProject={statusModal.lead.trackingProject || statusModal.lead.projectName || ""}
          initialLocation={statusModal.lead.trackingLocation || statusModal.lead.preferredLocation || statusModal.lead.city || ""}
          onClose={() => setStatusModal(null)}
          onSave={handleStatusSave}
        />
      )}
    </div>
  );
}
