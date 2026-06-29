"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import { CitySelect } from "@/components/leads/city-select";
import { LEAD_SOURCES } from "@/lib/leads/constants";

interface ProjectOption { id: string; name: string; location?: string | null; city?: string | null; }

export default function NewLeadPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [form, setForm] = useState({
    fullName: "", mobile: "", email: "", source: "WEBSITE", budget: "", agentId: "", notes: "",
    projectId: "", preferredLocation: "", nextFollowUpDate: "", city: "",
  });

  useEffect(() => {
    fetch("/api/users/employees").then((r) => r.json()).then(setEmployees);
    fetch("/api/projects").then((r) => r.json()).then((data) =>
      setProjects(Array.isArray(data) ? data.map((p) => ({ id: p.id, name: p.name, location: p.location, city: p.city })) : [])
    );
  }, []);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleProjectChange = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    const loc = proj ? [proj.location, proj.city].filter(Boolean).join(", ") : "";
    setForm((prev) => ({ ...prev, projectId, preferredLocation: loc || prev.preferredLocation, city: proj?.city || prev.city }));
  };

  const checkDup = async () => {
    if (!form.mobile && !form.email) return;
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkDuplicate: true, mobile: form.mobile, email: form.email }),
    });
    const data = await res.json();
    if (data.isDuplicate) setDuplicateWarning(`Duplicate: ${data.duplicates[0].fullName} (${data.duplicates[0].mobile})`);
    else setDuplicateWarning("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, whatsapp: form.mobile }),
    });
    setLoading(false);
    if (res.ok) router.push("/crm/leads");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/leads" className="rounded-xl border border-slate-200 p-2.5 shadow-sm hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /></Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Add Lead</h2>
          <p className="text-sm text-slate-500">Quick add — only essential details</p>
        </div>
      </div>

      {duplicateWarning && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4" />{duplicateWarning}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Lead Details" description="Name and contact are required">
          <FormGrid cols={3}>
            <Input label="Full Name *" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required placeholder="e.g. Rahul Sharma" />
            <Input label="Mobile *" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} onBlur={checkDup} required placeholder="10-digit mobile" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={checkDup} placeholder="optional" />
            <Select label="Lead Source" value={form.source} onChange={(e) => update("source", e.target.value)}
              options={LEAD_SOURCES.map((s) => ({ value: s.key, label: s.label }))} />
            <Input label="Budget" value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. ₹80L - ₹1Cr" />
            <Select label="Assign Employee" value={form.agentId} onChange={(e) => update("agentId", e.target.value)}
              options={employees.map((a) => ({ value: a.id, label: a.name }))} placeholder="Optional" />
          </FormGrid>
        </FormSection>

        <FormSection title="Project & Follow-up" description="Link a project and schedule the next follow-up">
          <FormGrid cols={3}>
            <Select label="Project" value={form.projectId} onChange={(e) => handleProjectChange(e.target.value)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))} placeholder="Select project" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">City</label>
              <CitySelect
                value={form.city}
                onChange={(city) => update("city", city)}
                placeholder="Select city"
                className="h-10 w-full max-w-none"
              />
            </div>
            <Input label="Location / Area" value={form.preferredLocation} onChange={(e) => update("preferredLocation", e.target.value)} placeholder="e.g. Wakad, Bandra West" />
            <Input label="Follow-up Date" type="date" value={form.nextFollowUpDate} onChange={(e) => update("nextFollowUpDate", e.target.value)} />
          </FormGrid>
          <div className="mt-4">
            <Textarea label="Notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} placeholder="Any quick notes..." />
          </div>
        </FormSection>

        <div className="flex justify-end gap-3">
          <Link href="/crm/leads"><Button type="button" variant="outline">Cancel</Button></Link>
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Create Lead"}
          </Button>
        </div>
      </form>
    </div>
  );
}
