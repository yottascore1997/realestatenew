"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, AlertTriangle, Users, Building2, Flame } from "lucide-react";
import {
  buildAnalytics, HEALTH_CONFIG, projectHealth, projectScore, type ProjectWithBuilder,
} from "@/lib/builders/analytics";
import { statusLabel, statusColor } from "@/lib/builders/constants";
import { cn } from "@/lib/utils";

interface BuilderAnalyticsProps {
  builders: { id: string; name: string; projects: Omit<ProjectWithBuilder, "builderId" | "builderName">[] }[];
  onSelectBuilder?: (id: string) => void;
}

export function BuilderAnalytics({ builders, onSelectBuilder }: BuilderAnalyticsProps) {
  const data = buildAnalytics(builders);

  if (data.allProjects.length === 0) {
    return (
      <div className="crm-card rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
        Add builders & link projects to see performance analysis
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Health counts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(HEALTH_CONFIG) as Array<keyof typeof HEALTH_CONFIG>).map((key) => {
          const cfg = HEALTH_CONFIG[key];
          const count = data.healthCounts[key];
          if (count === 0) return null;
          return (
            <div key={key} className={cn("crm-card rounded-2xl border p-4", cfg.bg)}>
              <p className={cn("text-2xl font-extrabold", cfg.color)}>{count}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-600">{cfg.label}</p>
            </div>
          );
        })}
        <div className="crm-card rounded-2xl border border-violet-100 bg-violet-50 p-4">
          <p className="text-2xl font-extrabold text-violet-700">{data.totalLeads}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
            <Users className="h-3 w-3" /> Total Leads
          </p>
        </div>
        <div className="crm-card rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-2xl font-extrabold text-indigo-700">{data.totalProperties}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
            <Building2 className="h-3 w-3" /> Total Properties
          </p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Project health pie */}
        <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
          <p className="mb-1 text-sm font-bold text-slate-800">Project Performance</p>
          <p className="mb-3 text-xs text-slate-400">Kaun sa project sahi chal raha hai</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.healthChart} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {data.healthChart.map((e) => (
                  <Cell key={e.key} fill={e.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, _n, p) => [`${v} projects`, p.payload.name]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.healthChart.map((e) => (
              <span key={e.key} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                {e.name} ({e.value})
              </span>
            ))}
          </div>
        </div>

        {/* Status bar chart */}
        <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
          <p className="mb-1 text-sm font-bold text-slate-800">Projects by Status</p>
          <p className="mb-3 text-xs text-slate-400">Construction stage overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.statusChart} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="value" name="Projects" radius={[6, 6, 0, 0]}>
                {data.statusChart.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Builder-wise projects */}
        <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
          <p className="mb-1 text-sm font-bold text-slate-800">Builder-wise Projects</p>
          <p className="mb-3 text-xs text-slate-400">Kis builder ke kitne projects</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.builderChart} layout="vertical" margin={{ left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v, name) => [v, name === "active" ? "Active" : "Total Projects"]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                contentStyle={{ borderRadius: 10, fontSize: 12 }}
              />
              <Bar dataKey="projects" fill="#7c3aed" name="projects" radius={[0, 4, 4, 0]} />
              <Bar dataKey="active" fill="#a78bfa" name="active" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top performing projects */}
      <div className="crm-card rounded-2xl border border-slate-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <p className="text-sm font-bold text-slate-800">Top Performing Projects</p>
          <span className="text-xs text-slate-400">— leads + properties + status score</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.topProjects.map((p, i) => {
            const health = projectHealth(p);
            const cfg = HEALTH_CONFIG[health];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectBuilder?.(p.builderId)}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition-all hover:border-violet-200 hover:bg-violet-50/40"
              >
                <span className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                  i === 0 ? "bg-orange-100 text-orange-600" : "bg-violet-100 text-violet-600"
                )}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{p.name}</p>
                  <p className="truncate text-xs text-violet-600">{p.builderName}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase", statusColor(p.status))}>
                      {statusLabel(p.status)}
                    </span>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-bold", cfg.bg, cfg.color)}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="mt-1.5 flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.leadsCount} leads</span>
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{p.propertiesCount} props</span>
                    <span className="flex items-center gap-1 text-emerald-600"><TrendingUp className="h-3 w-3" />{projectScore(p)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {data.healthCounts.attention > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span><strong>{data.healthCounts.attention}</strong> project(s) need attention — no leads or properties yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
