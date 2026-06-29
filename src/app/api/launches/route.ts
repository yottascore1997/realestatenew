import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const launches = await prisma.launch.findMany({
    orderBy: [{ featured: "desc" }, { launchDate: "asc" }],
    include: { project: true },
  });
  return NextResponse.json(launches.map((l) => ({
    ...l,
    priceFrom: l.priceFrom ? Number(l.priceFrom) : null,
    priceTo: l.priceTo ? Number(l.priceTo) : null,
  })));
}
