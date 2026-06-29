import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


function mapProject(p: {
  id: string; name: string; location: string; city: string; status: string;
  totalUnits: number | null; priceFrom: unknown; priceTo: unknown;
  _count: { properties: number; leads: number };
}) {
  return {
    id: p.id,
    name: p.name,
    location: p.location,
    city: p.city,
    status: p.status,
    totalUnits: p.totalUnits,
    priceFrom: p.priceFrom ? Number(p.priceFrom) : null,
    priceTo: p.priceTo ? Number(p.priceTo) : null,
    propertiesCount: p._count.properties,
    leadsCount: p._count.leads,
  };
}

function statusSummary(projects: { status: string }[]) {
  const summary: Record<string, number> = {
    PLANNING: 0,
    UNDER_CONSTRUCTION: 0,
    READY_TO_MOVE: 0,
    COMPLETED: 0,
  };
  projects.forEach((p) => {
    summary[p.status] = (summary[p.status] ?? 0) + 1;
  });
  return summary;
}

export async function GET() {
  const builders = await prisma.builder.findMany({
    orderBy: { name: "asc" },
    include: {
      projects: {
        select: {
          id: true, name: true, location: true, city: true, status: true,
          totalUnits: true, priceFrom: true, priceTo: true,
          _count: { select: { properties: true, leads: true } },
        },
        orderBy: { name: "asc" },
      },
      _count: { select: { projects: true } },
    },
  });

  const mapped = builders.map((b) => ({
    id: b.id,
    name: b.name,
    company: b.company,
    email: b.email,
    phone: b.phone,
    address: b.address,
    city: b.city,
    gstNumber: b.gstNumber,
    projectCount: b._count.projects,
    projects: b.projects.map(mapProject),
    statusSummary: statusSummary(b.projects),
    activeProjects: b.projects.filter((p) => p.status !== "COMPLETED").length,
  }));

  const totals = {
    builders: mapped.length,
    projects: mapped.reduce((s, b) => s + b.projectCount, 0),
    activeProjects: mapped.reduce((s, b) => s + b.activeProjects, 0),
    byStatus: statusSummary(mapped.flatMap((b) => b.projects.map((p) => ({ status: p.status })))),
  };

  return NextResponse.json({ builders: mapped, totals });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const builder = await prisma.builder.create({
    data: {
      name: body.name,
      company: body.company,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      gstNumber: body.gstNumber,
    },
  });
  return NextResponse.json(builder, { status: 201 });
}
