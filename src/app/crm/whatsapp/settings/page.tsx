"use client";

import { useEffect, useState } from "react";
import { Save, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WHATSAPP_PROVIDERS } from "@/lib/whatsapp/constants";

interface Settings {
  id: string;
  provider: string;
  apiToken: string | null;
  phoneNumberId: string | null;
  businessAccountId: string | null;
  webhookVerifyToken: string | null;
  creditsTotal: number;
  creditsUsed: number;
  isConnected: boolean;
}

export default function WhatsAppSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState({
    provider: "NONE",
    apiToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    webhookVerifyToken: "",
    creditsTotal: 20000,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/whatsapp/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings(d);
        setForm({
          provider: d.provider ?? "NONE",
          apiToken: d.apiToken ?? "",
          phoneNumberId: d.phoneNumberId ?? "",
          businessAccountId: d.businessAccountId ?? "",
          webhookVerifyToken: d.webhookVerifyToken ?? "",
          creditsTotal: d.creditsTotal ?? 20000,
        });
      });
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/whatsapp/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setSettings(d);
    setSaving(false);
    setSaved(true);
  };

  if (!settings) return <div className="py-16 text-center text-slate-500">Loading settings...</div>;

  const demoMode = form.provider === "NONE" || !settings.isConnected;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">API & Settings</h3>
          <p className="text-sm text-slate-500">Provider baad mein choose karo — abhi demo mode chalega</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${demoMode ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
          {demoMode ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          {demoMode ? "Demo Mode" : "Connected"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="crm-card space-y-4 rounded-2xl border border-slate-100 bg-white p-5">
          <h4 className="font-semibold text-slate-900">Choose Provider</h4>
          <div className="space-y-2">
            {WHATSAPP_PROVIDERS.map((p) => (
              <label
                key={p.key}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  form.provider === p.key ? "border-green-500 bg-green-50" : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value={p.key}
                  checked={form.provider === p.key}
                  onChange={() => setForm({ ...form, provider: p.key })}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-slate-900">{p.label}</p>
                  <p className="text-xs text-slate-500">{p.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="crm-card space-y-4 rounded-2xl border border-slate-100 bg-white p-5">
          <h4 className="font-semibold text-slate-900">API Credentials</h4>
          <p className="text-xs text-slate-500">Jab provider decide ho, yahan token daal dena. Abhi khali chhod sakte ho.</p>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">API Token / Access Token</label>
            <Input
              type="password"
              placeholder="Save karne par masked dikhega"
              value={form.apiToken}
              onChange={(e) => setForm({ ...form, apiToken: e.target.value })}
              disabled={form.provider === "NONE"}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Phone Number ID</label>
            <Input
              value={form.phoneNumberId}
              onChange={(e) => setForm({ ...form, phoneNumberId: e.target.value })}
              disabled={form.provider === "NONE"}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Business Account ID</label>
            <Input
              value={form.businessAccountId}
              onChange={(e) => setForm({ ...form, businessAccountId: e.target.value })}
              disabled={form.provider === "NONE"}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Webhook Verify Token</label>
            <Input
              value={form.webhookVerifyToken}
              onChange={(e) => setForm({ ...form, webhookVerifyToken: e.target.value })}
              disabled={form.provider === "NONE"}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Monthly Credits Limit</label>
            <Input
              type="number"
              value={form.creditsTotal}
              onChange={(e) => setForm({ ...form, creditsTotal: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
          <Button onClick={save} disabled={saving} className="w-full bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
          </Button>
          {saved && <p className="text-center text-sm text-green-600">Settings saved!</p>}
        </div>
      </div>
    </div>
  );
}
