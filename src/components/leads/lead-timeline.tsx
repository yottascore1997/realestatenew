"use client";

import type { LeadActivity } from "@/lib/leads/types";
import { format } from "date-fns";
import {
  UserPlus, UserCheck, Phone, ArrowRight, Calendar, MapPin, Handshake, CheckCircle, XCircle, FileText, MessageCircle,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LEAD_CREATED: UserPlus,
  ASSIGNED: UserCheck,
  CALL: Phone,
  STATUS_CHANGE: ArrowRight,
  FOLLOW_UP: Calendar,
  SITE_VISIT: MapPin,
  NEGOTIATION: Handshake,
  BOOKED: CheckCircle,
  LOST: XCircle,
  NOTE: FileText,
  WHATSAPP: MessageCircle,
  DOCUMENT: FileText,
  PAYMENT: CheckCircle,
};

export function LeadTimeline({ activities }: { activities: LeadActivity[] }) {
  if (!activities.length) {
    return <p className="py-8 text-center text-sm text-slate-500">No activity yet</p>;
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-slate-200" />
      {activities.map((activity) => {
        const Icon = iconMap[activity.type] ?? ArrowRight;
        return (
          <div key={activity.id} className="relative flex gap-4 pb-6">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-[#4F6BF5]">
              <Icon className="h-4 w-4 text-[#4F6BF5]" />
            </div>
            <div className="flex-1 pt-1">
              <p className="font-medium text-slate-900">{activity.title}</p>
              {activity.description && (
                <p className="mt-0.5 text-sm text-slate-500">{activity.description}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {activity.userName && `${activity.userName} · `}
                {format(new Date(activity.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
