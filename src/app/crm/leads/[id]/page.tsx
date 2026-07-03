"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lead360Profile } from "@/components/leads/lead-360-profile";

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const loadLead = useCallback(() => {
    setLoading(true);
    fetch(`/api/leads/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setLead)
      .catch(() => setLead(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { loadLead(); }, [loadLead]);

  const handleStatusChange = async (newStatus: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadLead();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F6BF5]" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Lead not found</p>
        <Link href="/crm/leads"><Button className="mt-4">Back to Leads</Button></Link>
      </div>
    );
  }

  return (
    <Lead360Profile
      lead={lead as Parameters<typeof Lead360Profile>[0]["lead"]}
      onStatusChange={handleStatusChange}
    />
  );
}
