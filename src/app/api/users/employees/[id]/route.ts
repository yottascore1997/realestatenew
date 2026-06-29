import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const selectFields = {
  id: true, name: true, email: true, role: true, avatar: true, phone: true,
  department: true, designation: true, employeeCode: true, joiningDate: true, isActive: true, createdAt: true,
};

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.name) data.name = body.name;
  if (body.email) data.email = body.email;
  if (body.phone !== undefined) data.phone = body.phone || null;
  if (body.role) data.role = body.role;
  if (body.department !== undefined) data.department = body.department || null;
  if (body.designation !== undefined) data.designation = body.designation || null;
  if (body.employeeCode !== undefined) data.employeeCode = body.employeeCode || null;
  if (body.joiningDate !== undefined) data.joiningDate = body.joiningDate ? new Date(body.joiningDate) : null;
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
  if (body.password) data.password = await bcrypt.hash(body.password, 10);

  try {
    const user = await prisma.user.update({ where: { id: params.id }, data, select: selectFields });
    return NextResponse.json(user);
  } catch {
    const basic: Record<string, unknown> = {};
    if (body.name) basic.name = body.name;
    if (body.email) basic.email = body.email;
    if (body.phone !== undefined) basic.phone = body.phone;
    if (body.role) basic.role = body.role;
    if (body.password) basic.password = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.update({
      where: { id: params.id },
      data: basic,
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true },
    });
    return NextResponse.json(user);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete — employee may be linked to leads or bookings" }, { status: 409 });
  }
}
