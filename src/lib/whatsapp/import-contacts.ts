import type { ImportedContact, RecipientFilter } from "./types";
import { formatPhone } from "./constants";
import { normalizeMobile } from "@/lib/leads/import-utils";

export function contactVarsFromFilter(
  filter: RecipientFilter | null | undefined,
  msg: { phone: string; recipientName?: string | null },
) {
  const contacts = filter?.contacts ?? [];
  const normalized = normalizeMobile(msg.phone);
  const match = contacts.find(
    (c) => normalizeMobile(c.mobile) === normalized || formatPhone(c.mobile) === msg.phone,
  );

  const fullName = match?.fullName ?? msg.recipientName ?? "Customer";
  return {
    name: fullName.split(" ")[0] ?? fullName,
    fullName,
    city: match?.city ?? "",
    location: match?.city ?? "",
    mobile: msg.phone,
    project: "our new project",
  };
}

export function dedupeImportedContacts(contacts: ImportedContact[]): ImportedContact[] {
  const seen = new Set<string>();
  const out: ImportedContact[] = [];
  for (const c of contacts) {
    const key = normalizeMobile(c.mobile);
    if (key.length < 10 || seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}
