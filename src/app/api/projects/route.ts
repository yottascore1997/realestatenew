import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { builder: true, _count: { select: { properties: true, leads: true } } },
  });
  return NextResponse.json(projects.map((p) => ({
    ...p,
    priceFrom: p.priceFrom ? Number(p.priceFrom) : null,
    priceTo: p.priceTo ? Number(p.priceTo) : null,
  })));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const slug = body.slug || `${slugify(body.name)}-${Date.now()}`;
  const project = await prisma.project.create({
    data: {
      name: body.name,
      slug,
      description: body.description || "",
      location: body.location,
      city: body.city,
      developer: body.developer,
      builderId: body.builderId || null,
      status: body.status || "UNDER_CONSTRUCTION",
      image: body.image,
      totalUnits: body.totalUnits ? Number(body.totalUnits) : null,
      priceFrom: body.priceFrom ? Number(body.priceFrom) : null,
      priceTo: body.priceTo ? Number(body.priceTo) : null,
      featured: body.featured ?? false,
    },
    include: { builder: true },
  });
  return NextResponse.json(project, { status: 201 });
}
