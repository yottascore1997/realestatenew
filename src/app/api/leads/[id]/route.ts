import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      agent: true,
      project: true,
      activities: { orderBy: { createdAt: "desc" }, include: { user: true } },
      followUps: { orderBy: { scheduledDate: "asc" } },
      callNotes: { orderBy: { createdAt: "desc" }, include: { agent: true } },
      siteVisits: { orderBy: { visitDate: "desc" }, include: { project: true, executive: true } },
      documents: { orderBy: { uploadedAt: "desc" } },
    },
  });

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...lead,
    agentName: lead.agent?.name,
    projectName: lead.project?.name,
    activities: lead.activities.map((a) => ({
      ...a,
      userName: a.user?.name ?? "System",
    })),
    callNotes: lead.callNotes.map((n) => ({
      ...n,
      agentName: n.agent?.name,
    })),
    siteVisits: lead.siteVisits.map((v) => ({
      ...v,
      projectName: v.project?.name,
      executiveName: v.executive?.name,
    })),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: {
      ...body,
      ...(body.status && {
        activities: { create: { type: "STATUS_CHANGE", title: `Status changed to ${body.status}` } },
      }),
    },
    include: { agent: true, project: true },
  });
  return NextResponse.json(lead);
}
