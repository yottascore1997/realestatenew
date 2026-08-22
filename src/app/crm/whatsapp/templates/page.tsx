"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TEMPLATE_STATUS_LABELS } from "@/lib/whatsapp/constants";
import { MessagePreview } from "@/components/whatsapp/message-preview";

interface Template {
  id: string;
  name: string;
  metaName: string | null;
  body: string;
  header: string | null;
  footer: string | null;
  status: string;
  category: string;
}

export default function WhatsAppTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<Template | null>(null);
  const [form, setForm] = useState({
    name: "",
    metaName: "",
    body: `Hi {{name}},

New launch at {{project}} in {{location}}!

🏡 Premium 2 & 3 BHK
📍 Excellent connectivity
💰 Limited period offer

Reply YES for site visit.

— Team Triyards`,
    header: "",
    footer: "Reply STOP to opt out",
    status: "DRAFT",
  });

  const load = () => fetch("/api/whatsapp/templates").then((r) => r.json()).then(setTemplates);
  useEffect(() => { load(); }, []);

  const save = async () => {
    await fetch("/api/whatsapp/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Templates</h3>
          <p className="text-sm text-slate-500">Message templates — Meta approval baad mein sync hoga</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" /> New Template
        </Button>
      </div>

      {showForm && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="crm-card space-y-3 rounded-2xl border border-slate-100 bg-white p-5">
            <Input placeholder="Template name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Meta template name (optional)" value={form.metaName} onChange={(e) => setForm({ ...form, metaName: e.target.value })} />
            <Input placeholder="Header (optional)" value={form.header} onChange={(e) => setForm({ ...form, header: e.target.value })} />
            <Textarea rows={10} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Input placeholder="Footer" value={form.footer} onChange={(e) => setForm({ ...form, footer: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={save} className="bg-green-600">Save Template</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
          <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
            <MessagePreview body={form.body} header={form.header} footer={form.footer} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setPreview(t)}
            className="crm-card rounded-2xl border border-slate-100 bg-white p-5 text-left transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h4 className="font-semibold text-slate-900">{t.name}</h4>
              <Badge variant={t.status === "APPROVED" ? "success" : "warning"}>
                {TEMPLATE_STATUS_LABELS[t.status] ?? t.status}
              </Badge>
            </div>
            <p className="line-clamp-4 text-sm text-slate-500">{t.body}</p>
          </button>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreview(null)}>
          <div className="max-w-sm rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h4 className="mb-4 font-bold">{preview.name}</h4>
            <MessagePreview body={preview.body} header={preview.header ?? undefined} footer={preview.footer ?? undefined} />
            <Button className="mt-4 w-full" variant="outline" onClick={() => setPreview(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
