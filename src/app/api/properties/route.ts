import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


function slugify(title: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

export async function GET() {
  const properties = await prisma.property.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { project: true, agent: true },
  });
  return NextResponse.json(properties.map((p) => ({
    ...p,
    price: Number(p.price),
    sqft: p.sqft ? Number(p.sqft) : null,
  })));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.title?.trim();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const property = await prisma.property.create({
      data: {
        title,
        slug: slugify(title),
        description: body.description?.trim() || title,
        address: body.address?.trim() || body.city || "—",
        city: body.city?.trim() || "—",
        state: body.state?.trim() || null,
        price: Number(body.price) || 0,
        type: body.type || "APARTMENT",
        status: body.status || "FOR_SALE",
        bedrooms: Number(body.bedrooms) || 0,
        bathrooms: Number(body.bathrooms) || 0,
        sqft: body.sqft ? Number(body.sqft) : null,
        image: body.image?.trim() || null,
        projectId: body.projectId || null,
        featured: Boolean(body.featured),
      },
      include: { project: true },
    });
    return NextResponse.json({ ...property, price: Number(property.price) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
