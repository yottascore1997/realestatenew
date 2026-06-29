"use client";

import { Card } from "@/components/ui/card";
import { mockAgents } from "@/lib/leads/mock-data";

export function AgentPerformanceCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {mockAgents.map((agent) => (
        <Card key={agent.id} className="flex items-center gap-4">
          <img src={agent.avatar ?? ""} alt="" className="h-12 w-12 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{agent.name}</p>
            <div className="mt-1 flex gap-4 text-sm text-slate-500">
              <span>{agent.totalLeads} Leads</span>
              <span className="font-medium text-emerald-600">{agent.bookings} Bookings</span>
              <span>{agent.conversionRate}%</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
