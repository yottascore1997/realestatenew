"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CAMPAIGN_STATUS_LABELS, pct } from "@/lib/whatsapp/constants";

interface Campaign {
  id: string;
  name: string;
  status: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  templateName: string | null;
  createdAt: string;
}

export default function WhatsAppCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  const load = () => {
    fetch("/api/whatsapp/campaigns")
      .then((r) => r.json())
      .then(setCampaigns)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resumeSend = async (id: string) => {
    setSending(id);
    await fetch(`/api/whatsapp/campaigns/${id}`, { method: "POST" });
    load();
    setSending(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Campaigns</h3>
          <p className="text-sm text-slate-500">Bulk WhatsApp blast history & status</p>
        </div>
        <Link href="/crm/whatsapp/campaigns/new">
          <Button className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110">
            <Plus className="h-4 w-4" /> New Campaign
          </Button>
        </Link>
      </div>

      <div className="crm-card overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {loading ? (
          <div className="py-16 text-center text-slate-500">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            No campaigns yet. <Link href="/crm/whatsapp/campaigns/new" className="font-semibold text-green-600">Create one</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Campaign</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Recipients</th>
                  <th className="px-5 py-3 font-semibold">Sent</th>
                  <th className="px-5 py-3 font-semibold">Delivered</th>
                  <th className="px-5 py-3 font-semibold">Read</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-t border-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{c.name}</p>
                      {c.templateName && <p className="text-xs text-slate-400">{c.templateName}</p>}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3">{c.totalRecipients}</td>
                    <td className="px-5 py-3">{c.sentCount}</td>
                    <td className="px-5 py-3">{pct(c.deliveredCount, c.sentCount || c.totalRecipients)}</td>
                    <td className="px-5 py-3">{pct(c.readCount, c.sentCount || c.totalRecipients)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={c.status === "COMPLETED" ? "success" : c.status === "FAILED" ? "danger" : "default"}>
                        {CAMPAIGN_STATUS_LABELS[c.status] ?? c.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      {["DRAFT", "SENDING", "SCHEDULED"].includes(c.status) && (
                        <button
                          type="button"
                          disabled={sending === c.id}
                          onClick={() => resumeSend(c.id)}
                          className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:underline disabled:opacity-50"
                        >
                          <Play className="h-3.5 w-3.5" /> {sending === c.id ? "Sending..." : "Send"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
