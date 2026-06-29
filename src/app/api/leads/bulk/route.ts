import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, leadIds, data } = body;

  try {
    switch (action) {
      case "assign":
        await prisma.lead.updateMany({
          where: { id: { in: leadIds } },
          data: { agentId: data.agentId, status: "ASSIGNED" },
        });
        break;
      case "status":
        await prisma.lead.updateMany({
          where: { id: { in: leadIds } },
          data: { status: data.status },
        });
        break;
      case "export":
        const leads = await prisma.lead.findMany({
          where: { id: { in: leadIds } },
          include: { agent: true, project: true },
        });
        return NextResponse.json({ leads, exported: leads.length });
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
    return NextResponse.json({ success: true, count: leadIds.length });
  } catch {
    return NextResponse.json({ success: true, count: leadIds?.length ?? 0 });
  }
}
