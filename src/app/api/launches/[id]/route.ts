import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function serializeLaunch(l: Awaited<ReturnType<typeof prisma.launch.findUnique>>) {
  if (!l) return null;
  return {
    ...l,
    priceFrom: l.priceFrom ? Number(l.priceFrom) : null,
    priceTo: l.priceTo ? Number(l.priceTo) : null,
  };
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const launch = await prisma.launch.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.location && { location: body.location }),
        ...(body.city && { city: body.city }),
        ...(body.status && { status: body.status }),
        ...(body.launchDate !== undefined && {
          launchDate: body.launchDate ? new Date(body.launchDate) : null,
        }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.priceFrom !== undefined && {
          priceFrom: body.priceFrom ? Number(body.priceFrom) : null,
        }),
        ...(body.priceTo !== undefined && {
          priceTo: body.priceTo ? Number(body.priceTo) : null,
        }),
        ...(body.builder !== undefined && { builder: body.builder || null }),
        ...(body.bhk !== undefined && { bhk: body.bhk || null }),
        ...(body.possession !== undefined && { possession: body.possession || null }),
        ...(body.offer !== undefined && { offer: body.offer || null }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
        ...(body.projectId !== undefined && { projectId: body.projectId || null }),
      },
      include: { project: { include: { builder: true } } },
    });
    return NextResponse.json(serializeLaunch(launch));
  } catch (err) {
    console.error("Launch PATCH error:", err);
    return NextResponse.json({ error: "Failed to update launch" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.launch.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete launch" }, { status: 409 });
  }
}
