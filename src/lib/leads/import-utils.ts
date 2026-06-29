export interface ParsedLeadRow {
  fullName: string;
  mobile: string;
  email?: string;
  city?: string;
  source?: string;
  budget?: string;
  notes?: string;
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function cellToString(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  return String(value).trim();
}

function pickValue(row: Record<string, unknown>, aliases: string[]): string {
  const aliasSet = new Set(aliases.map(normalizeHeader));
  for (const [header, value] of Object.entries(row)) {
    if (aliasSet.has(normalizeHeader(header))) {
      return cellToString(value);
    }
  }
  return "";
}

export function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 10) return digits;
  if (digits.startsWith("91") && digits.length === 12) return digits.slice(-10);
  return digits.slice(-10);
}

export function parseLeadRows(rows: Record<string, unknown>[]): {
  leads: ParsedLeadRow[];
  skipped: number;
} {
  const leads: ParsedLeadRow[] = [];
  let skipped = 0;

  for (const row of rows) {
    const fullName = pickValue(row, [
      "name", "full name", "fullname", "client name", "customer name", "lead name", "contact name",
    ]);
    const mobileRaw = pickValue(row, [
      "mobile", "phone", "mobile no", "phone no", "contact", "contact no",
      "mobile number", "phone number", "whatsapp", "cell", "mob",
    ]);
    const mobile = normalizeMobile(mobileRaw);

    if (!fullName || mobile.length < 10) {
      skipped++;
      continue;
    }

    leads.push({
      fullName,
      mobile,
      email: pickValue(row, ["email", "e-mail", "mail"]) || undefined,
      city: pickValue(row, ["city", "location", "area", "preferred location"]) || undefined,
      source: pickValue(row, ["source", "lead source", "channel"]) || undefined,
      budget: pickValue(row, ["budget", "price range", "budget range"]) || undefined,
      notes: pickValue(row, ["notes", "note", "remarks", "comment", "comments"]) || undefined,
    });
  }

  return { leads, skipped };
}
