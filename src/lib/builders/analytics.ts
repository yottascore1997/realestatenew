import { PROJECT_STATUS } from "./constants";

export interface ProjectWithBuilder {
  id: string;
  name: string;
  location: string;
  city: string;
  status: string;
  totalUnits: number | null;
  priceFrom: number | null;
  priceTo: number | null;
  propertiesCount: number;
  leadsCount: number;
  builderId: string;
  builderName: string;
}

export type ProjectHealth = "performing" | "ready" | "progress" | "attention" | "completed";

export function projectScore(p: Pick<ProjectWithBuilder, "leadsCount" | "propertiesCount" | "status">) {
  const statusBonus =
    p.status === "READY_TO_MOVE" ? 5 :
    p.status === "UNDER_CONSTRUCTION" ? 3 :
    p.status === "PLANNING" ? 1 : 0;
  return p.leadsCount * 3 + p.propertiesCount * 2 + statusBonus;
}

export function projectHealth(p: Pick<ProjectWithBuilder, "leadsCount" | "propertiesCount" | "status">): ProjectHealth {
  if (p.status === "COMPLETED") return "completed";
  if (p.status === "READY_TO_MOVE" && (p.leadsCount > 0 || p.propertiesCount > 0)) return "performing";
  if (p.status === "READY_TO_MOVE") return "ready";
  if (p.leadsCount > 0 || p.propertiesCount > 0) return "performing";
  if (p.status === "UNDER_CONSTRUCTION" || p.status === "PLANNING") return "attention";
  return "attention";
}

export const HEALTH_CONFIG: Record<ProjectHealth, { label: string; color: string; bg: string; chart: string }> = {
  performing: { label: "Performing Well", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100", chart: "#22c55e" },
  ready: { label: "Ready to Move", color: "text-teal-700", bg: "bg-teal-50 border-teal-100", chart: "#14b8a6" },
  progress: { label: "In Progress", color: "text-amber-700", bg: "bg-amber-50 border-amber-100", chart: "#f59e0b" },
  attention: { label: "Needs Attention", color: "text-rose-700", bg: "bg-rose-50 border-rose-100", chart: "#f43f5e" },
  completed: { label: "Completed", color: "text-slate-600", bg: "bg-slate-50 border-slate-100", chart: "#94a3b8" },
};

export function buildAnalytics(builders: { id: string; name: string; projects: Omit<ProjectWithBuilder, "builderId" | "builderName">[] }[]) {
  const allProjects: ProjectWithBuilder[] = builders.flatMap((b) =>
    b.projects.map((p) => ({ ...p, builderId: b.id, builderName: b.name }))
  );

  const healthCounts: Record<ProjectHealth, number> = {
    performing: 0, ready: 0, progress: 0, attention: 0, completed: 0,
  };
  allProjects.forEach((p) => { healthCounts[projectHealth(p)]++; });

  const statusColors: Record<string, string> = {
    PLANNING: "#94a3b8",
    UNDER_CONSTRUCTION: "#f59e0b",
    READY_TO_MOVE: "#22c55e",
    COMPLETED: "#8b5cf6",
  };
  const statusChartFixed = PROJECT_STATUS.map((s) => ({
    name: s.label,
    value: allProjects.filter((p) => p.status === s.value).length,
    color: statusColors[s.value],
  })).filter((d) => d.value > 0);

  const builderChart = builders
    .filter((b) => b.projects.length > 0)
    .map((b) => ({
      name: b.name.length > 14 ? `${b.name.slice(0, 14)}…` : b.name,
      fullName: b.name,
      projects: b.projects.length,
      active: b.projects.filter((p) => p.status !== "COMPLETED").length,
      leads: b.projects.reduce((s, p) => s + p.leadsCount, 0),
    }))
    .sort((a, b) => b.projects - a.projects);

  const topProjects = [...allProjects]
    .sort((a, b) => projectScore(b) - projectScore(a))
    .slice(0, 6);

  const healthChart = (Object.keys(healthCounts) as ProjectHealth[])
    .filter((k) => healthCounts[k] > 0)
    .map((k) => ({
      name: HEALTH_CONFIG[k].label,
      value: healthCounts[k],
      color: HEALTH_CONFIG[k].chart,
      key: k,
    }));

  return {
    allProjects,
    healthCounts,
    healthChart,
    statusChart: statusChartFixed,
    builderChart,
    topProjects,
    totalLeads: allProjects.reduce((s, p) => s + p.leadsCount, 0),
    totalProperties: allProjects.reduce((s, p) => s + p.propertiesCount, 0),
  };
}
