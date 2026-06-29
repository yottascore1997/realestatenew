"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { LEAD_SOURCES, LEAD_PRIORITIES, LEAD_TEMPERATURES, LEAD_PIPELINE } from "@/lib/leads/constants";

interface LeadFiltersProps {
  filters: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function LeadFilters({ filters, onChange, onClear }: LeadFiltersProps) {
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const hasFilters = Object.values(filters).some(Boolean);

  useEffect(() => {
    fetch("/api/users/employees").then((r) => r.json()).then(setEmployees);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search name, mobile, project..."
            value={filters.search ?? ""}
            onChange={(e) => onChange("search", e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#4F6BF5] focus:ring-2 focus:ring-[#4F6BF5]/20"
          />
        </div>
        <select
          value={filters.status ?? ""}
          onChange={(e) => onChange("status", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          <option value="">All Status</option>
          {LEAD_PIPELINE.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <select
          value={filters.source ?? ""}
          onChange={(e) => onChange("source", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          <option value="">All Sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <select
          value={filters.agentId ?? ""}
          onChange={(e) => onChange("agentId", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          <option value="">All Employees</option>
          {employees.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select
          value={filters.priority ?? ""}
          onChange={(e) => onChange("priority", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          <option value="">All Priority</option>
          {LEAD_PRIORITIES.map((p) => (
            <option key={p.key} value={p.key}>{p.icon} {p.label}</option>
          ))}
        </select>
        <select
          value={filters.temperature ?? ""}
          onChange={(e) => onChange("temperature", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
        >
          <option value="">All Temperature</option>
          {LEAD_TEMPERATURES.map((t) => (
            <option key={t.key} value={t.key}>{t.icon} {t.label}</option>
          ))}
        </select>
        {hasFilters && (
          <button onClick={onClear} className="flex items-center gap-1 text-sm text-red-500 hover:underline">
            <X className="h-4 w-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
