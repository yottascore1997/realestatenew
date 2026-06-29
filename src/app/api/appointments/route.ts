import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function mapAppointment(a: {
  id: string;
  title: string;
  type: string;
  location: string | null;
  startTime: Date;
  endTime: Date | null;
  notes: string | null;
  leadId: string | null;
  agentId: string | null;
  lead: { id: string; fullName: string; mobile: string; email: string | null } | null;
  agent: { id: string; name: string; phone: string | null } | null;
}) {
  return {
    id: a.id,
    title: a.title,
    type: a.type,
    location: a.location,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime?.toISOString() ?? null,
    notes: a.notes,
    leadId: a.leadId,
    agentId: a.agentId,
    lead: a.lead ? { id: a.lead.id, name: a.lead.fullName, mobile: a.lead.mobile, email: a.lead.email } : null,
    agent: a.agent ? { id: a.agent.id, name: a.agent.name, phone: a.agent.phone } : null,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const type = searchParams.get("type");
  const period = searchParams.get("period") ?? "all";

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  let timeFilter = {};
  if (period === "today") {
    timeFilter = { startTime: { gte: todayStart, lt: todayEnd } };
  } else if (period === "upcoming") {
    timeFilter = { startTime: { gte: now } };
  } else if (period === "past") {
    timeFilter = { startTime: { lt: now } };
  } else if (period === "week") {
    timeFilter = { startTime: { gte: todayStart, lt: weekEnd } };
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      ...(type && { type: type as never }),
      ...timeFilter,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { location: { contains: search } },
          { lead: { fullName: { contains: search } } },
          { agent: { name: { contains: search } } },
        ],
      }),
    },
    include: {
      lead: { select: { id: true, fullName: true, mobile: true, email: true } },
      agent: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { startTime: period === "past" ? "desc" : "asc" },
  });

  const all = await prisma.appointment.findMany({ select: { startTime: true } });
  const stats = {
    total: all.length,
    today: all.filter((a) => a.startTime >= todayStart && a.startTime < todayEnd).length,
    thisWeek: all.filter((a) => a.startTime >= todayStart && a.startTime < weekEnd).length,
    upcoming: all.filter((a) => a.startTime >= now).length,
    past: all.filter((a) => a.startTime < now).length,
  };

  return NextResponse.json({
    appointments: appointments.map(mapAppointment),
    stats,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title?.trim() || !body.startTime) {
      return NextResponse.json({ error: "Title and start time are required" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        title: body.title.trim(),
        type: body.type || "PROPERTY_SHOWING",
        location: body.location?.trim() || null,
        startTime: new Date(body.startTime),
        endTime: body.endTime ? new Date(body.endTime) : null,
        notes: body.notes?.trim() || null,
        leadId: body.leadId || null,
        agentId: body.agentId || null,
      },
      include: {
        lead: { select: { id: true, fullName: true, mobile: true, email: true } },
        agent: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json(mapAppointment(appointment), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
