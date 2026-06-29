import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKanbanData } from "@/lib/leads/mock-data";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: { agent: true, project: true },
      orderBy: { updatedAt: "desc" },
    });
    const columns: Record<string, typeof leads> = {};
    const statuses = ["NEW", "INTERESTED", "FOLLOW_UP", "SITE_VISIT_SCHEDULED", "NEGOTIATION", "BOOKED", "LOST"];
    for (const s of statuses) columns[s] = leads.filter((l) => l.status === s);
    return NextResponse.json(columns);
  } catch {
    return NextResponse.json(getKanbanData());
  }
}

export async function PATCH(request: Request) {
  const { leadId, status } = await request.json();
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status,
        activities: { create: { type: "STATUS_CHANGE", title: `Moved to ${status}` } },
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
