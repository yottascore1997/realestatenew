"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Eye, Check, Lock } from "lucide-react";
import type { Lead } from "@/lib/leads/types";
import { LEAD_PIPELINE, getSourceLabel, getTemperatureConfig, getStatusConfig } from "@/lib/leads/constants";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";

interface LeadTableProps {
  leads: Lead[];
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onStatusChangeRequest: (leadId: string, status: string, lead: Lead) => void;
  onFollowUpChange: (leadId: string, date: string, time?: string) => void;
  onRemarkSave: (leadId: string, notes: string) => void;
  onTrackingChange: (leadId: string, project: string, location: string) => void;
}

function toDateInput(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function toTimeInput(value?: string | null) {
  if (!value) return "";
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (match) return `${match[1].padStart(2, "0")}:${match[2]}`;
  return "";
}

function RemarkCell({ lead, onSave }: { lead: Lead; onSave: (id: string, notes: string) => void }) {
  const [val, setVal] = useState(lead.notes ?? "");
  const [saved, setSaved] = useState(false);
  const dirty = val !== (lead.notes ?? "");

  const commit = () => {
    if (!dirty) return;
    onSave(lead.id, val);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="min-w-[140px]">
      {lead.lastStatusRemark && (
        <p className="mb-1 line-clamp-2 text-[10px] leading-snug text-slate-500" title={lead.lastStatusRemark}>
          <span className="font-semibold text-violet-600">Status:</span> {lead.lastStatusRemark}
        </p>
      )}
      <div className="relative flex items-center">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          placeholder="Add remark..."
          className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 pr-7 text-xs text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
        />
        {saved ? (
          <Check className="absolute right-2 h-3.5 w-3.5 text-emerald-500" />
        ) : dirty ? (
          <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
        ) : null}
      </div>
    </div>
  );
}

export function LeadTable({
  leads,
  page,
  totalPages,
  total,
  onPageChange,
  onStatusChangeRequest,
  onFollowUpChange,
  onRemarkSave,
  onTrackingChange,
}: LeadTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white crm-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-2.5">Lead</th>
              <th className="px-3 py-2.5">Project</th>
              <th className="px-3 py-2.5">Location</th>
              <th className="px-3 py-2.5">Source</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Budget</th>
              <th className="px-3 py-2.5">Agent</th>
              <th className="px-3 py-2.5">Follow-up</th>
              <th className="px-3 py-2.5">Remark</th>
              <th className="px-3 py-2.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const temp = getTemperatureConfig(lead.temperature);
              const status = getStatusConfig(lead.status);
              return (
                <tr key={lead.id} className="group border-b border-slate-50 transition-colors last:border-0 hover:bg-violet-50/40">
                  <td className="relative whitespace-nowrap px-4 py-2">
                    <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-600 transition-all duration-200 group-hover:h-3/5" />
                    <Link href={`/crm/leads/${lead.id}`} className="flex items-center gap-2">
                      <span className="text-sm" title={temp.label}>{temp.icon}</span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 transition-colors group-hover:text-violet-700">{lead.fullName}</p>
                        <p className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Lock className="h-3 w-3" /> Contact on profile
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <input
                      defaultValue={lead.trackingProject || lead.projectName || ""}
                      onBlur={(e) => onTrackingChange(lead.id, e.target.value, lead.trackingLocation || lead.preferredLocation || lead.city || "")}
                      placeholder="Project..."
                      className="h-8 w-[120px] rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 focus:bg-white"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <input
                      defaultValue={lead.trackingLocation || lead.preferredLocation || lead.city || ""}
                      onBlur={(e) => onTrackingChange(lead.id, lead.trackingProject || lead.projectName || "", e.target.value)}
                      placeholder="Location..."
                      className="h-8 w-[120px] rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600 outline-none focus:border-violet-400 focus:bg-white"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {getSourceLabel(lead.source)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <div className="relative inline-flex items-center">
                      <span className={cn("pointer-events-none absolute left-2 h-2 w-2 rounded-full", status.color)} />
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusChangeRequest(lead.id, e.target.value, lead)}
                        className={cn(
                          "h-8 cursor-pointer appearance-none rounded-lg border pl-5 pr-2.5 text-xs font-bold outline-none transition-colors focus:ring-4 focus:ring-violet-100",
                          status.bgLight, status.border, status.textColor
                        )}
                      >
                        {LEAD_PIPELINE.map((s) => (
                          <option key={s.key} value={s.key} className="bg-white text-slate-700">{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">{lead.budget || "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {lead.agentName ? (
                      <span className="font-medium text-slate-600">{lead.agentName}</span>
                    ) : (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">Unassigned</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <input
                        type="date"
                        value={toDateInput(lead.nextFollowUpDate)}
                        onChange={(e) => onFollowUpChange(lead.id, e.target.value, lead.nextFollowUpTime ?? undefined)}
                        className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-violet-700 outline-none focus:border-violet-400 focus:bg-white"
                      />
                      <input
                        type="time"
                        value={toTimeInput(lead.nextFollowUpTime)}
                        onChange={(e) => onFollowUpChange(lead.id, toDateInput(lead.nextFollowUpDate), e.target.value)}
                        className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-600 outline-none focus:border-violet-400 focus:bg-white"
                      />
                    </div>
                    {lead.vcScheduledDate && (
                      <p className="mt-1 text-[10px] font-semibold text-sky-700">
                        VC: {toDateInput(lead.vcScheduledDate)} {lead.vcScheduledTime}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <RemarkCell lead={lead} onSave={onRemarkSave} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <div className="flex items-center justify-center gap-0.5">
                      <Link href={`/crm/leads/${lead.id}`} title="View & Call" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-all hover:bg-violet-100 hover:text-violet-600">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link href={`/crm/leads/${lead.id}`} title="Contact details" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-all hover:bg-indigo-100 hover:text-indigo-600">
                        <Phone className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl gradient-violet-soft">
            <Eye className="h-6 w-6 text-violet-400" />
          </div>
          <p className="font-semibold text-slate-600">No leads found</p>
          <p className="mt-1 text-sm text-slate-400">Try changing search or add a new lead</p>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
    </div>
  );
}
