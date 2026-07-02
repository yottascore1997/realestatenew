export const CRM_NAV = [
  { label: "Dashboard", href: "/crm", icon: "LayoutDashboard" },
  { label: "Lead Management", href: "/crm/leads", icon: "Users" },
  { label: "Revenue Management", href: "/crm/finance", icon: "IndianRupee" },
  { label: "Properties", href: "/crm/properties", icon: "Building2" },
  { label: "Projects", href: "/crm/projects", icon: "FolderKanban" },
  { label: "New Launches", href: "/crm/launches", icon: "Rocket" },
  { label: "Employees", href: "/crm/employees", icon: "Users" },
  { label: "Builders", href: "/crm/builders", icon: "HardHat" },
  { label: "Contacts", href: "/crm/contacts", icon: "Contact" },
  { label: "Testimonials", href: "/crm/testimonials", icon: "Quote" },
  { label: "Appointments", href: "/crm/appointments", icon: "CalendarCheck" },
  { label: "Calendar", href: "/crm/calendar", icon: "Calendar" },
] as const;

export const CRM_SETTINGS_NAV = [
  { label: "Team", href: "/crm/team", icon: "UsersRound" },
  { label: "Settings", href: "/crm/settings", icon: "Settings" },
] as const;

export const WEBSITE_NAV = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Properties", href: "/properties" },
  { label: "Launches", href: "/launches" },
  { label: "Contact", href: "/contact" },
] as const;

export const LEAD_STATUS_COLORS: Record<string, string> = {
  HOT: "bg-purple-100 text-purple-700",
  NEW: "bg-blue-100 text-blue-700",
  WARM: "bg-orange-100 text-orange-700",
  COLD: "bg-slate-100 text-slate-600",
  CONVERTED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export const DEAL_STAGES = [
  { key: "NEW_LEAD", label: "New Leads", color: "bg-blue-500" },
  { key: "CONTACT_MADE", label: "Contact Made", color: "bg-cyan-500" },
  { key: "PROPERTY_SHOWING", label: "Property Showing", color: "bg-indigo-500" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", color: "bg-violet-500" },
  { key: "NEGOTIATION", label: "Negotiation", color: "bg-amber-500" },
  { key: "CLOSED_WON", label: "Closed Won", color: "bg-emerald-500" },
] as const;
