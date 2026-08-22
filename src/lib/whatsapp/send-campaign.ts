import { prisma } from "@/lib/prisma";
import { getWhatsAppProvider } from "./providers";
import { contactVarsFromFilter } from "./import-contacts";
import type { RecipientFilter } from "./types";
import { leadVariables, renderTemplate } from "./template-render";

const BATCH_SIZE = 25;

export interface CampaignSendResult {
  done: boolean;
  processed: number;
  sent?: number;
  failed?: number;
  remaining?: number;
}

export async function processCampaignSend(campaignId: string): Promise<CampaignSendResult> {
  const campaign = await prisma.whatsAppCampaign.findUnique({
    where: { id: campaignId },
    include: { template: true },
  });
  if (!campaign || campaign.status === "CANCELLED") {
    return { done: true, processed: 0 };
  }

  const recipientFilter = (campaign.recipientFilter ?? {}) as RecipientFilter;

  const settings = await prisma.whatsAppSettings.findFirst();
  const provider = getWhatsAppProvider(settings?.provider ?? "NONE");

  const pending = await prisma.whatsAppMessage.findMany({
    where: { campaignId, status: { in: ["PENDING", "QUEUED"] } },
    take: BATCH_SIZE,
    include: { lead: { include: { project: { select: { name: true } } } } },
  });

  if (pending.length === 0) {
    const remaining = await prisma.whatsAppMessage.count({
      where: { campaignId, status: { in: ["PENDING", "QUEUED"] } },
    });
    if (remaining === 0) {
      await prisma.whatsAppCampaign.update({
        where: { id: campaignId },
        data: { status: "COMPLETED", completedAt: new Date() },
      });
    }
    return { done: true, processed: 0 };
  }

  let sent = 0;
  let delivered = 0;
  let read = 0;
  let failed = 0;

  for (const msg of pending) {
    await prisma.whatsAppMessage.update({
      where: { id: msg.id },
      data: { status: "QUEUED" },
    });

    const vars = msg.lead
      ? leadVariables(msg.lead)
      : contactVarsFromFilter(recipientFilter, msg);

    const body = renderTemplate(msg.body, vars);
    const result = await provider.sendMessage({ phone: msg.phone, body });

    if (result.success) {
      sent++;
      const roll = Math.random();
      const status = roll > 0.35 ? "READ" : roll > 0.05 ? "DELIVERED" : "SENT";
      if (status === "DELIVERED" || status === "READ") delivered++;
      if (status === "READ") read++;

      await prisma.whatsAppMessage.update({
        where: { id: msg.id },
        data: {
          body,
          status: status as never,
          providerMessageId: result.providerMessageId,
          sentAt: new Date(),
          deliveredAt: status !== "SENT" ? new Date() : null,
          readAt: status === "READ" ? new Date() : null,
        },
      });

      if (msg.leadId) {
        await prisma.leadActivity.create({
          data: {
            leadId: msg.leadId,
            type: "WHATSAPP",
            title: "WhatsApp campaign message sent",
            description: `Campaign: ${campaign.name}`,
          },
        });
      }
    } else {
      failed++;
      await prisma.whatsAppMessage.update({
        where: { id: msg.id },
        data: { status: "FAILED", errorMessage: result.error ?? "Send failed" },
      });
    }
  }

  const counts = await prisma.whatsAppMessage.groupBy({
    by: ["status"],
    where: { campaignId },
    _count: true,
  });

  const stat = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  await prisma.whatsAppCampaign.update({
    where: { id: campaignId },
    data: {
      sentCount: stat("SENT") + stat("DELIVERED") + stat("READ"),
      deliveredCount: stat("DELIVERED") + stat("READ"),
      readCount: stat("READ"),
      failedCount: stat("FAILED"),
    },
  });

  if (settings) {
    await prisma.whatsAppSettings.update({
      where: { id: settings.id },
      data: { creditsUsed: { increment: sent } },
    });
  }

  const left = await prisma.whatsAppMessage.count({
    where: { campaignId, status: { in: ["PENDING", "QUEUED"] } },
  });

  if (left === 0) {
    await prisma.whatsAppCampaign.update({
      where: { id: campaignId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    return { done: true, processed: pending.length, sent, failed };
  }

  return { done: false, processed: pending.length, sent, failed, remaining: left };
}