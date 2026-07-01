import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return formatINR(num);
}

export function formatINR(amount: number) {
  if (!amount || isNaN(amount)) return "₹0";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function formatPriceRange(from: number, to: number) {
  const unit = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)} Cr`;
    return `${(amount / 100000).toFixed(2)} Lac`;
  };
  return `₹ ${unit(from)} to ${unit(to)}`;
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
