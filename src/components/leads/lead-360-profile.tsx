"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, Building2,
  FileText, Handshake, Star, CheckCircle2, AlertCircle, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeadTimeline } from "@/components/leads/lead-timeline";
import { getStatusConfig, getSourceLabel, LEAD_PIPELINE } from "@/lib/leads/constants";
import { parseProfileMeta, formatLeadCode } from "@/lib/leads/lead-360-types";
import { formatINR, cn } from "@/lib/utils";
import type { LeadActivity } from "@/lib/leads/types";

type PaymentSchedule = {
  id: string;
  label: string;
  amount: number | string;
  status: string;
  dueDate?: string;
  paidDate?: string | null;
};

type Lead360Data = Record<string, unknown> & {
  id: string;
  leadCode?: string | null;
  fullName: string;
  mobile: string;
  email?: string | null;
  status: string;
  budget?: string | null;
  budgetMax?: number | string | null;
  bhk?: string | null;
  preferredLocation?: string | null;
  city?: string | null;
  source: string;
  createdAt: string;
  agentName?: string | null;
  projectName?: string | null;
  profileMeta?: unknown;
  activities?: LeadActivity[];
  followUps?: Record<string, unknown>[];
  callNotes?: Record<string, unknown>[];
  siteVisits?: Record<string, unknown>[];
  documents?: Record<string, unknown>[];
  bookings?: {
    id: string;
    bookingNumber: string;
    status: string;
    bookingDate: string;
    totalAmount: number | string;
    paymentSchedules?: PaymentSchedule[];
  }[];
};

function SectionCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <Icon className="h-4 w-4 text-[#4F6BF5]" />
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function CheckItem({ label, done = true }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
      )}
      <span className={done ? "text-slate-700" : "text-slate-500"}>{label}</span>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
        />
      ))}
    </div>
  );
}

export function Lead360Profile({
  lead,
  onStatusChange,
}: {
  lead: Lead360Data;
  onStatusChange: (status: string) => void;
}) {
  const meta = parseProfileMeta(lead.profileMeta);
  const statusCfg = getStatusConfig(lead.status);
  const activities = (lead.activities ?? []) as LeadActivity[];
  const followUps = lead.followUps ?? [];
  const callNotes = lead.callNotes ?? [];
  const siteVisits = lead.siteVisits ?? [];
  const documents = lead.documents ?? [];
  const booking = lead.bookings?.[0];
  const bookingMeta = meta.booking;
  const completedFollowUps = followUps.filter((f) => f.completed).length;
  const upcomingFollowUps = followUps.filter((f) => !f.completed).length;
  const totalCallMins = callNotes.reduce((s, n) => s + (Number(n.duration) || 0), 0);
  const lastVisit = siteVisits[0];
  const paidTotal = booking?.paymentSchedules
    ?.filter((p) => p.status === "PAID")
    .reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const pendingTotal = booking?.paymentSchedules
    ?.filter((p) => p.status !== "PAID")
    .reduce((s, p) => s + Number(p.amount), 0) ?? 0;

  const flatLabel = bookingMeta?.flat
    ? `${bookingMeta.tower ? `${bookingMeta.tower}-` : ""}${bookingMeta.flat}`
    : (lastVisit?.flatNumber as string) ?? "—";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/crm/leads" className="mt-1 rounded-xl border border-slate-200 p-2.5 shadow-sm hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4F6BF5]">
              {formatLeadCode(lead.leadCode, lead.id)}
            </p>
            <h1 className="text-2xl font-bold text-slate-900">{lead.fullName}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{lead.mobile}</span>
              {lead.email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{lead.email}</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusCfg.bgLight, statusCfg.textColor)}>
                {statusCfg.label}
              </span>
              {lead.budget && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">Budget: {lead.budget}</span>}
              {(bookingMeta?.project || lead.projectName) && (
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                  {bookingMeta?.project ?? lead.projectName}
                </span>
              )}
              {flatLabel !== "—" && (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">Flat: {flatLabel}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a href={`tel:${lead.mobile}`}><Button variant="outline" size="sm"><Phone className="h-4 w-4" /> Call</Button></a>
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm"
          >
            {LEAD_PIPELINE.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Summary strip */}
      <Card className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 lg:grid-cols-7">
        <SummaryCell label="Lead ID" value={formatLeadCode(lead.leadCode, lead.id)} />
        <SummaryCell label="Looking For" value={lead.bhk ?? "—"} />
        <SummaryCell label="Location" value={[lead.preferredLocation, lead.city].filter(Boolean).join(", ") || "—"} />
        <SummaryCell label="Source" value={getSourceLabel(lead.source)} />
        <SummaryCell label="Created" value={format(new Date(lead.createdAt), "dd MMM yyyy")} />
        <SummaryCell label="Assigned" value={lead.agentName ?? "—"} />
        <SummaryCell label="Budget" value={lead.budgetMax ? formatINR(Number(lead.budgetMax)) : (lead.budget ?? "—")} />
      </Card>

      {/* 360 grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard title="Lead Details" icon={User}>
          <div className="space-y-2 text-sm">
            <Row label="Source" value={getSourceLabel(lead.source)} />
            <Row label="Created On" value={format(new Date(lead.createdAt), "dd MMM yyyy")} />
            <Row label="Assigned Executive" value={lead.agentName} />
            <Row label="Interested In" value={lead.bhk} />
            <Row label="Location" value={[lead.preferredLocation, lead.city].filter(Boolean).join(" - ")} />
          </div>
        </SectionCard>

        <SectionCard title="Follow-ups" icon={Calendar}>
          <div className="space-y-2">
            <p className="text-sm"><CheckItem label={`${completedFollowUps} Completed`} /><span className="ml-6 block mt-1"><CheckItem label={`${upcomingFollowUps} Upcoming`} done={upcomingFollowUps > 0} /></span></p>
            {followUps.slice(0, 3).map((f) => (
              <div key={f.id as string} className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs">
                <p className="font-medium text-slate-800">{f.type as string} · {format(new Date(f.scheduledDate as string), "dd MMM")} {f.scheduledTime as string}</p>
                <p className="text-slate-500">{f.notes as string}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Calls" icon={Phone}>
          <p className="mb-2 text-sm font-semibold text-slate-800">{callNotes.length} Calls · {totalCallMins} Minutes</p>
          {callNotes.slice(0, 2).map((n) => (
            <div key={n.id as string} className="mb-2 rounded-lg border border-slate-100 p-3 text-xs">
              <div className="flex flex-wrap gap-2 text-slate-600">
                <span>{n.connected !== false ? "✔ Connected" : "Not Connected"}</span>
                {n.duration != null && <span>· {n.duration as number} min</span>}
              </div>
              <p className="mt-1 text-slate-700">{(n.discussion as string) || (n.content as string)}</p>
              <p className="mt-1 text-slate-400">{format(new Date(n.createdAt as string), "dd MMM yyyy")}</p>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Site Visit" icon={MapPin}>
          {lastVisit ? (
            <div className="space-y-2 text-sm">
              <Row label="Date" value={`${format(new Date(lastVisit.visitDate as string), "dd MMM yyyy")}${lastVisit.visitTime ? ` · ${lastVisit.visitTime}` : ""}`} />
              <Row label="Project" value={(lastVisit.projectName as string) ?? bookingMeta?.project} />
              <Row label="Flat" value={(lastVisit.flatNumber as string) ?? flatLabel} />
              {lastVisit.rating != null && <div className="pt-1"><Stars rating={Number(lastVisit.rating)} /></div>}
              {(lastVisit.likedPoints as string[])?.length > 0 && (
                <div className="pt-1">
                  <p className="text-xs font-semibold text-emerald-700">Liked</p>
                  {(lastVisit.likedPoints as string[]).map((p) => <CheckItem key={p} label={p} />)}
                </div>
              )}
              {(lastVisit.dislikedPoints as string[])?.length > 0 && (
                <div className="pt-1">
                  <p className="text-xs font-semibold text-rose-700">Didn&apos;t Like</p>
                  {(lastVisit.dislikedPoints as string[]).map((p) => <CheckItem key={p} label={p} done={false} />)}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No site visit recorded</p>
          )}
        </SectionCard>

        <SectionCard title="Documents" icon={FileText}>
          <div className="space-y-1.5">
            {(meta.documentsSent ?? []).map((d) => <CheckItem key={d} label={d} />)}
            {documents.map((d) => (
              <CheckItem key={d.id as string} label={d.name as string} />
            ))}
            {!documents.length && !meta.documentsSent?.length && (
              <p className="text-sm text-slate-500">No documents yet</p>
            )}
          </div>
        </SectionCard>

        {meta.negotiation && (
          <SectionCard title="Negotiation" icon={Handshake}>
            <div className="space-y-2 text-sm">
              <Row label="Builder Price" value={meta.negotiation.builderPrice ? formatINR(meta.negotiation.builderPrice) : undefined} />
              <Row label="Customer Wants" value={meta.negotiation.customerWants ? formatINR(meta.negotiation.customerWants) : undefined} />
              <Row label="Final Offer" value={meta.negotiation.finalOffer ? formatINR(meta.negotiation.finalOffer) : undefined} />
              {meta.negotiation.managerApprovalPending && (
                <p className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">Manager Approval Pending</p>
              )}
            </div>
          </SectionCard>
        )}

        <SectionCard title="Booking" icon={Building2}>
          {booking || bookingMeta ? (
            <div className="space-y-2 text-sm">
              <Row label="Project" value={bookingMeta?.project ?? lead.projectName} />
              <Row label="Tower / Floor / Flat" value={[bookingMeta?.tower, bookingMeta?.floor, bookingMeta?.flat].filter(Boolean).join(" · ")} />
              <Row label="Parking" value={bookingMeta?.parking} />
              <Row label="Booking Date" value={bookingMeta?.bookingDate ? format(new Date(bookingMeta.bookingDate), "dd MMM yyyy") : booking ? format(new Date(booking.bookingDate), "dd MMM yyyy") : undefined} />
              <Row label="Amount" value={bookingMeta?.bookingAmount ? formatINR(bookingMeta.bookingAmount) : booking ? formatINR(Number(booking.totalAmount)) : undefined} />
              <Row label="Status" value={bookingMeta?.status ?? booking?.status} />
              {bookingMeta?.tokenAmount && (
                <>
                  <Row label="Token Paid" value={formatINR(bookingMeta.tokenAmount)} />
                  <Row label="Transaction ID" value={bookingMeta.tokenTxnId} />
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Not booked yet</p>
          )}
        </SectionCard>

        <SectionCard title="Payments" icon={Clock} className="md:col-span-2 xl:col-span-1">
          {(booking?.paymentSchedules?.length ?? 0) > 0 ? (
            <div className="space-y-3">
              <div className="flex gap-4 text-sm">
                <div><p className="text-xs text-slate-500">Paid</p><p className="font-bold text-emerald-700">{formatINR(paidTotal)}</p></div>
                <div><p className="text-xs text-slate-500">Pending</p><p className="font-bold text-amber-700">{formatINR(pendingTotal)}</p></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="border-b text-left text-slate-500"><th className="pb-2 pr-2">Installment</th><th className="pb-2 pr-2">Amount</th><th className="pb-2">Status</th></tr></thead>
                  <tbody>
                    {booking!.paymentSchedules!.map((p) => (
                      <tr key={p.id} className="border-b border-slate-50">
                        <td className="py-2 pr-2 font-medium text-slate-800">{p.label}</td>
                        <td className="py-2 pr-2">{formatINR(Number(p.amount))}</td>
                        <td className="py-2">
                          <span className={cn("rounded-full px-2 py-0.5 font-semibold", p.status === "PAID" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                            {p.status === "PAID" ? "✅ Paid" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No payment schedule</p>
          )}
        </SectionCard>

        {meta.construction && (
          <SectionCard title="Construction Updates" icon={Building2}>
            <div className="space-y-2">
              {meta.construction.updates?.map((u) => (
                <CheckItem key={u.title} label={u.title} done={u.done !== false} />
              ))}
              {meta.construction.possessionExpected && (
                <Row label="Possession Expected" value={meta.construction.possessionExpected} />
              )}
            </div>
          </SectionCard>
        )}

        {meta.possession && (
          <SectionCard title="Possession" icon={CheckCircle2}>
            <div className="space-y-2 text-sm">
              <Row label="Possession Date" value={meta.possession.date ? format(new Date(meta.possession.date), "dd MMM yyyy") : undefined} />
              <Row label="Keys Handed Over" value={meta.possession.keysHandedOver ? "Yes" : "No"} />
              {meta.possession.feedbackRating != null && <Stars rating={meta.possession.feedbackRating} />}
            </div>
          </SectionCard>
        )}
      </div>

      {/* Full timeline */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
          <Clock className="h-4 w-4 text-[#4F6BF5]" /> Activity Timeline
        </h3>
        <LeadTimeline activities={[...activities].reverse()} />
      </Card>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-50 pb-1.5 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value ?? "—"}</span>
    </div>
  );
}
