import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pct } from "@/lib/whatsapp/constants";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const days = parseInt(request.nextUrl.searchParams.get("days") ?? "30", 10);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [campaigns, dailyMessages] = await Promise.all([
    prisma.whatsAppCampaign.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.whatsAppMessage.findMany({
      where: { createdAt: { gte: since }, status: { in: ["SENT", "DELIVERED", "READ", "FAILED"] } },
      select: { createdAt: true, status: true },
    }),
  ]);

  const byDay = new Map<string, { sent: number; delivered: number; read: number; failed: number }>();
  for (const msg of dailyMessages) {
    const key = msg.createdAt.toISOString().slice(0, 10);
    const row = byDay.get(key) ?? { sent: 0, delivered: 0, read: 0, failed: 0 };
    if (msg.status === "FAILED") row.failed++;
    else {
      row.sent++;
      if (msg.status === "DELIVERED" || msg.status === "READ") row.delivered++;
      if (msg.status === "READ") row.read++;
    }
    byDay.set(key, row);
  }

  const totals = campaigns.reduce(
    (acc, c) => ({
      recipients: acc.recipients + c.totalRecipients,
      sent: acc.sent + c.sentCount,
      delivered: acc.delivered + c.deliveredCount,
      read: acc.read + c.readCount,
      failed: acc.failed + c.failedCount,
    }),
    { recipients: 0, sent: 0, delivered: 0, read: 0, failed: 0 },
  );

  return NextResponse.json({
    periodDays: days,
    totals: {
      ...totals,
      deliveryRate: pct(totals.delivered, totals.sent),
      readRate: pct(totals.read, totals.sent),
      failureRate: pct(totals.failed, totals.sent + totals.failed),
    },
    campaigns: campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      totalRecipients: c.totalRecipients,
      sentCount: c.sentCount,
      deliveredCount: c.deliveredCount,
      readCount: c.readCount,
      failedCount: c.failedCount,
      createdAt: c.createdAt,
    })),
    daily: [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({ date, ...stats })),
  });
}
