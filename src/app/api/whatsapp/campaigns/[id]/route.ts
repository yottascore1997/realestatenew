import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processCampaignSend } from "@/lib/whatsapp/send-campaign";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const campaign = await prisma.whatsAppCampaign.findUnique({
    where: { id: params.id },
    include: {
      template: true,
      messages: {
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { lead: { select: { fullName: true, city: true } } },
      },
    },
  });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const campaign = await prisma.whatsAppCampaign.findUnique({ where: { id: params.id } });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (campaign.status === "COMPLETED") {
    return NextResponse.json({ error: "Campaign already completed" }, { status: 400 });
  }

  await prisma.whatsAppCampaign.update({
    where: { id: params.id },
    data: { status: "SENDING", startedAt: new Date() },
  });

  let result = await processCampaignSend(params.id);
  let loops = 0;
  while (!result.done && loops < 200) {
    result = await processCampaignSend(params.id);
    loops++;
  }

  const updated = await prisma.whatsAppCampaign.findUnique({ where: { id: params.id } });
  return NextResponse.json(updated);
}
