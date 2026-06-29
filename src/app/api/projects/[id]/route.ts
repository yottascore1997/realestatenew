import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.location && { location: body.location }),
      ...(body.city && { city: body.city }),
      ...(body.developer !== undefined && { developer: body.developer }),
      ...(body.builderId !== undefined && { builderId: body.builderId || null }),
      ...(body.status && { status: body.status }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.totalUnits !== undefined && { totalUnits: body.totalUnits ? Number(body.totalUnits) : null }),
      ...(body.priceFrom !== undefined && { priceFrom: body.priceFrom ? Number(body.priceFrom) : null }),
      ...(body.priceTo !== undefined && { priceTo: body.priceTo ? Number(body.priceTo) : null }),
      ...(body.featured !== undefined && { featured: body.featured }),
    },
    include: { builder: true },
  });
  return NextResponse.json(project);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete — project may be linked to properties, leads or bookings" }, { status: 409 });
  }
}
