import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const builder = await prisma.builder.update({
    where: { id: params.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.address !== undefined && { address: body.address }),
      ...(body.city !== undefined && { city: body.city }),
      ...(body.gstNumber !== undefined && { gstNumber: body.gstNumber }),
    },
  });
  return NextResponse.json(builder);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.builder.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete — builder has linked projects" }, { status: 409 });
  }
}
