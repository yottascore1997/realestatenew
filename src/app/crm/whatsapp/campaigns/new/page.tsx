"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Send, Users, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessagePreview } from "@/components/whatsapp/message-preview";
import { ContactImportPanel } from "@/components/whatsapp/contact-import-panel";
import type { ImportedContact } from "@/lib/whatsapp/types";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  body: string;
  header: string | null;
  footer: string | null;
  status: string;
}

const STEPS = ["Recipients", "Message", "Preview", "Send"];
type RecipientMode = "crm" | "file";

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("crm");
  const [crmCount, setCrmCount] = useState(0);
  const [importedContacts, setImportedContacts] = useState<ImportedContact[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    templateId: "",
    messageBody: `Hi {{name}}, 👋

We are excited to launch our new premium residential project in {{location}}.

🏡 2 & 3 BHK Luxury Apartments
📍 Prime location with excellent connectivity
💰 Special launch offer — limited period

Reply YES to schedule a site visit or call us for more details.

— Team Triyards`,
    city: "",
    status: "",
    temperature: "",
    sendNow: true,
  });

  const recipientCount = recipientMode === "file" ? importedContacts.length : crmCount;

  useEffect(() => {
    fetch("/api/whatsapp/templates").then((r) => r.json()).then(setTemplates);
  }, []);

  useEffect(() => {
    if (recipientMode !== "crm") return;
    const params = new URLSearchParams();
    if (form.city) params.set("city", form.city);
    if (form.status) params.set("status", form.status);
    if (form.temperature) params.set("temperature", form.temperature);
    fetch(`/api/whatsapp/contacts?${params}`)
      .then((r) => r.json())
      .then((d) => setCrmCount(d.total));
  }, [form.city, form.status, form.temperature, recipientMode]);

  const applyTemplate = (id: string) => {
    const t = templates.find((x) => x.id === id);
    if (t) {
      setForm((f) => ({
        ...f,
        templateId: id,
        messageBody: t.body,
      }));
    }
  };

  const submit = async () => {
    setError("");
    setSending(true);
    try {
      const payload =
        recipientMode === "file"
          ? {
              name: form.name || `Import Blast ${new Date().toLocaleDateString("en-IN")}`,
              templateId: form.templateId || undefined,
              messageBody: form.messageBody,
              sendNow: form.sendNow,
              importedContacts,
              recipientFilter: { fileName: importFileName },
            }
          : {
              name: form.name || `Campaign ${new Date().toLocaleDateString("en-IN")}`,
              templateId: form.templateId || undefined,
              messageBody: form.messageBody,
              sendNow: form.sendNow,
              recipientFilter: {
                city: form.city || undefined,
                status: form.status || undefined,
                temperature: form.temperature || undefined,
              },
            };

      const res = await fetch("/api/whatsapp/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create campaign");
      router.push("/crm/whatsapp/campaigns");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Create New Campaign</h3>
        <p className="text-sm text-slate-500">CRM leads ya Excel/CSV upload — dono se blast kar sakte ho</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              step === i
                ? "bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white"
                : i < step
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="crm-card space-y-4 rounded-2xl border border-slate-100 bg-white p-5">
          {step === 0 && (
            <>
              <h4 className="font-semibold text-slate-900">Select Recipients</h4>
              <Input
                placeholder="Campaign name e.g. New Project Launch - Mumbai"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setRecipientMode("crm")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    recipientMode === "crm" ? "bg-white text-green-800 shadow-sm" : "text-slate-600",
                  )}
                >
                  <Users className="h-4 w-4" /> CRM Leads
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientMode("file")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    recipientMode === "file" ? "bg-white text-green-800 shadow-sm" : "text-slate-600",
                  )}
                >
                  <FileSpreadsheet className="h-4 w-4" /> Excel / CSV
                </button>
              </div>

              {recipientMode === "crm" ? (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">City</label>
                      <Input placeholder="All cities" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">Status</label>
                      <select
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                      >
                        <option value="">All statuses</option>
                        {["NEW", "CONTACTED", "INTERESTED", "FOLLOW_UP", "NEGOTIATION"].map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">Temperature</label>
                      <select
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        value={form.temperature}
                        onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                      >
                        <option value="">All</option>
                        <option value="HOT">Hot</option>
                        <option value="WARM">Warm</option>
                        <option value="COLD">Cold</option>
                      </select>
                    </div>
                  </div>
                  <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
                    <strong>{crmCount.toLocaleString("en-IN")}</strong> CRM contacts match your filters
                  </div>
                </>
              ) : (
                <ContactImportPanel
                  contacts={importedContacts}
                  onContactsChange={(contacts, meta) => {
                    setImportedContacts(contacts);
                    setImportFileName(meta.fileName);
                  }}
                />
              )}
            </>
          )}

          {step === 1 && (
            <>
              <h4 className="font-semibold text-slate-900">Compose Message</h4>
              {templates.length > 0 && (
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={form.templateId}
                  onChange={(e) => applyTemplate(e.target.value)}
                >
                  <option value="">Choose a template...</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.status})</option>
                  ))}
                </select>
              )}
              <Textarea
                rows={12}
                value={form.messageBody}
                onChange={(e) => setForm({ ...form, messageBody: e.target.value })}
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500">
                Variables: {"{{name}}"}, {"{{project}}"}, {"{{location}}"}, {"{{city}}"}
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h4 className="font-semibold text-slate-900">Preview & Confirm</h4>
              <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
                <p><span className="text-slate-500">Campaign:</span> <strong>{form.name || "Untitled"}</strong></p>
                <p><span className="text-slate-500">Source:</span> <strong>{recipientMode === "file" ? "Excel / CSV import" : "CRM leads"}</strong></p>
                <p><span className="text-slate-500">Recipients:</span> <strong>{recipientCount.toLocaleString("en-IN")}</strong></p>
                <p><span className="text-slate-500">Mode:</span> <strong>Demo (simulated send)</strong></p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.sendNow}
                  onChange={(e) => setForm({ ...form, sendNow: e.target.checked })}
                  className="rounded border-slate-300"
                />
                Send immediately after create
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <h4 className="font-semibold text-slate-900">Ready to Blast 🚀</h4>
              <p className="text-sm text-slate-600">
                {recipientCount.toLocaleString("en-IN")} contacts ko message jayega.
                {recipientMode === "file" && " Imported list se direct blast — CRM mein lead banana zaroori nahi."}
              </p>
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <Button
                className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110"
                disabled={sending || recipientCount === 0}
                onClick={submit}
              >
                <Send className="h-4 w-4" />
                {sending ? "Sending..." : `Send to ${recipientCount.toLocaleString("en-IN")} contacts`}
              </Button>
            </>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < 3 && (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && recipientCount === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
          <h4 className="mb-4 text-center text-sm font-semibold text-slate-500">Message Preview</h4>
          <MessagePreview
            body={form.messageBody}
            sampleVars={
              recipientMode === "file" && importedContacts[0]
                ? {
                    name: importedContacts[0].fullName.split(" ")[0],
                    city: importedContacts[0].city ?? "Pune",
                    location: importedContacts[0].city ?? "Pune",
                    project: "Royal Gardens",
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
