import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const publishedOnly = request.nextUrl.searchParams.get("published") !== "false";
    const testimonials = await prisma.testimonial.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(testimonials);
  } catch (err) {
    console.error("Testimonials GET error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name?.trim() || !body.city?.trim() || !body.text?.trim()) {
      return NextResponse.json({ error: "Name, city and testimonial text are required" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name.trim(),
        role: body.role?.trim() || null,
        city: body.city.trim(),
        text: body.text.trim(),
        rating: body.rating ? Number(body.rating) : 5,
        image: body.image || null,
        avatar: body.avatar || null,
        featured: body.featured ?? false,
        published: body.published ?? true,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
      },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    console.error("Testimonials POST error:", err);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
