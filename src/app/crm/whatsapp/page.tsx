"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Send, CheckCheck, Eye, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CAMPAIGN_STATUS_LABELS, pct } from "@/lib/whatsapp/constants";
import { cn } from "@/lib/utils";

interface DashboardData {
  stats: {
    totalContacts: number;
    messagesSent: number;
    delivered: number;
    read: number;
    failed: number;
    deliveryRate: string;
    readRate: string;
    creditsRemaining: number;
    creditsTotal: number;
    demoMode: boolean;
  };
  recentCampaigns: {
    id: string;
    name: string;
    date: string;
    recipients: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    status: string;
  }[];
}

function StatCard({
  label, value, sub, icon: Icon, accent,
}: {
  label: string; value: string | number; sub?: string;
  icon: typeof Users; accent: "green" | "emerald" | "teal" | "red" | "slate";
}) {
  const colors = {
    green: "from-green-500/10 text-green-600 bg-green-100",
    emerald: "from-emerald-500/10 text-emerald-600 bg-emerald-100",
    teal: "from-teal-500/10 text-teal-600 bg-teal-100",
    red: "from-red-500/10 text-red-600 bg-red-100",
    slate: "from-slate-500/10 text-slate-600 bg-slate-100",
  }[accent];

  return (
    <div className="crm-card relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5">
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-70", colors.split(" ")[0])} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-slate-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", colors.split(" ").slice(1).join(" "))}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/whatsapp/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-green-200 border-t-green-600" />
        <p className="mt-3 text-sm text-slate-500">Loading WhatsApp dashboard...</p>
      </div>
    );
  }

  if (!data) return null;
  const { stats, recentCampaigns } = data;

  return (
    <div className="space-y-6">
      {stats.demoMode && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Demo Mode — Provider baad mein connect karein</p>
            <p className="mt-0.5 text-xs text-amber-800">
              Abhi messages simulate ho rahe hain. Jab Interakt / WATI / Meta choose karo,{" "}
              <Link href="/crm/whatsapp/settings" className="font-semibold underline">API & Settings</Link> se connect kar dena.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Contacts" value={stats.totalContacts.toLocaleString("en-IN")} sub="CRM leads" icon={Users} accent="slate" />
        <StatCard label="Messages Sent" value={stats.messagesSent.toLocaleString("en-IN")} icon={Send} accent="green" />
        <StatCard label="Delivered" value={stats.delivered.toLocaleString("en-IN")} sub={stats.deliveryRate} icon={CheckCheck} accent="emerald" />
        <StatCard label="Read" value={stats.read.toLocaleString("en-IN")} sub={stats.readRate} icon={Eye} accent="teal" />
        <StatCard label="Failed" value={stats.failed.toLocaleString("en-IN")} icon={XCircle} accent="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Campaigns</h3>
            <Link href="/crm/whatsapp/campaigns" className="text-sm font-semibold text-green-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4 font-semibold">Campaign</th>
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 pr-4 font-semibold">Recipients</th>
                  <th className="pb-3 pr-4 font-semibold">Delivered</th>
                  <th className="pb-3 pr-4 font-semibold">Read</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No campaigns yet.{" "}
                      <Link href="/crm/whatsapp/campaigns/new" className="font-semibold text-green-600">Create your first blast</Link>
                    </td>
                  </tr>
                ) : (
                  recentCampaigns.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-900">{c.name}</td>
                      <td className="py-3 pr-4 text-slate-500">{new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                      <td className="py-3 pr-4">{c.recipients.toLocaleString("en-IN")}</td>
                      <td className="py-3 pr-4">{pct(c.delivered, c.sent || c.recipients)}</td>
                      <td className="py-3 pr-4">{pct(c.read, c.sent || c.recipients)}</td>
                      <td className="py-3">
                        <Badge variant={c.status === "COMPLETED" ? "success" : c.status === "FAILED" ? "danger" : "default"}>
                          {CAMPAIGN_STATUS_LABELS[c.status] ?? c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
          <h3 className="mb-4 font-bold text-slate-900">Credits</h3>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-500">Remaining</span>
            <span className="font-bold text-green-700">{stats.creditsRemaining.toLocaleString("en-IN")}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E]"
              style={{ width: `${Math.min(100, (stats.creditsRemaining / stats.creditsTotal) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {stats.creditsRemaining.toLocaleString("en-IN")} / {stats.creditsTotal.toLocaleString("en-IN")} credits
          </p>
          <div className="mt-6 space-y-2">
            <Link href="/crm/whatsapp/campaigns/new" className="block rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 hover:bg-green-100">
              + New Campaign
            </Link>
            <Link href="/crm/whatsapp/contacts" className="block rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Manage Contacts
            </Link>
            <Link href="/crm/whatsapp/templates" className="block rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Message Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
