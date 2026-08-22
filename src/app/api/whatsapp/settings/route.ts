import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateWhatsAppSettings } from "@/lib/whatsapp/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getOrCreateWhatsAppSettings();
  return NextResponse.json({
    ...settings,
    apiToken: settings.apiToken ? "••••••••" + settings.apiToken.slice(-4) : null,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const settings = await getOrCreateWhatsAppSettings();

  const provider = body.provider ?? settings.provider;
  const hasCreds = Boolean(body.apiToken || settings.apiToken) && provider !== "NONE";

  const updated = await prisma.whatsAppSettings.update({
    where: { id: settings.id },
    data: {
      provider,
      phoneNumberId: body.phoneNumberId ?? settings.phoneNumberId,
      businessAccountId: body.businessAccountId ?? settings.businessAccountId,
      webhookVerifyToken: body.webhookVerifyToken ?? settings.webhookVerifyToken,
      creditsTotal: body.creditsTotal ?? settings.creditsTotal,
      ...(body.apiToken && body.apiToken !== "••••••••" && !body.apiToken.startsWith("••••")
        ? { apiToken: body.apiToken }
        : {}),
      isConnected: body.isConnected ?? (provider !== "NONE" && hasCreds),
    },
  });

  return NextResponse.json({
    ...updated,
    apiToken: updated.apiToken ? "••••••••" + updated.apiToken.slice(-4) : null,
  });
}
