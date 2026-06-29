import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.address && { address: body.address }),
        ...(body.city && { city: body.city }),
        ...(body.state !== undefined && { state: body.state || null }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.type && { type: body.type }),
        ...(body.status && { status: body.status }),
        ...(body.bedrooms !== undefined && { bedrooms: Number(body.bedrooms) }),
        ...(body.bathrooms !== undefined && { bathrooms: Number(body.bathrooms) }),
        ...(body.sqft !== undefined && { sqft: body.sqft ? Number(body.sqft) : null }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.projectId !== undefined && { projectId: body.projectId || null }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
      },
      include: { project: true },
    });
    return NextResponse.json({ ...property, price: Number(property.price), sqft: property.sqft ? Number(property.sqft) : null });
  } catch {
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.property.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete — property may be linked to bookings or deals" }, { status: 409 });
  }
}
