import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveRecipients, leadPhone } from "@/lib/whatsapp/recipients";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const city = searchParams.get("city") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const temperature = searchParams.get("temperature") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));
  const skip = (page - 1) * limit;

  const where = {
    status: { not: "LOST" as const },
    ...(city && { city }),
    ...(status && { status: status as never }),
    ...(source && { source: source as never }),
    ...(temperature && { temperature: temperature as never }),
    ...(search && {
      OR: [
        { fullName: { contains: search } },
        { mobile: { contains: search } },
        { whatsapp: { contains: search } },
      ],
    }),
  };

  const [total, leads, cities] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        mobile: true,
        whatsapp: true,
        city: true,
        status: true,
        source: true,
        temperature: true,
        createdAt: true,
      },
    }),
    prisma.lead.groupBy({ by: ["city"], where: { city: { not: null } }, _count: true }),
  ]);

  return NextResponse.json({
    total,
    page,
    limit,
    cities: cities.filter((c) => c.city).map((c) => ({ city: c.city!, count: c._count })),
    contacts: leads.map((l) => ({
      id: l.id,
      fullName: l.fullName,
      phone: leadPhone(l),
      city: l.city,
      status: l.status,
      source: l.source,
      temperature: l.temperature,
      createdAt: l.createdAt,
    })),
  });
}
