"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, CheckCircle2, Sparkles, User, Mail, Phone, MessageSquare,
  ShieldCheck, Clock, BadgeCheck, Building2, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactModalOptions } from "@/lib/website/contact-context";

const INQUIRY_OPTIONS = [
  { value: "Buy Property", label: "Buy Property" },
  { value: "Rent Property", label: "Rent Property" },
  { value: "New Projects", label: "New Projects" },
  { value: "Request Site Visit", label: "Request Site Visit" },
  { value: "Home Loan", label: "Home Loan" },
  { value: "Sell Property", label: "Sell Property" },
  { value: "General Enquiry", label: "General Enquiry" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "RERA Verified" },
  { icon: Clock, label: "24hr Response" },
  { icon: BadgeCheck, label: "Zero Brokerage" },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "General Enquiry",
  message: "",
};

const fieldClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#1a2744] focus:ring-4 focus:ring-slate-200";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  options: ContactModalOptions;
};

export function ContactModal({ open, onClose, options }: ContactModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError("");
      setForm({
        ...emptyForm,
        inquiryType: options.inquiryType || "General Enquiry",
        message: options.defaultMessage || "",
      });
    }
  }, [open, options.inquiryType, options.defaultMessage]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          inquiryType: form.inquiryType,
          message: form.message,
          context: options.context,
          source: "Website Popup",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0f1a]/70 backdrop-blur-md"
            onClick={() => !submitting && onClose()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_32px_80px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/80 sm:rounded-2xl lg:min-h-[460px] lg:max-h-[90vh] lg:flex-row"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 lg:right-4 lg:top-4"
            >
              <X className="h-5 w-5" />
            </button>

            {/* LEFT — visual panel */}
            <div className="relative min-h-[200px] shrink-0 overflow-hidden lg:w-[40%] lg:min-h-[460px]">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=700&fit=crop&q=85"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744]/97 via-[#1e3254]/92 to-[#0f1729]/95" />

              <div className="relative flex h-full min-h-[200px] flex-col justify-between p-5 sm:p-6 lg:min-h-[460px] lg:p-7">
                <div>
                  <p className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                    <Sparkles className="h-3 w-3 text-amber-400/90" /> Expert Consultation
                  </p>
                  <h2 className="mt-3 font-heading text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[1.65rem]">
                    {options.title || "Connect With Our"}
                    <span className="mt-1 block text-amber-400/95">Property Advisors</span>
                  </h2>
                  <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-slate-300">
                    {options.subtitle || "Share your requirements and receive personalised guidance from our certified consultants."}
                  </p>
                  {options.context && (
                    <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <Building2 className="h-4 w-4 shrink-0 text-amber-400/90" />
                      <span className="truncate text-xs font-medium text-slate-200">{options.context}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 lg:mt-0">
                  {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-slate-200"
                    >
                      <Icon className="h-3.5 w-3.5 text-amber-400/85" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — form panel */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white p-5 sm:p-6 lg:min-h-[460px] lg:p-7">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-1 flex-col items-center justify-center gap-6 py-4 sm:flex-row sm:gap-10 sm:py-8"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 16 }}
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#1a2744] shadow-lg"
                  >
                      <CheckCircle2 className="h-10 w-10 text-amber-400" strokeWidth={2} />
                    </motion.div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-heading text-2xl font-bold tracking-tight text-[#1a2744] sm:text-3xl">
                        Thank You
                      </h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                        Your enquiry has been received. Our team will contact you within{" "}
                        <span className="font-semibold text-[#1a2744]">24 business hours</span>.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-7 rounded-lg bg-[#1a2744] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#243660]"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col"
                  >
                    <div className="mb-4 border-b border-slate-100 pb-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Enquiry Form
                      </p>
                      <h3 className="mt-1 font-heading text-lg font-bold text-[#1a2744] sm:text-xl">
                        Share your details
                      </h3>
                    </div>

                    {/* Row 1 — horizontal */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          required
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="Full name *"
                          className={fieldClass}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="Email *"
                          className={fieldClass}
                        />
                      </div>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="Phone number"
                          className={fieldClass}
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">Interest</label>
                        <div className="relative">
                          <select
                            value={form.inquiryType}
                            onChange={(e) => update("inquiryType", e.target.value)}
                            className={cn(fieldClass, "cursor-pointer appearance-none pr-9")}
                          >
                            {INQUIRY_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="relative sm:col-span-3">
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">Message</label>
                        <div className="relative">
                          <MessageSquare className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-400" />
                          <textarea
                            rows={3}
                            value={form.message}
                            onChange={(e) => update("message", e.target.value)}
                            placeholder="Describe your requirements..."
                            className="min-h-[84px] w-full resize-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#1a2744] focus:ring-4 focus:ring-slate-200"
                          />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
                    )}

                    <div className="mt-5 flex flex-col items-stretch gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-relaxed text-slate-500 sm:max-w-[58%]">
                        By submitting this form, you consent to being contacted by TriYards regarding your enquiry.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className={cn(
                          "flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1a2744] px-10 text-sm font-semibold text-white transition-colors hover:bg-[#243660] sm:min-w-[210px]",
                          submitting && "opacity-70"
                        )}
                      >
                        {submitting ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Enquiry
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
