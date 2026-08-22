export const WHATSAPP_NAV = [
  { label: "Dashboard", href: "/crm/whatsapp", icon: "LayoutDashboard" },
  { label: "Contacts", href: "/crm/whatsapp/contacts", icon: "Users" },
  { label: "Campaigns", href: "/crm/whatsapp/campaigns", icon: "Send" },
  { label: "Templates", href: "/crm/whatsapp/templates", icon: "FileText" },
  { label: "Reports", href: "/crm/whatsapp/reports", icon: "BarChart3" },
  { label: "API & Settings", href: "/crm/whatsapp/settings", icon: "Settings" },
] as const;

export const WHATSAPP_PROVIDERS = [
  { key: "NONE", label: "Not connected (Demo mode)", desc: "Messages are simulated until you connect a provider" },
  { key: "META", label: "Meta Cloud API", desc: "Direct WhatsApp Business Platform integration" },
  { key: "INTERAKT", label: "Interakt", desc: "Popular India BSP with easy setup" },
  { key: "WATI", label: "WATI", desc: "WhatsApp team inbox + bulk messaging" },
  { key: "GUPSHUP", label: "Gupshup", desc: "Enterprise messaging API" },
  { key: "MSG91", label: "MSG91", desc: "SMS + WhatsApp combined platform" },
] as const;

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  SENDING: "Sending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export const MESSAGE_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  QUEUED: "Queued",
  SENT: "Sent",
  DELIVERED: "Delivered",
  READ: "Read",
  FAILED: "Failed",
};

export const TEMPLATE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PENDING: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export function pct(part: number, total: number) {
  if (total <= 0) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}
