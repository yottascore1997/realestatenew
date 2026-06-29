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

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["AGENT", "MANAGER", "ADMIN"] } },
      select: selectFields,
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    });
    return NextResponse.json(users);
  } catch {
    const users = await prisma.user.findMany({
      where: { role: { in: ["AGENT", "MANAGER", "ADMIN"] } },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users.map((u) => ({ ...u, department: null, designation: null, employeeCode: null, joiningDate: null, isActive: true })));
  }
}

export async function POST(request: NextRequest) {
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
    return NextResponse.json({ ...user, department: body.department, designation: body.designation, employeeCode: null, joiningDate: null, isActive: true }, { status: 201 });
  }
}
