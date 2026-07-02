import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function serializeLaunch(l: {
  priceFrom: { toString(): string } | null;
  priceTo: { toString(): string } | null;
  [key: string]: unknown;
}) {
  return {
    ...l,
    priceFrom: l.priceFrom ? Number(l.priceFrom) : null,
    priceTo: l.priceTo ? Number(l.priceTo) : null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const featuredOnly = request.nextUrl.searchParams.get("featured") === "true";
    const launches = await prisma.launch.findMany({
      where: featuredOnly ? { featured: true } : undefined,
      orderBy: [{ featured: "desc" }, { launchDate: "asc" }],
      include: { project: { include: { builder: true } } },
    });
    return NextResponse.json(launches.map(serializeLaunch));
  } catch (err) {
    console.error("Launches API error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name?.trim() || !body.city?.trim() || !body.location?.trim()) {
      return NextResponse.json({ error: "Name, city and location are required" }, { status: 400 });
    }

    const slug = body.slug || `${slugify(body.name)}-${Date.now()}`;
    const launch = await prisma.launch.create({
      data: {
        name: body.name.trim(),
        slug,
        description: body.description?.trim() || "",
        location: body.location.trim(),
        city: body.city.trim(),
        status: body.status || "UPCOMING",
        launchDate: body.launchDate ? new Date(body.launchDate) : null,
        image: body.image || null,
        priceFrom: body.priceFrom ? Number(body.priceFrom) : null,
        priceTo: body.priceTo ? Number(body.priceTo) : null,
        builder: body.builder?.trim() || null,
        bhk: body.bhk?.trim() || null,
        possession: body.possession?.trim() || null,
        offer: body.offer?.trim() || null,
        featured: body.featured ?? false,
        projectId: body.projectId || null,
      },
      include: { project: { include: { builder: true } } },
    });
    return NextResponse.json(serializeLaunch(launch), { status: 201 });
  } catch (err) {
    console.error("Launch POST error:", err);
    return NextResponse.json({ error: "Failed to create launch" }, { status: 500 });
  }
}
