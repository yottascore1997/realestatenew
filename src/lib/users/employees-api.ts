import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateEmployeeCode } from "@/lib/employees/constants";

const selectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  phone: true,
  department: true,
  designation: true,
  employeeCode: true,
  joiningDate: true,
  isActive: true,
  createdAt: true,
};

export async function listEmployees() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["AGENT", "MANAGER", "ADMIN"] } },
      select: selectFields,
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users);
  } catch {
    const users = await prisma.user.findMany({
      where: { role: { in: ["AGENT", "MANAGER", "ADMIN"] } },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(
      users.map((u) => ({
        ...u,
        department: null,
        designation: null,
        employeeCode: null,
        joiningDate: null,
        isActive: true,
      }))
    );
  }
}

export async function createEmployee(request: NextRequest) {
  const body = await request.json();
  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

  const count = await prisma.user.count();
  const password = await bcrypt.hash(body.password || "employee123", 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password,
        role: body.role || "AGENT",
        phone: body.phone || null,
        department: body.department || null,
        designation: body.designation || null,
        employeeCode: body.employeeCode || generateEmployeeCode(count),
        joiningDate: body.joiningDate ? new Date(body.joiningDate) : new Date(),
        isActive: body.isActive !== false,
        avatar: body.avatar || `https://i.pravatar.cc/150?u=${body.email}`,
      },
      select: selectFields,
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password,
        role: body.role || "AGENT",
        phone: body.phone || null,
        avatar: body.avatar || `https://i.pravatar.cc/150?u=${body.email}`,
      },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true },
    });
    return NextResponse.json(
      {
        ...user,
        department: body.department,
        designation: body.designation,
        employeeCode: null,
        joiningDate: null,
        isActive: true,
      },
      { status: 201 }
    );
  }
}

export async function updateEmployee(request: NextRequest, id: string) {
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
    const user = await prisma.user.update({ where: { id }, data, select: selectFields });
    return NextResponse.json(user);
  } catch {
    const basic: Record<string, unknown> = {};
    if (body.name) basic.name = body.name;
    if (body.email) basic.email = body.email;
    if (body.phone !== undefined) basic.phone = body.phone;
    if (body.role) basic.role = body.role;
    if (body.password) basic.password = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.update({
      where: { id },
      data: basic,
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true },
    });
    return NextResponse.json(user);
  }
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete — employee may be linked to leads or bookings" }, { status: 409 });
  }
}
