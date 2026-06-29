"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Handshake, Building2, CheckCircle, IndianRupee, Plus } from "lucide-react";
import { StatCard } from "@/components/crm/stat-card";
import { SalesChart } from "@/components/crm/sales-chart";
import { LeadSourcesChart } from "@/components/crm/lead-sources-chart";
import { UpcomingActivities } from "@/components/crm/upcoming-activities";
import { RecentLeads } from "@/components/crm/recent-leads";
import { DealPipeline } from "@/components/crm/deal-pipeline";
import { RecentProperties } from "@/components/crm/recent-properties";

interface DashboardData {
  stats: {
    totalLeads: number;
    activeDeals: number;
    totalProperties: number;
    closedDeals: number;
    totalRevenue: number;
    trends: { leads: number; deals: number; properties: number; closed: number; revenue: number };
  };
  salesChart: { date: string; thisMonth: number; lastMonth: number }[];
  leadSources: { name: string; value: number; color: string; count: number }[];
  sourceTotal: number;
  pipeline: { stage: string; label: string; count: number; value: number; percent: number }[];
  recentLeads: { id: string; name: string; email: string; status: string; budget: string }[];
  recentProperties: { id: string; title: string; address: string; price: number; bedrooms: number; bathrooms: number; sqft: number | null; image: string; status: string }[];
  upcomingActivities: { id: string; title: string; subtitle: string; time: string; type: "PROPERTY_SHOWING" | "CLIENT_MEETING" | "FOLLOW_UP_CALL" | "DOCUMENT_SIGNING" }[];
}

const EMPTY: DashboardData = {
  stats: { totalLeads: 0, activeDeals: 0, totalProperties: 0, closedDeals: 0, totalRevenue: 0, trends: { leads: 0, deals: 0, properties: 0, closed: 0, revenue: 0 } },
  salesChart: [],
  leadSources: [],
  sourceTotal: 0,
  pipeline: [],
  recentLeads: [],
  recentProperties: [],
  upcomingActivities: [],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(EMPTY));
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Live overview of your CRM</p>
        </div>
        <Link href="/crm/leads/new">
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 hover:brightness-110">
            <Plus className="h-4 w-4" /> Add Lead
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Leads" value={stats.totalLeads} trend={stats.trends.leads} icon={Users} variant="violet" delay={0} />
        <StatCard title="Active Deals" value={stats.activeDeals} trend={stats.trends.deals} icon={Handshake} variant="indigo" delay={1} />
        <StatCard title="Properties" value={stats.totalProperties} trend={stats.trends.properties} icon={Building2} variant="emerald" delay={2} />
        <StatCard title="Closed Deals" value={stats.closedDeals} trend={stats.trends.closed} icon={CheckCircle} variant="amber" delay={3} />
        <StatCard title="Total Revenue" value={stats.totalRevenue} trend={stats.trends.revenue} icon={IndianRupee} variant="rose" isCurrency delay={4} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SalesChart data={data.salesChart} />
        <LeadSourcesChart data={data.leadSources} total={data.sourceTotal} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DealPipeline data={data.pipeline} />
        <UpcomingActivities data={data.upcomingActivities} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RecentLeads data={data.recentLeads} />
        <RecentProperties data={data.recentProperties} />
      </div>
    </div>
  );
}
