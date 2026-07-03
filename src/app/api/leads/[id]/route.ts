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
      bookings: {
        orderBy: { bookingDate: "desc" },
        include: {
          paymentSchedules: { orderBy: { sortOrder: "asc" } },
          project: true,
        },
      },
    },
  });

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...lead,
    budgetMax: lead.budgetMax ? Number(lead.budgetMax) : null,
    budgetMin: lead.budgetMin ? Number(lead.budgetMin) : null,
    bookingAmount: lead.bookingAmount ? Number(lead.bookingAmount) : null,
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
      likedPoints: v.likedPoints as string[] | null,
      dislikedPoints: v.dislikedPoints as string[] | null,
    })),
    bookings: lead.bookings.map((b) => ({
      ...b,
      salePrice: Number(b.salePrice),
      totalAmount: Number(b.totalAmount),
      bookingAmount: Number(b.bookingAmount),
      remainingBalance: Number(b.remainingBalance),
      projectName: b.project?.name,
      paymentSchedules: b.paymentSchedules.map((p) => ({
        ...p,
        amount: Number(p.amount),
        paidAmount: p.paidAmount ? Number(p.paidAmount) : null,
      })),
    })),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const {
    status,
    lastStatusRemark,
    trackingProject,
    trackingLocation,
    vcScheduledDate,
    vcScheduledTime,
    nextFollowUpDate,
    nextFollowUpTime,
    notes,
    ...rest
  } = body;

  const activityCreates: { type: "STATUS_CHANGE" | "FOLLOW_UP"; title: string; description?: string }[] = [];

  if (status) {
    activityCreates.push({
      type: "STATUS_CHANGE",
      title: `Status → ${String(status).replace(/_/g, " ")}`,
      description: lastStatusRemark
        ? `${lastStatusRemark}${trackingProject ? ` · Project: ${trackingProject}` : ""}${trackingLocation ? ` · ${trackingLocation}` : ""}`
        : undefined,
    });
  }

  if (status === "VC_SCHEDULED" && vcScheduledDate) {
    activityCreates.push({
      type: "FOLLOW_UP",
      title: "VC Scheduled",
      description: `Video call on ${new Date(vcScheduledDate).toLocaleDateString("en-IN")}${vcScheduledTime ? ` at ${vcScheduledTime}` : ""}`,
    });
  }

  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(status !== undefined && { status }),
      ...(lastStatusRemark !== undefined && { lastStatusRemark }),
      ...(trackingProject !== undefined && { trackingProject }),
      ...(trackingLocation !== undefined && { trackingLocation }),
      ...(vcScheduledDate !== undefined && { vcScheduledDate: vcScheduledDate ? new Date(vcScheduledDate) : null }),
      ...(vcScheduledTime !== undefined && { vcScheduledTime }),
      ...(nextFollowUpDate !== undefined && { nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null }),
      ...(nextFollowUpTime !== undefined && { nextFollowUpTime }),
      ...(notes !== undefined && { notes }),
      ...(activityCreates.length > 0 && { activities: { create: activityCreates } }),
    },
    include: { agent: true, project: true },
  });
  return NextResponse.json(lead);
}
