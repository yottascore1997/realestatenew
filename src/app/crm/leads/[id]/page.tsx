"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Phone, MessageCircle, Calendar, FileText, MapPin, Upload, Send, Clock, User, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeadTimeline } from "@/components/leads/lead-timeline";
import { getStatusConfig, getSourceLabel, getPriorityConfig, getTemperatureConfig, LEAD_PIPELINE } from "@/lib/leads/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { LeadActivity } from "@/lib/leads/types";

const tabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "timeline", label: "Timeline", icon: Clock },
  { key: "followups", label: "Follow-ups", icon: Calendar },
  { key: "calls", label: "Call Notes", icon: Phone },
  { key: "visits", label: "Site Visits", icon: MapPin },
  { key: "documents", label: "Documents", icon: FileText },
];

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((data) => { setLead(data); setStatus(data.status); })
      .catch(() => setLead(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#4F6BF5]" /></div>;
  if (!lead) return <div className="py-20 text-center"><p className="text-slate-500">Lead not found</p><Link href="/crm/leads"><Button className="mt-4">Back</Button></Link></div>;

  const statusCfg = getStatusConfig(status);
  const priority = getPriorityConfig(lead.priority as string);
  const temp = getTemperatureConfig(lead.temperature as string);
  const tags = (lead.tags as string[]) ?? [];
  const activities = (lead.activities as LeadActivity[]) ?? [];
  const followUps = (lead.followUps as Record<string, unknown>[]) ?? [];
  const callNotes = (lead.callNotes as Record<string, unknown>[]) ?? [];
  const siteVisits = (lead.siteVisits as Record<string, unknown>[]) ?? [];
  const documents = (lead.documents as Record<string, unknown>[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/crm/leads" className="rounded-xl border border-slate-200 p-2.5 shadow-sm hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /></Link>
          <img src={(lead.avatar as string) ?? `https://i.pravatar.cc/150?u=${lead.mobile}`} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{lead.fullName as string}</h2>
            <p className="text-sm text-slate-500">{lead.mobile as string} {lead.email && `· ${lead.email}`}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusCfg.bgLight, statusCfg.textColor)}>{statusCfg.label}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", priority.color)}>{priority.icon} {priority.label}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", temp.color)}>{temp.icon} {temp.label}</span>
              {tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{tag}</span>)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`tel:${lead.mobile}`}><Button variant="outline" size="sm"><Phone className="h-4 w-4" /> Call</Button></a>
          <a href={`https://wa.me/91${lead.whatsapp ?? lead.mobile}`} target="_blank" rel="noreferrer"><Button variant="outline" size="sm"><MessageCircle className="h-4 w-4" /> WhatsApp</Button></a>
          <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm">
            {LEAD_PIPELINE.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={cn("flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium",
                  activeTab === tab.key ? "border-[#4F6BF5] text-[#4F6BF5]" : "border-transparent text-slate-500")}>
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>
          <Card>
            {activeTab === "overview" && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <InfoItem label="Source" value={getSourceLabel(lead.source as string)} />
                <InfoItem label="City" value={lead.city as string} />
                <InfoItem label="Occupation" value={lead.occupation as string} />
                <InfoItem label="Property Type" value={lead.propertyType as string} />
                <InfoItem label="Project" value={(lead.project as {name:string})?.name ?? lead.projectName as string} />
                <InfoItem label="Budget" value={lead.budget as string} />
                <InfoItem label="BHK" value={lead.bhk as string} />
                <InfoItem label="Agent" value={(lead.agent as {name:string})?.name ?? lead.agentName as string} />
              </div>
            )}
            {activeTab === "timeline" && <LeadTimeline activities={activities} />}
            {activeTab === "followups" && followUps.map((f) => (
              <div key={f.id as string} className="mb-3 rounded-xl border p-3">
                <p className="font-medium">{f.type as string} — {format(new Date(f.scheduledDate as string), "dd MMM yyyy")} {f.scheduledTime as string}</p>
                <p className="text-sm text-slate-500">{f.notes as string}</p>
              </div>
            ))}
            {activeTab === "calls" && callNotes.map((n) => (
              <div key={n.id as string} className="mb-3 rounded-xl border p-4">
                <p className="text-sm">{n.content as string}</p>
                <p className="mt-2 text-xs text-slate-400">{n.agentName as string} · {format(new Date(n.createdAt as string), "dd MMM yyyy")}</p>
              </div>
            ))}
            {activeTab === "visits" && siteVisits.map((v) => (
              <div key={v.id as string} className="mb-3 rounded-xl border p-4">
                <p className="font-medium">{v.projectName as string}</p>
                <p className="text-sm text-slate-500">{format(new Date(v.visitDate as string), "dd MMM yyyy")} · {v.status as string}</p>
              </div>
            ))}
            {activeTab === "documents" && (documents.length ? documents.map((d) => (
              <div key={d.id as string} className="mb-2 flex items-center gap-3 rounded-lg border p-3">
                <FileText className="h-5 w-5 text-slate-400" />
                <div><p className="font-medium">{d.name as string}</p><p className="text-xs text-slate-400">{d.type as string}</p></div>
              </div>
            )) : <p className="py-8 text-center text-sm text-slate-500">No documents uploaded</p>)}
          </Card>
        </div>
        <Card className="h-fit">
          <h3 className="mb-3 font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start"><Send className="h-4 w-4" /> Send Brochure</Button>
            <Button variant="outline" size="sm" className="w-full justify-start"><MapPin className="h-4 w-4" /> Send Location</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return <div><p className="text-xs text-slate-500">{label}</p><p className="text-sm font-medium text-slate-900">{value ?? "—"}</p></div>;
}
