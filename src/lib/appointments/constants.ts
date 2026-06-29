export const APPOINTMENT_TYPES = [
  { value: "PROPERTY_SHOWING", label: "Property Showing", icon: "Calendar", bg: "bg-violet-100", color: "text-violet-600", dot: "bg-violet-500" },
  { value: "CLIENT_MEETING", label: "Client Meeting", icon: "Users", bg: "bg-indigo-100", color: "text-indigo-600", dot: "bg-indigo-500" },
  { value: "FOLLOW_UP_CALL", label: "Follow-up Call", icon: "Phone", bg: "bg-emerald-100", color: "text-emerald-600", dot: "bg-emerald-500" },
  { value: "DOCUMENT_SIGNING", label: "Document Signing", icon: "FileText", bg: "bg-amber-100", color: "text-amber-600", dot: "bg-amber-500" },
  { value: "OTHER", label: "Other", icon: "CalendarCheck", bg: "bg-slate-100", color: "text-slate-600", dot: "bg-slate-400" },
] as const;

export type AppointmentTypeValue = (typeof APPOINTMENT_TYPES)[number]["value"];

const TYPE_MAP = Object.fromEntries(APPOINTMENT_TYPES.map((t) => [t.value, t]));

export function typeLabel(type: string) {
  return TYPE_MAP[type]?.label ?? type.replace(/_/g, " ");
}

export function typeStyle(type: string) {
  return TYPE_MAP[type] ?? TYPE_MAP.OTHER;
}

export function appointmentTiming(startTime: string | Date, endTime?: string | Date | null): "ongoing" | "upcoming" | "past" {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : start + 60 * 60 * 1000;
  if (now >= start && now <= end) return "ongoing";
  if (start > now) return "upcoming";
  return "past";
}

export function formatAppointmentTime(startTime: string | Date, endTime?: string | Date | null) {
  const start = new Date(startTime);
  const startStr = start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (!endTime) return startStr;
  const end = new Date(endTime);
  const endStr = end.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return `${startStr} – ${endStr}`;
}

export function dateGroupLabel(date: string | Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff <= 6) return d.toLocaleDateString("en-IN", { weekday: "long" });
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
}
