import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LEAD_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface RecentLead {
  id: string;
  name: string;
  email: string;
  status: string;
  budget: string;
}

interface RecentLeadsProps {
  data: RecentLead[];
}

export function RecentLeads({ data }: RecentLeadsProps) {
  return (
    <Card className="crm-card border-slate-100/80">
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Recent Leads</CardTitle>
          <p className="mt-0.5 text-xs text-slate-400">Latest from database</p>
        </div>
        <Link href="/crm/leads" className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700">
          View All <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      {data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-slate-400">
          No leads yet — <Link href="/crm/leads/new" className="ml-1 font-semibold text-violet-600 hover:underline">Add one</Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {data.map((lead) => (
            <li key={lead.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-violet-100 hover:bg-violet-50/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                {lead.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                <p className="truncate text-xs text-slate-500">{lead.email}</p>
              </div>
              <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", LEAD_STATUS_COLORS[lead.status] ?? "bg-slate-100 text-slate-600")}>
                {lead.status}
              </span>
              {lead.budget !== "—" && (
                <span className="hidden shrink-0 text-xs font-medium text-slate-500 lg:block">{lead.budget}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
