export function toNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  return Number(val);
}

export function formatINR(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export const EXPENSE_CATEGORIES = [
  "Marketing", "Facebook Ads", "Google Ads", "Instagram Ads",
  "Office", "Rent", "Electricity", "Internet", "Staff", "Salary", "Incentives",
  "Project", "Construction", "Material", "Labour", "Misc", "Fuel", "Food", "Travel",
];

export const PAYMENT_MODES = [
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "CASH", label: "Cash" },
  { value: "NEFT", label: "NEFT" },
  { value: "RTGS", label: "RTGS" },
  { value: "CARD", label: "Card" },
];

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PARTIAL_PAID: "Partial Paid",
  FULLY_PAID: "Fully Paid",
  CANCELLED: "Cancelled",
};

export const FINANCE_NAV = [
  { label: "Overview", href: "/crm/finance", icon: "LayoutDashboard" },
  { label: "Bookings", href: "/crm/finance/bookings", icon: "FileText" },
  { label: "Payments", href: "/crm/finance/payments", icon: "Wallet" },
  { label: "Expenses", href: "/crm/finance/expenses", icon: "Receipt" },
  { label: "Outstanding", href: "/crm/finance/outstanding", icon: "Clock" },
] as const;
