export const LEAD_PIPELINE = [
  { key: "NEW", label: "New Lead", color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-50", border: "border-blue-200" },
  { key: "ASSIGNED", label: "Assigned", color: "bg-indigo-500", textColor: "text-indigo-700", bgLight: "bg-indigo-50", border: "border-indigo-200" },
  { key: "CONTACTED", label: "Contacted", color: "bg-cyan-500", textColor: "text-cyan-700", bgLight: "bg-cyan-50", border: "border-cyan-200" },
  { key: "INTERESTED", label: "Interested", color: "bg-violet-500", textColor: "text-violet-700", bgLight: "bg-violet-50", border: "border-violet-200" },
  { key: "NOT_INTERESTED", label: "Not Interested", color: "bg-slate-500", textColor: "text-slate-700", bgLight: "bg-slate-100", border: "border-slate-300" },
  { key: "FOLLOW_UP", label: "Follow-up", color: "bg-amber-500", textColor: "text-amber-700", bgLight: "bg-amber-50", border: "border-amber-200" },
  { key: "VC_SCHEDULED", label: "VC Scheduled", color: "bg-sky-500", textColor: "text-sky-700", bgLight: "bg-sky-50", border: "border-sky-200" },
  { key: "SITE_VISIT_SCHEDULED", label: "Visit Scheduled", color: "bg-orange-500", textColor: "text-orange-700", bgLight: "bg-orange-50", border: "border-orange-200" },
  { key: "SITE_VISIT_DONE", label: "Visit Done", color: "bg-teal-500", textColor: "text-teal-700", bgLight: "bg-teal-50", border: "border-teal-200" },
  { key: "NEGOTIATION", label: "Negotiation", color: "bg-purple-500", textColor: "text-purple-700", bgLight: "bg-purple-50", border: "border-purple-200" },
  { key: "BOOKED", label: "Booked", color: "bg-emerald-500", textColor: "text-emerald-700", bgLight: "bg-emerald-50", border: "border-emerald-200" },
  { key: "LOST", label: "Lost", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-50", border: "border-red-200" },
] as const;

export const KANBAN_COLUMNS = [
  { key: "NEW", label: "New" },
  { key: "INTERESTED", label: "Interested" },
  { key: "NOT_INTERESTED", label: "Not Interested" },
  { key: "FOLLOW_UP", label: "Follow-up" },
  { key: "VC_SCHEDULED", label: "VC" },
  { key: "SITE_VISIT_SCHEDULED", label: "Visit" },
  { key: "NEGOTIATION", label: "Negotiation" },
  { key: "BOOKED", label: "Booked" },
  { key: "LOST", label: "Lost" },
] as const;

export const LEAD_SOURCES = [
  { key: "FACEBOOK_ADS", label: "Facebook Ads" },
  { key: "INSTAGRAM_ADS", label: "Instagram Ads" },
  { key: "GOOGLE_ADS", label: "Google Ads" },
  { key: "WEBSITE", label: "Website" },
  { key: "WHATSAPP", label: "WhatsApp" },
  { key: "WALK_IN", label: "Walk-in" },
  { key: "REFERRAL", label: "Referral" },
  { key: "MAGICBRICKS", label: "MagicBricks" },
  { key: "NINETY_NINE_ACRES", label: "99acres" },
  { key: "HOUSING", label: "Housing" },
  { key: "BROKER", label: "Broker" },
  { key: "CALL", label: "Call" },
  { key: "OTHER", label: "Other" },
] as const;

export const LEAD_PRIORITIES = [
  { key: "HIGH", label: "High", icon: "🔴", color: "text-red-600 bg-red-50" },
  { key: "MEDIUM", label: "Medium", icon: "🟠", color: "text-orange-600 bg-orange-50" },
  { key: "LOW", label: "Low", icon: "🟢", color: "text-green-600 bg-green-50" },
] as const;

export const LEAD_TEMPERATURES = [
  { key: "HOT", label: "Hot", icon: "🔥", color: "text-red-600 bg-red-50" },
  { key: "WARM", label: "Warm", icon: "🌤", color: "text-amber-600 bg-amber-50" },
  { key: "COLD", label: "Cold", icon: "❄", color: "text-blue-600 bg-blue-50" },
] as const;

export const PROPERTY_REQUIREMENTS = [
  { key: "PLOT", label: "Plot" },
  { key: "FLAT", label: "Flat" },
  { key: "VILLA", label: "Villa" },
  { key: "COMMERCIAL", label: "Commercial" },
] as const;

export const PURCHASE_PURPOSES = [
  { key: "INVESTMENT", label: "Investment" },
  { key: "SELF_USE", label: "Self Use" },
] as const;

export const FOLLOW_UP_TYPES = [
  { key: "CALL", label: "Call" },
  { key: "EMAIL", label: "Email" },
  { key: "WHATSAPP", label: "WhatsApp" },
  { key: "MEETING", label: "Meeting" },
  { key: "SITE_VISIT", label: "Site Visit" },
  { key: "VC", label: "Video Call (VC)" },
] as const;

export const LEAD_TAGS = [
  "VIP", "Investor", "Urgent", "Cash Buyer", "Loan Buyer", "NRI", "Referral",
] as const;

export const DOCUMENT_TYPES = [
  { key: "PAN", label: "PAN" },
  { key: "AADHAR", label: "Aadhar" },
  { key: "CHEQUE", label: "Cheque" },
  { key: "BOOKING_FORM", label: "Booking Form" },
  { key: "PDF", label: "PDF" },
  { key: "IMAGE", label: "Image" },
  { key: "OTHER", label: "Other" },
] as const;

export function getStatusConfig(status: string) {
  return LEAD_PIPELINE.find((s) => s.key === status) ?? LEAD_PIPELINE[0];
}

export function getSourceLabel(source: string) {
  return LEAD_SOURCES.find((s) => s.key === source)?.label ?? source;
}

export function getPriorityConfig(priority: string) {
  return LEAD_PRIORITIES.find((p) => p.key === priority) ?? LEAD_PRIORITIES[1];
}

export function getTemperatureConfig(temp: string) {
  return LEAD_TEMPERATURES.find((t) => t.key === temp) ?? LEAD_TEMPERATURES[1];
}
