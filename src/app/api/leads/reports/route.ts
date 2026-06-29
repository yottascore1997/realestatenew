import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const agents = await prisma.user.findMany({
    where: { role: { in: ["AGENT", "MANAGER", "ADMIN"] } },
    include: {
      _count: { select: { leads: true } },
      leads: { where: { status: "BOOKED" }, select: { id: true } },
    },
  });
  return NextResponse.json(agents.map((a) => ({
    id: a.id,
    name: a.name,
    avatar: a.avatar,
    totalLeads: a._count.leads,
    bookings: a.leads.length,
    conversionRate: a._count.leads > 0 ? Math.round((a.leads.length / a._count.leads) * 1000) / 10 : 0,
  })));
}
