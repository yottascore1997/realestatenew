import { prisma } from "@/lib/prisma";
import type { RecipientFilter } from "./types";
import { formatPhone } from "./constants";

export async function resolveRecipients(filter: RecipientFilter) {
  if (filter.leadIds?.length) {
    return prisma.lead.findMany({
      where: { id: { in: filter.leadIds } },
      include: { project: { select: { name: true } } },
    });
  }

  return prisma.lead.findMany({
    where: {
      ...(filter.city && { city: filter.city }),
      ...(filter.status && { status: filter.status as never }),
      ...(filter.leadSource && { source: filter.leadSource as never }),
      ...(filter.temperature && { temperature: filter.temperature as never }),
      ...(filter.projectId && { projectId: filter.projectId }),
      status: { notIn: ["LOST"] },
    },
    include: { project: { select: { name: true } } },
  });
}

export function leadPhone(lead: { mobile: string; whatsapp?: string | null }) {
  return formatPhone(lead.whatsapp ?? lead.mobile);
}
