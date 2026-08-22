export function renderTemplate(
  body: string,
  vars: Record<string, string | null | undefined>,
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const val = vars[key];
    return val != null && val !== "" ? String(val) : `{{${key}}}`;
  });
}

export function extractVariables(body: string): string[] {
  const matches = body.match(/\{\{(\w+)\}\}/g) ?? [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

export function leadVariables(lead: {
  fullName: string;
  city?: string | null;
  mobile: string;
  trackingProject?: string | null;
  preferredLocation?: string | null;
  project?: { name: string } | null;
}) {
  return {
    name: lead.fullName.split(" ")[0] ?? lead.fullName,
    fullName: lead.fullName,
    city: lead.city ?? "",
    mobile: lead.mobile,
    project: lead.project?.name ?? lead.trackingProject ?? "our new project",
    location: lead.preferredLocation ?? lead.city ?? "your preferred location",
  };
}
