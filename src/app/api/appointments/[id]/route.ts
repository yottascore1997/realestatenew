import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.type && { type: body.type }),
        ...(body.location !== undefined && { location: body.location?.trim() || null }),
        ...(body.startTime && { startTime: new Date(body.startTime) }),
        ...(body.endTime !== undefined && { endTime: body.endTime ? new Date(body.endTime) : null }),
        ...(body.notes !== undefined && { notes: body.notes?.trim() || null }),
        ...(body.leadId !== undefined && { leadId: body.leadId || null }),
        ...(body.agentId !== undefined && { agentId: body.agentId || null }),
      },
      include: {
        lead: { select: { id: true, fullName: true, mobile: true, email: true } },
        agent: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json({
      id: appointment.id,
      title: appointment.title,
      type: appointment.type,
      location: appointment.location,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime?.toISOString() ?? null,
      notes: appointment.notes,
      leadId: appointment.leadId,
      agentId: appointment.agentId,
      lead: appointment.lead ? { id: appointment.lead.id, name: appointment.lead.fullName, mobile: appointment.lead.mobile, email: appointment.lead.email } : null,
      agent: appointment.agent ? { id: appointment.agent.id, name: appointment.agent.name, phone: appointment.agent.phone } : null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.appointment.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
