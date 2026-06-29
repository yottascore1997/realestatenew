export const PROJECT_STATUS = [
  { value: "PLANNING", label: "Planning", color: "bg-slate-100 text-slate-700", bar: "bg-slate-400" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction", color: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
  { value: "READY_TO_MOVE", label: "Ready to Move", color: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" },
  { value: "COMPLETED", label: "Completed", color: "bg-violet-100 text-violet-700", bar: "bg-violet-500" },
] as const;

export const STATUS_MAP = Object.fromEntries(PROJECT_STATUS.map((s) => [s.value, s]));

export function statusLabel(status: string) {
  return STATUS_MAP[status]?.label ?? status.replace(/_/g, " ");
}

export function statusColor(status: string) {
  return STATUS_MAP[status]?.color ?? "bg-slate-100 text-slate-600";
}
