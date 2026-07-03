"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getStatusConfig } from "@/lib/leads/constants";
import { cn } from "@/lib/utils";

export type StatusUpdatePayload = {
  status: string;
  remark: string;
  trackingProject: string;
  trackingLocation: string;
  vcScheduledDate?: string;
  vcScheduledTime?: string;
};

type LeadStatusModalProps = {
  open: boolean;
  leadName: string;
  status: string;
  initialProject?: string;
  initialLocation?: string;
  onClose: () => void;
  onSave: (payload: StatusUpdatePayload) => void;
};

export function LeadStatusModal({
  open,
  leadName,
  status,
  initialProject = "",
  initialLocation = "",
  onClose,
  onSave,
}: LeadStatusModalProps) {
  const [remark, setRemark] = useState("");
  const [project, setProject] = useState(initialProject);
  const [location, setLocation] = useState(initialLocation);
  const [vcDate, setVcDate] = useState("");
  const [vcTime, setVcTime] = useState("11:00");

  useEffect(() => {
    if (open) {
      setRemark("");
      setProject(initialProject);
      setLocation(initialLocation);
      setVcDate("");
      setVcTime("11:00");
    }
  }, [open, initialProject, initialLocation]);

  if (!open) return null;

  const cfg = getStatusConfig(status);
  const isVc = status === "VC_SCHEDULED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Update Status</p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{leadName}</h3>
            <span className={cn("mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold", cfg.bgLight, cfg.textColor)}>
              {cfg.label}
            </span>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Project</label>
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. Sky Heights"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Pune - Hinjewadi"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
          {isVc && (
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
              <div>
                <label className="text-xs font-semibold text-sky-800">VC Date *</label>
                <input
                  type="date"
                  value={vcDate}
                  onChange={(e) => setVcDate(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-sky-200 px-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-sky-800">VC Time *</label>
                <input
                  type="time"
                  value={vcTime}
                  onChange={(e) => setVcTime(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-sky-200 px-2 text-sm outline-none"
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-600">Remark / Call Notes</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              placeholder="What was discussed? Customer response..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (isVc && !vcDate) return;
              onSave({
                status,
                remark,
                trackingProject: project,
                trackingLocation: location,
                vcScheduledDate: isVc ? vcDate : undefined,
                vcScheduledTime: isVc ? vcTime : undefined,
              });
            }}
            className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
          >
            Save Update
          </button>
        </div>
      </div>
    </div>
  );
}
