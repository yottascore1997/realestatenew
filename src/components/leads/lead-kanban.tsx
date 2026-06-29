"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import type { Lead } from "@/lib/leads/types";
import { KANBAN_COLUMNS, getPriorityConfig, getTemperatureConfig, getStatusConfig } from "@/lib/leads/constants";
import { cn } from "@/lib/utils";

interface LeadKanbanProps {
  columns: Record<string, Lead[]>;
  onStatusChange?: (leadId: string, status: string) => void;
}

export function LeadKanban({ columns, onStatusChange }: LeadKanbanProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const handleDrop = (status: string) => {
    if (dragging && onStatusChange) onStatusChange(dragging, status);
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((col) => {
        const leads = columns[col.key] ?? [];
        const cfg = getStatusConfig(col.key);
        return (
          <div
            key={col.key}
            className="min-w-[280px] flex-1"
            onDragOver={(e) => { e.preventDefault(); setOver(col.key); }}
            onDragLeave={() => setOver((o) => (o === col.key ? null : o))}
            onDrop={() => handleDrop(col.key)}
          >
            <div className="mb-3 flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 crm-card">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", cfg.color)} />
                <h3 className="text-sm font-bold text-slate-700">{col.label}</h3>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", cfg.bgLight, cfg.textColor)}>
                {leads.length}
              </span>
            </div>
            <div className={cn(
              "min-h-[220px] space-y-2.5 rounded-2xl border-2 border-dashed p-2.5 transition-colors",
              over === col.key ? "border-violet-300 bg-violet-50/60" : "border-transparent bg-slate-100/70"
            )}>
              {leads.map((lead) => {
                const priority = getPriorityConfig(lead.priority);
                const temp = getTemperatureConfig(lead.temperature);
                return (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragging(lead.id)}
                    onDragEnd={() => { setDragging(null); setOver(null); }}
                    className={cn(
                      "group relative cursor-grab overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing",
                      dragging === lead.id && "rotate-1 opacity-60"
                    )}
                  >
                    <span className={cn("absolute left-0 top-0 h-full w-1", cfg.color)} />
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/crm/leads/${lead.id}`} className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900 transition-colors group-hover:text-violet-700">{lead.fullName}</p>
                        <p className="text-xs text-slate-500">{lead.mobile}</p>
                      </Link>
                      <div className="flex shrink-0 items-center gap-1 text-xs">
                        <span title="Priority">{priority.icon}</span>
                        <span title="Temperature">{temp.icon}</span>
                      </div>
                    </div>

                    {lead.budget && (
                      <span className="mt-2 inline-flex rounded-md bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-700">{lead.budget}</span>
                    )}
                    {lead.projectName && <p className="mt-1.5 truncate text-xs text-slate-400">{lead.projectName}</p>}

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
                      <span className="truncate text-[11px] font-medium text-slate-400">
                        {lead.agentName ? `👤 ${lead.agentName}` : "Unassigned"}
                      </span>
                      <div className="flex gap-1">
                        <a href={`tel:${lead.mobile}`} className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-indigo-100 hover:text-indigo-600">
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                        <a href={`https://wa.me/91${lead.mobile}`} target="_blank" rel="noreferrer" className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-green-100 hover:text-green-600">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
              {leads.length === 0 && (
                <p className="py-8 text-center text-xs text-slate-300">Drop leads here</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
