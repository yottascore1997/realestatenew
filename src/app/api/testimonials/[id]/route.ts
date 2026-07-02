import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.role !== undefined && { role: body.role || null }),
        ...(body.city && { city: body.city }),
        ...(body.text !== undefined && { text: body.text }),
        ...(body.rating !== undefined && { rating: Number(body.rating) }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.avatar !== undefined && { avatar: body.avatar || null }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
        ...(body.published !== undefined && { published: Boolean(body.published) }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      },
    });
    return NextResponse.json(testimonial);
  } catch (err) {
    console.error("Testimonial PATCH error:", err);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.testimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 409 });
  }
}
