export type LeadNegotiationMeta = {
  builderPrice?: number;
  customerWants?: number;
  finalOffer?: number;
  managerApprovalPending?: boolean;
  discountRequested?: boolean;
};

export type LeadBookingMeta = {
  project?: string;
  tower?: string;
  floor?: string;
  flat?: string;
  parking?: string;
  bookingDate?: string;
  bookingAmount?: number;
  status?: string;
  tokenAmount?: number;
  tokenTxnId?: string;
  tokenDate?: string;
};

export type LeadConstructionMeta = {
  updates?: { title: string; done?: boolean }[];
  possessionExpected?: string;
};

export type LeadPossessionMeta = {
  date?: string;
  feedbackRating?: number;
  keysHandedOver?: boolean;
};

export type LeadProfileMeta = {
  negotiation?: LeadNegotiationMeta;
  booking?: LeadBookingMeta;
  construction?: LeadConstructionMeta;
  possession?: LeadPossessionMeta;
  documentsSent?: string[];
};

export function parseProfileMeta(raw: unknown): LeadProfileMeta {
  if (!raw || typeof raw !== "object") return {};
  return raw as LeadProfileMeta;
}

export function formatLeadCode(code?: string | null, id?: string): string {
  if (code) return code;
  if (!id) return "TRI000000";
  const num = parseInt(id.replace(/\D/g, "").slice(-6), 16) % 999999;
  return `TRI${String(num).padStart(6, "0")}`;
}
