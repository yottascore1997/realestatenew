"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Calendar, MapPin, Video, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ReminderItem = {
  id: string;
  fullName: string;
  type: "follow_up" | "vc" | "site_visit";
  label: string;
  date: string;
  time?: string | null;
  project?: string | null;
  location?: string | null;
  when: "today" | "tomorrow";
};

export function LeadRemindersBanner() {
  const [items, setItems] = useState<ReminderItem[]>([]);

  useEffect(() => {
    fetch("/api/leads/reminders")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  const today = items.filter((i) => i.when === "today");
  const tomorrow = items.filter((i) => i.when === "tomorrow");

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 crm-card">
      <div className="mb-3 flex items-center gap-2">
        <Bell className="h-5 w-5 text-amber-600" />
        <h3 className="font-bold text-amber-900">Don&apos;t Miss — Follow-ups & Visits</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {today.length > 0 && (
          <ReminderGroup title="Today" urgent items={today} />
        )}
        {tomorrow.length > 0 && (
          <ReminderGroup title="Tomorrow" items={tomorrow} />
        )}
      </div>
    </div>
  );
}

function ReminderGroup({ title, items, urgent }: { title: string; items: ReminderItem[]; urgent?: boolean }) {
  return (
    <div className={cn("rounded-xl border bg-white/80 p-3", urgent ? "border-red-200" : "border-amber-100")}>
      <p className={cn("mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide", urgent ? "text-red-700" : "text-amber-800")}>
        {urgent && <AlertTriangle className="h-3.5 w-3.5" />}
        {title} ({items.length})
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={`${item.id}-${item.type}`}>
            <Link
              href={`/crm/leads/${item.id}`}
              className="flex items-start gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-sm transition-colors hover:border-violet-200 hover:bg-violet-50/50"
            >
              {item.type === "vc" ? (
                <Video className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              ) : item.type === "site_visit" ? (
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
              ) : (
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{item.fullName}</p>
                <p className="text-xs text-slate-600">{item.label}</p>
                <p className="mt-0.5 text-xs font-medium text-violet-700">
                  {format(new Date(item.date), "dd MMM")}
                  {item.time ? ` · ${item.time}` : ""}
                </p>
                {(item.project || item.location) && (
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                    {[item.project, item.location].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
