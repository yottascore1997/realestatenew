import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function dayBounds(offset: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + offset);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export async function GET() {
  const today = dayBounds(0);
  const tomorrow = dayBounds(1);
  const yesterday = dayBounds(-1);

  const rangeStart = yesterday.start;
  const rangeEnd = tomorrow.end;

  const [leads, siteVisits] = await Promise.all([
    prisma.lead.findMany({
      where: {
        status: { notIn: ["BOOKED", "LOST", "NOT_INTERESTED"] },
        OR: [
          { nextFollowUpDate: { gte: rangeStart, lt: rangeEnd } },
          { vcScheduledDate: { gte: rangeStart, lt: rangeEnd } },
        ],
      },
      include: { project: true },
    }),
    prisma.siteVisit.findMany({
      where: {
        visitDate: { gte: rangeStart, lt: rangeEnd },
        status: "SCHEDULED",
      },
      include: { lead: true, project: true },
    }),
  ]);

  type Item = {
    id: string;
    fullName: string;
    type: "follow_up" | "vc" | "site_visit";
    label: string;
    date: string;
    time?: string | null;
    project?: string | null;
    location?: string | null;
    when: "today" | "tomorrow";
  };

  const items: Item[] = [];

  const whenFor = (d: Date): "today" | "tomorrow" | null => {
    if (d >= today.start && d < today.end) return "today";
    if (d >= tomorrow.start && d < tomorrow.end) return "tomorrow";
    if (d >= yesterday.start && d < yesterday.end) return "today";
    return null;
  };

  for (const lead of leads) {
    if (lead.nextFollowUpDate) {
      const w = whenFor(lead.nextFollowUpDate);
      if (w) {
        items.push({
          id: lead.id,
          fullName: lead.fullName,
          type: "follow_up",
          label: "Follow-up scheduled",
          date: lead.nextFollowUpDate.toISOString(),
          time: lead.nextFollowUpTime,
          project: lead.trackingProject ?? lead.project?.name,
          location: lead.trackingLocation ?? lead.preferredLocation ?? lead.city,
          when: w,
        });
      }
    }
    if (lead.vcScheduledDate) {
      const w = whenFor(lead.vcScheduledDate);
      if (w) {
        items.push({
          id: lead.id,
          fullName: lead.fullName,
          type: "vc",
          label: "Video Call (VC) scheduled",
          date: lead.vcScheduledDate.toISOString(),
          time: lead.vcScheduledTime,
          project: lead.trackingProject ?? lead.project?.name,
          location: lead.trackingLocation ?? lead.preferredLocation ?? lead.city,
          when: w,
        });
      }
    }
  }

  for (const visit of siteVisits) {
    const w = whenFor(visit.visitDate);
    if (w && visit.lead) {
      items.push({
        id: visit.leadId,
        fullName: visit.lead.fullName,
        type: "site_visit",
        label: "Site visit scheduled",
        date: visit.visitDate.toISOString(),
        time: visit.visitTime,
        project: visit.project?.name ?? visit.lead.trackingProject,
        location: visit.lead.trackingLocation ?? visit.lead.preferredLocation,
        when: w,
      });
    }
  }

  items.sort((a, b) => {
    const order = { today: 0, tomorrow: 1 };
    if (order[a.when] !== order[b.when]) return order[a.when] - order[b.when];
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return NextResponse.json({ items });
}
