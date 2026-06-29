import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { LEAD_SOURCES } from "@/lib/leads/constants";

import { KANBAN_COLUMNS } from "@/lib/leads/constants";

export const dynamic = "force-dynamic";


const SOURCE_COLORS = [
  "#7c3aed", "#6366f1", "#a78bfa", "#22c55e", "#f59e0b",
  "#ec4899", "#14b8a6", "#f97316", "#64748b", "#8b5cf6",
];

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function monthRange(offsetMonths: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 1);
  return { start, end };
}

function weekStart(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

const SOURCE_LABELS = Object.fromEntries(LEAD_SOURCES.map((s) => [s.key, s.label]));

export async function GET() {
  try {
    const thisMonth = monthRange(0);
    const lastMonth = monthRange(-1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalLeads,
      activeDeals,
      totalProperties,
      closedDeals,
      revenueAgg,
      leadsThisMonth,
      leadsLastMonth,
      dealsThisMonth,
      dealsLastMonth,
      propsThisMonth,
      propsLastMonth,
      closedThisMonth,
      closedLastMonth,
      revenueThisMonth,
      revenueLastMonth,
      sourceGroups,
      statusGroups,
      recentLeadsRaw,
      recentPropertiesRaw,
      siteVisits,
      followUpLeads,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.deal.count({ where: { stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } } }),
      prisma.property.count(),
      prisma.deal.count({ where: { stage: "CLOSED_WON" } }),
      prisma.deal.aggregate({ where: { stage: "CLOSED_WON" }, _sum: { value: true } }),
      prisma.lead.count({ where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end } } }),
      prisma.lead.count({ where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end } } }),
      prisma.deal.count({ where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end }, stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } } }),
      prisma.deal.count({ where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end }, stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } } }),
      prisma.property.count({ where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end } } }),
      prisma.property.count({ where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end } } }),
      prisma.deal.count({ where: { stage: "CLOSED_WON", closedAt: { gte: thisMonth.start, lt: thisMonth.end } } }),
      prisma.deal.count({ where: { stage: "CLOSED_WON", closedAt: { gte: lastMonth.start, lt: lastMonth.end } } }),
      prisma.booking.aggregate({ where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end } }, _sum: { totalAmount: true } }),
      prisma.booking.aggregate({ where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end } }, _sum: { totalAmount: true } }),
      prisma.lead.groupBy({ by: ["source"], _count: { id: true } }),
      prisma.lead.groupBy({ by: ["status"], _count: { id: true }, _sum: { bookingAmount: true } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, fullName: true, email: true, temperature: true, budget: true, status: true, createdAt: true },
      }),
      prisma.property.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, address: true, city: true, price: true, bedrooms: true, bathrooms: true, sqft: true, image: true, status: true },
      }),
      prisma.siteVisit.findMany({
        where: { visitDate: { gte: today }, status: "SCHEDULED" },
        take: 5,
        orderBy: { visitDate: "asc" },
        include: { lead: { select: { fullName: true } }, project: { select: { name: true } } },
      }),
      prisma.lead.findMany({
        where: { nextFollowUpDate: { gte: today, lt: new Date(today.getTime() + 7 * 86400000) }, status: { notIn: ["BOOKED", "LOST"] } },
        take: 5,
        orderBy: { nextFollowUpDate: "asc" },
        select: { id: true, fullName: true, preferredLocation: true, nextFollowUpDate: true, nextFollowUpTime: true },
      }),
    ]);

    const totalRevenue = Number(revenueAgg._sum.value ?? 0);
    const revThis = Number(revenueThisMonth._sum.totalAmount ?? 0);
    const revLast = Number(revenueLastMonth._sum.totalAmount ?? 0);

    // Weekly sales chart — last 8 weeks of booking revenue vs prior 8 weeks
    const salesChart: { date: string; thisMonth: number; lastMonth: number }[] = [];
    const base = weekStart(new Date());
    for (let i = 7; i >= 0; i--) {
      const ws = new Date(base);
      ws.setDate(ws.getDate() - i * 7);
      const we = new Date(ws);
      we.setDate(we.getDate() + 7);
      const prevWs = new Date(ws);
      prevWs.setDate(prevWs.getDate() - 56);
      const prevWe = new Date(prevWs);
      prevWe.setDate(prevWe.getDate() + 7);

      const [cur, prev] = await Promise.all([
        prisma.booking.aggregate({ where: { createdAt: { gte: ws, lt: we } }, _sum: { totalAmount: true } }),
        prisma.booking.aggregate({ where: { createdAt: { gte: prevWs, lt: prevWe } }, _sum: { totalAmount: true } }),
      ]);

      salesChart.push({
        date: ws.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        thisMonth: Number(cur._sum.totalAmount ?? 0),
        lastMonth: Number(prev._sum.totalAmount ?? 0),
      });
    }

    // If no bookings, chart lead counts per week instead
    const hasBookingData = salesChart.some((d) => d.thisMonth > 0 || d.lastMonth > 0);
    if (!hasBookingData) {
      for (let i = 0; i < salesChart.length; i++) {
        const ws = new Date(base);
        ws.setDate(ws.getDate() - (7 - i) * 7);
        const we = new Date(ws);
        we.setDate(we.getDate() + 7);
        const prevWs = new Date(ws);
        prevWs.setDate(prevWs.getDate() - 56);
        const prevWe = new Date(prevWs);
        prevWe.setDate(prevWe.getDate() + 7);
        const [cur, prev] = await Promise.all([
          prisma.lead.count({ where: { createdAt: { gte: ws, lt: we } } }),
          prisma.lead.count({ where: { createdAt: { gte: prevWs, lt: prevWe } } }),
        ]);
        salesChart[i] = { ...salesChart[i], thisMonth: cur, lastMonth: prev };
      }
    }

    const sourceTotal = sourceGroups.reduce((s, g) => s + g._count.id, 0);
    const leadSources = sourceGroups
      .sort((a, b) => b._count.id - a._count.id)
      .slice(0, 5)
      .map((g, i) => ({
        name: SOURCE_LABELS[g.source] ?? g.source,
        value: sourceTotal > 0 ? Math.round((g._count.id / sourceTotal) * 100) : 0,
        color: SOURCE_COLORS[i] ?? "#94a3b8",
        count: g._count.id,
      }));

    const statusMap = Object.fromEntries(statusGroups.map((g) => [g.status, { count: g._count.id, value: Number(g._sum.bookingAmount ?? 0) }]));
    const pipelineTotal = KANBAN_COLUMNS.reduce((s, c) => s + (statusMap[c.key]?.count ?? 0), 0) || 1;
    const pipeline = KANBAN_COLUMNS.map((col) => {
      const row = statusMap[col.key] ?? { count: 0, value: 0 };
      return {
        stage: col.key,
        label: col.label,
        count: row.count,
        value: row.value,
        percent: Math.round((row.count / pipelineTotal) * 100),
      };
    });

    const activities = [
      ...siteVisits.map((v) => ({
        id: v.id,
        title: "Site Visit",
        subtitle: v.lead?.fullName ?? v.project?.name ?? "Scheduled visit",
        time: v.visitTime ?? v.visitDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        type: "PROPERTY_SHOWING" as const,
      })),
      ...followUpLeads.map((l) => ({
        id: l.id,
        title: "Follow-up",
        subtitle: l.fullName + (l.preferredLocation ? ` · ${l.preferredLocation}` : ""),
        time: l.nextFollowUpTime ?? (l.nextFollowUpDate ? l.nextFollowUpDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""),
        type: "FOLLOW_UP_CALL" as const,
      })),
    ].slice(0, 6);

    return NextResponse.json({
      stats: {
        totalLeads,
        activeDeals,
        totalProperties,
        closedDeals,
        totalRevenue,
        trends: {
          leads: pctChange(leadsThisMonth, leadsLastMonth),
          deals: pctChange(dealsThisMonth, dealsLastMonth),
          properties: pctChange(propsThisMonth, propsLastMonth),
          closed: pctChange(closedThisMonth, closedLastMonth),
          revenue: pctChange(revThis, revLast),
        },
      },
      salesChart,
      leadSources,
      sourceTotal,
      pipeline,
      recentLeads: recentLeadsRaw.map((l) => ({
        id: l.id,
        name: l.fullName,
        email: l.email ?? l.budget ?? "—",
        status: l.temperature,
        budget: l.budget ?? "—",
      })),
      recentProperties: recentPropertiesRaw.map((p) => ({
        id: p.id,
        title: p.title,
        address: [p.address, p.city].filter(Boolean).join(", "),
        price: Number(p.price),
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        sqft: p.sqft,
        image: p.image ?? "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=150&fit=crop",
        status: p.status,
      })),
      upcomingActivities: activities,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({
      stats: {
        totalLeads: 0, activeDeals: 0, totalProperties: 0, closedDeals: 0, totalRevenue: 0,
        trends: { leads: 0, deals: 0, properties: 0, closed: 0, revenue: 0 },
      },
      salesChart: [],
      leadSources: [],
      sourceTotal: 0,
      pipeline: KANBAN_COLUMNS.map((c) => ({ stage: c.key, label: c.label, count: 0, value: 0, percent: 0 })),
      recentLeads: [],
      recentProperties: [],
      upcomingActivities: [],
    });
  }
}
