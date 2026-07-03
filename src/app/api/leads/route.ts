import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const agentId = searchParams.get("agentId") ?? undefined;
  const priority = searchParams.get("priority") ?? undefined;
  const temperature = searchParams.get("temperature") ?? undefined;
  const location = searchParams.get("location") ?? undefined;
  const dashboard = searchParams.get("dashboard");

  const quickFilter = searchParams.get("quickFilter") ?? undefined;

  if (dashboard === "true") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalLeads, todaysLeads, todaysFollowUps, overdueFollowUps, hotLeads, siteVisitsToday, bookedTotal, bookingsThisMonth, lostLeads, revenue, leadRevenue] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.lead.count({ where: { nextFollowUpDate: { gte: today, lt: tomorrow } } }),
      prisma.lead.count({ where: { nextFollowUpDate: { lt: today }, status: { notIn: ["BOOKED", "LOST"] } } }),
      prisma.lead.count({ where: { temperature: "HOT", status: { notIn: ["BOOKED", "LOST"] } } }),
      prisma.siteVisit.count({ where: { visitDate: { gte: today, lt: tomorrow }, status: "SCHEDULED" } }),
      prisma.lead.count({ where: { status: "BOOKED" } }),
      prisma.lead.count({ where: { status: "BOOKED", updatedAt: { gte: monthStart } } }),
      prisma.lead.count({ where: { status: "LOST", updatedAt: { gte: monthStart } } }),
      prisma.booking.aggregate({ where: { status: "FULLY_PAID" }, _sum: { totalAmount: true } }),
      prisma.lead.aggregate({ where: { status: "BOOKED" }, _sum: { bookingAmount: true } }),
    ]);

    return NextResponse.json({
      totalLeads, todaysLeads, todaysFollowUps, overdueFollowUps, hotLeads, siteVisitsToday,
      bookedTotal, bookingsThisMonth, lostLeads,
      revenueGenerated: Number(revenue._sum.totalAmount ?? 0) + Number(leadRevenue._sum.bookingAmount ?? 0),
    });
  }

  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "0", 10);
  const paginate = page > 0 && limit > 0;

  const quickWhere = quickFilter ? buildQuickFilterWhere(quickFilter) : {};

  const where = {
    ...quickWhere,
    ...(status && !quickFilter && { status: status as never }),
    ...(source && { source: source as never }),
    ...(agentId && { agentId }),
    ...(priority && { priority: priority as never }),
    ...(temperature && !quickFilter && { temperature: temperature as never }),
    AND: [
      ...(search ? [{
        OR: [
          { fullName: { contains: search } },
          { mobile: { contains: search } },
          { email: { contains: search } },
        ],
      }] : []),
      ...(location ? [{
        OR: [
          { city: location },
          { city: { contains: location } },
          { preferredLocation: { contains: location } },
        ],
      }] : []),
    ],
  };

  if (paginate) {
    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: { agent: true, project: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);
    return NextResponse.json({
      leads: leads.map(serializeLead),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  }

  const leads = await prisma.lead.findMany({
    where,
    include: { agent: true, project: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leads.map(serializeLead));
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.checkDuplicate) {
    const { mobile, email } = body;
    const duplicates = await prisma.lead.findMany({
      where: { OR: [...(mobile ? [{ mobile }] : []), ...(email ? [{ email }] : [])] },
      include: { agent: true, project: true },
    });
    return NextResponse.json({ duplicates: duplicates.map(serializeLead), isDuplicate: duplicates.length > 0 });
  }

  const lead = await prisma.lead.create({
    data: {
      fullName: body.fullName,
      mobile: body.mobile,
      alternateMobile: body.alternateMobile,
      email: body.email,
      whatsapp: body.whatsapp ?? body.mobile,
      city: body.city,
      occupation: body.occupation,
      propertyType: body.propertyType,
      projectId: body.projectId || null,
      preferredLocation: body.preferredLocation,
      nextFollowUpDate: body.nextFollowUpDate ? new Date(body.nextFollowUpDate) : null,
      budget: body.budget,
      budgetMin: body.budgetMin ? Number(body.budgetMin) : null,
      budgetMax: body.budgetMax ? Number(body.budgetMax) : null,
      bhk: body.bhk,
      loanRequired: body.loanRequired ?? false,
      purchasePurpose: body.purchasePurpose,
      source: body.source ?? "WEBSITE",
      priority: body.priority ?? "MEDIUM",
      temperature: body.temperature ?? "WARM",
      tags: body.tags ?? [],
      notes: body.notes,
      agentId: body.agentId || null,
      status: body.agentId ? "ASSIGNED" : "NEW",
      activities: {
        create: { type: "LEAD_CREATED", title: "Lead Created", description: `Source: ${body.source ?? "Website"}` },
      },
    },
    include: { agent: true, project: true },
  });

  return NextResponse.json(serializeLead(lead), { status: 201 });
}

function buildQuickFilterWhere(quickFilter: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const closedStatuses = ["BOOKED", "LOST", "NOT_INTERESTED"] as const;

  switch (quickFilter) {
    case "hot":
      return { temperature: "HOT" as const, status: { notIn: [...closedStatuses] } };
    case "follow_up_due":
      return {
        status: { notIn: [...closedStatuses] },
        OR: [
          { nextFollowUpDate: { gte: today, lt: tomorrow } },
          { nextFollowUpDate: { lt: today } },
        ],
      };
    case "booked":
      return { status: "BOOKED" as const };
    case "booked_month":
      return { status: "BOOKED" as const, updatedAt: { gte: monthStart } };
    case "today":
      return { createdAt: { gte: today, lt: tomorrow } };
    default:
      return {};
  }
}

function serializeLead(lead: Record<string, unknown>) {
  const agent = lead.agent as { id: string; name: string } | null;
  const project = lead.project as { id: string; name: string } | null;
  return {
    ...lead,
    agentName: agent?.name,
    projectName: project?.name,
    tags: lead.tags as string[] | null,
    budgetMin: lead.budgetMin ? Number(lead.budgetMin) : null,
    budgetMax: lead.budgetMax ? Number(lead.budgetMax) : null,
    bookingAmount: lead.bookingAmount ? Number(lead.bookingAmount) : null,
  };
}
