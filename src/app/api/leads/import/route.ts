import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { normalizeMobile } from "@/lib/leads/import-utils";

export const dynamic = "force-dynamic";


const VALID_SOURCES = [
  "FACEBOOK_ADS", "INSTAGRAM_ADS", "GOOGLE_ADS", "WEBSITE", "WHATSAPP",
  "WALK_IN", "REFERRAL", "MAGICBRICKS", "NINETY_NINE_ACRES", "HOUSING", "BROKER", "CALL", "OTHER",
];

function normalizeSource(source: string) {
  const upper = source.toUpperCase().replace(/\s+/g, "_");
  return VALID_SOURCES.includes(upper) ? upper : "OTHER";
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { leads } = body as { leads: { fullName: string; mobile: string; email?: string; city?: string; source?: string; budget?: string; notes?: string }[] };

  if (!Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ error: "No leads provided" }, { status: 400 });
  }

  let imported = 0;

  let skipped = 0;
  const errors: string[] = [];

  for (const row of leads) {
    if (!row.fullName?.trim() || !row.mobile?.trim()) {
      skipped++;
      errors.push(`Skipped row — missing name or mobile`);
      continue;
    }

    const mobile = normalizeMobile(row.mobile);
    if (mobile.length < 10) {
      skipped++;
      errors.push(`Skipped ${row.fullName} — invalid mobile`);
      continue;
    }

    const existing = await prisma.lead.findFirst({ where: { mobile } });
    if (existing) {
      skipped++;
      errors.push(`Skipped ${row.fullName} — duplicate mobile`);
      continue;
    }

    try {
      await prisma.lead.create({
        data: {
          fullName: row.fullName.trim(),
          mobile,
          email: row.email?.trim() || null,
          city: row.city?.trim() || null,
          whatsapp: mobile,
          source: normalizeSource(row.source ?? "OTHER") as never,
          budget: row.budget?.trim() || null,
          notes: row.notes?.trim() || null,
          status: "NEW",
          activities: {
            create: { type: "LEAD_CREATED", title: "Imported from Excel", description: "Bulk import" },

          },
        },
      });
      imported++;

    } catch {
      skipped++;
      errors.push(`Failed to import ${row.fullName}`);

    }
  }

  return NextResponse.json({ imported, skipped, errors });

}
