import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateWhatsAppSettings } from "@/lib/whatsapp/settings";
import { pct } from "@/lib/whatsapp/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const [leadCount, messageStats, campaigns, settings] = await Promise.all([
    prisma.lead.count({ where: { status: { not: "LOST" } } }),
    prisma.whatsAppMessage.groupBy({ by: ["status"], _count: true }),
    prisma.whatsAppCampaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { template: { select: { name: true } } },
    }),
    getOrCreateWhatsAppSettings(),
  ]);

  const count = (s: string) => messageStats.find((m) => m.status === s)?._count ?? 0;
  const sent = count("SENT") + count("DELIVERED") + count("READ");
  const delivered = count("DELIVERED") + count("READ");
  const read = count("READ");
  const failed = count("FAILED");

  return NextResponse.json({
    stats: {
      totalContacts: leadCount,
      messagesSent: sent,
      delivered,
      read,
      failed,
      deliveryRate: pct(delivered, sent),
      readRate: pct(read, sent),
      creditsTotal: settings.creditsTotal,
      creditsUsed: settings.creditsUsed,
      creditsRemaining: settings.creditsTotal - settings.creditsUsed,
      provider: settings.provider,
      isConnected: settings.isConnected,
      demoMode: settings.provider === "NONE" || !settings.isConnected,
    },
    recentCampaigns: campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      date: c.createdAt,
      recipients: c.totalRecipients,
      sent: c.sentCount,
      delivered: c.deliveredCount,
      read: c.readCount,
      failed: c.failedCount,
      status: c.status,
      templateName: c.template?.name ?? null,
    })),
    chart: [
      { name: "Delivered", value: delivered, color: "#22c55e" },
      { name: "Read", value: read, color: "#16a34a" },
      { name: "Failed", value: failed, color: "#ef4444" },
    ],
  });
}
