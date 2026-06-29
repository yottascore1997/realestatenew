import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const launches = await prisma.launch.findMany({
      orderBy: [{ featured: "desc" }, { launchDate: "asc" }],
      include: { project: true },
    });
    return NextResponse.json(
      launches.map((l) => ({
        ...l,
        priceFrom: l.priceFrom ? Number(l.priceFrom) : null,
        priceTo: l.priceTo ? Number(l.priceTo) : null,
      })),
    );
  } catch (err) {
    console.error("Launches API error:", err);
    return NextResponse.json([]);
  }
}
