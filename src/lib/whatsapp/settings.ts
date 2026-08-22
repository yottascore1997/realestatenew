import { prisma } from "@/lib/prisma";

export async function getOrCreateWhatsAppSettings() {
  let settings = await prisma.whatsAppSettings.findFirst();
  if (!settings) {
    settings = await prisma.whatsAppSettings.create({ data: {} });
  }
  return settings;
}
