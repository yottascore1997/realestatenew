import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { resolveRecipients, leadPhone } from "@/lib/whatsapp/recipients";
import { formatPhone } from "@/lib/whatsapp/constants";
import { processCampaignSend } from "@/lib/whatsapp/send-campaign";
import { dedupeImportedContacts } from "@/lib/whatsapp/import-contacts";
import type { ImportedContact, RecipientFilter } from "@/lib/whatsapp/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const campaigns = await prisma.whatsAppCampaign.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      template: { select: { name: true } },
      createdBy: { select: { name: true } },
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json(campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    totalRecipients: c.totalRecipients,
    sentCount: c.sentCount,
    deliveredCount: c.deliveredCount,
    readCount: c.readCount,
    failedCount: c.failedCount,
    templateName: c.template?.name ?? null,
    createdBy: c.createdBy?.name ?? null,
    createdAt: c.createdAt,
    scheduledAt: c.scheduledAt,
    startedAt: c.startedAt,
    completedAt: c.completedAt,
    messageCount: c._count.messages,
  })));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, templateId, messageBody, recipientFilter, importedContacts, sendNow, scheduledAt } = body as {
    name: string;
    templateId?: string;
    messageBody: string;
    recipientFilter?: RecipientFilter;
    importedContacts?: ImportedContact[];
    sendNow?: boolean;
    scheduledAt?: string;
  };

  if (!name?.trim() || !messageBody?.trim()) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }

  const fileContacts = dedupeImportedContacts(importedContacts ?? []);
  const useFileImport = fileContacts.length > 0;

  let totalRecipients = 0;
  let filterPayload: Prisma.InputJsonValue;
  let messageCreates: {
    leadId?: string;
    phone: string;
    recipientName: string;
    body: string;
    status: "PENDING";
  }[] = [];

  if (useFileImport) {
    totalRecipients = fileContacts.length;
    filterPayload = {
      recipientSource: "file_import",
      fileName: recipientFilter?.fileName,
      contacts: fileContacts,
    } as Prisma.InputJsonValue;
    messageCreates = fileContacts.map((c) => ({
      phone: formatPhone(c.mobile),
      recipientName: c.fullName,
      body: messageBody,
      status: "PENDING" as const,
    }));
  } else {
    const leads = await resolveRecipients(recipientFilter ?? {});
    if (leads.length === 0) {
      return NextResponse.json({ error: "No recipients match your filters" }, { status: 400 });
    }
    totalRecipients = leads.length;
    filterPayload = { recipientSource: "crm", ...(recipientFilter ?? {}) } as Prisma.InputJsonValue;
    messageCreates = leads.map((lead) => ({
      leadId: lead.id,
      phone: leadPhone(lead),
      recipientName: lead.fullName,
      body: messageBody,
      status: "PENDING" as const,
    }));
  }

  const campaign = await prisma.whatsAppCampaign.create({
    data: {
      name: name.trim(),
      templateId: templateId || null,
      messageBody,
      recipientFilter: filterPayload,
      totalRecipients,
      status: sendNow ? "SENDING" : scheduledAt ? "SCHEDULED" : "DRAFT",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      startedAt: sendNow ? new Date() : null,
      messages: { create: messageCreates },
    },
  });

  if (sendNow) {
    let result = await processCampaignSend(campaign.id);
    while (!result.done && result.remaining && result.remaining > 0) {
      result = await processCampaignSend(campaign.id);
    }
  }

  const updated = await prisma.whatsAppCampaign.findUnique({
    where: { id: campaign.id },
    include: { template: { select: { name: true } } },
  });

  return NextResponse.json(updated, { status: 201 });
}
