"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Phone, Mail, Send, CheckCircle2, ShieldCheck, Clock, BadgeCheck, Lock, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LaunchLandingData } from "@/lib/website/launch-types";

const BUDGET_OPTIONS = [
  "Under ₹50 Lakh",
  "₹50 L - ₹1 Cr",
  "₹1 Cr - ₹2 Cr",
  "₹2 Cr - ₹5 Cr",
  "Above ₹5 Cr",
];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK", "Plot / Villa"];

type LaunchInquiryFormProps = {
  launch: LaunchLandingData;
  variant?: "card" | "hero" | "banner" | "footer" | "offer";
  className?: string;
  utmSource?: string;
  utmCampaign?: string;
  onSuccess?: () => void;
};

export function LaunchInquiryForm({
  launch,
  variant = "card",
  className,
  utmSource,
  utmCampaign,
  onSuccess,
}: LaunchInquiryFormProps) {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    bhk: launch.bhk ?? "",
    budget: "",
    message: `I'm interested in ${launch.name}. Please share floor plans, pricing & site visit slots.`,
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.mobile.trim()) {
      setError("Please enter your name and mobile number.");
      return;
    }
    const digits = form.mobile.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/launches/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          mobile: form.mobile,
          email: form.email,
          bhk: form.bhk,
          budget: form.budget,
          message: form.message,
          launchSlug: launch.slug,
          launchName: launch.name,
          launchCity: launch.city,
          launchLocation: launch.location,
          projectId: launch.projectId,
          utmSource,
          utmCampaign,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fieldBase =
    "h-11 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-[#0f1729] outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";
  const fieldWithIcon = cn(fieldBase, "pl-10 pr-3");
  const fieldPlain = cn(fieldBase, "px-3");

  const submitBtnClass = cn(
    "flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all disabled:opacity-60",
    variant === "banner"
      ? "h-11 shrink-0 bg-white px-6 text-[#0f1729] hover:bg-slate-100"
      : variant === "footer"
        ? "h-11 bg-emerald-600 px-6 text-white hover:bg-emerald-700 sm:col-span-1"
        : variant === "offer"
          ? "h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:col-span-1 sm:h-11"
          : "h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700"
  );

  const offerField =
    "h-11 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-[#0f1729] outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center",
          className
        )}
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h3 className="mt-4 text-xl font-bold text-[#0f1729]">Thank You!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Our expert will call you within <strong>24 hours</strong> with exclusive details for{" "}
          <strong>{launch.name}</strong>.
        </p>
      </motion.div>
    );
  }

  const bhkOptions = launch.bhk
    ? [...new Set([launch.bhk, ...BHK_OPTIONS])]
    : BHK_OPTIONS;

  const formFields = (
    <>
      <div className="relative">
        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          required
          placeholder="Full Name *"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          className={fieldWithIcon}
        />
      </div>
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          required
          type="tel"
          placeholder="Mobile Number *"
          value={form.mobile}
          onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
          className={fieldWithIcon}
        />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={fieldWithIcon}
        />
      </div>
      <select
        value={form.bhk}
        onChange={(e) => setForm((f) => ({ ...f, bhk: e.target.value }))}
        className={fieldPlain}
      >
        <option value="">Configuration / BHK</option>
        {bhkOptions.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
      {(variant === "card" || variant === "hero") && (
        <select
          value={form.budget}
          onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
          className={fieldPlain}
        >
          <option value="">Budget Range</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      )}
    </>
  );

  if (variant === "offer") {
    return (
      <div
        id="offer-form"
        className={cn(
          "relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 sm:p-6 lg:p-7",
          className
        )}
      >
        <div className="relative border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Limited Slots Left</p>
          </div>
          <h3 className="mt-2 flex items-center gap-2 text-lg font-extrabold text-[#0f1729] sm:text-xl">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Unlock Pre-Launch Benefits
          </h3>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Get price, floor plan &amp; site visit — expert callback within 24 hours. Zero brokerage.
          </p>
        </div>

        <form onSubmit={submit} className="relative mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input required placeholder="Full Name *" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className={cn(offerField, "pl-10")} />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input required type="tel" placeholder="Mobile Number *" value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} className={cn(offerField, "pl-10")} />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={cn(offerField, "pl-10")} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <select value={form.bhk} onChange={(e) => setForm((f) => ({ ...f, bhk: e.target.value }))} className={offerField}>
              <option value="">Looking For</option>
              {bhkOptions.map((b) => (<option key={b} value={b}>{b}</option>))}
            </select>
            <select value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} className={offerField}>
              <option value="">Budget Range</option>
              {BUDGET_OPTIONS.map((b) => (<option key={b} value={b}>{b}</option>))}
            </select>
            <button type="submit" disabled={loading} className={submitBtnClass}>
              {loading ? "Submitting..." : (<><Send className="h-4 w-4" /> Submit Enquiry</>)}
            </button>
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </form>

        <div className="relative mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
          {[
            { icon: ShieldCheck, label: "RERA Verified" },
            { icon: Clock, label: "24hr Callback" },
            { icon: BadgeCheck, label: "Zero Brokerage" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
              <Icon className="h-3.5 w-3.5 text-orange-600" /> {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={cn("w-full", className)}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <input required placeholder="Full Name *" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className={fieldPlain} />
            <input required type="tel" placeholder="Mobile Number *" value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} className={fieldPlain} />
            <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={fieldPlain} />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <select value={form.bhk} onChange={(e) => setForm((f) => ({ ...f, bhk: e.target.value }))} className={fieldPlain}>
              <option value="">Looking For</option>
              {bhkOptions.map((b) => (<option key={b} value={b}>{b}</option>))}
            </select>
            <select value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} className={fieldPlain}>
              <option value="">Budget Range</option>
              {BUDGET_OPTIONS.map((b) => (<option key={b} value={b}>{b}</option>))}
            </select>
            <button type="submit" disabled={loading} className={submitBtnClass}>
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </form>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="h-3 w-3" /> Your details are safe with us. We never share your information.
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={cn("w-full", className)}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              required
              placeholder="Full Name *"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className={fieldPlain}
            />
            <input
              required
              type="tel"
              placeholder="Mobile Number *"
              value={form.mobile}
              onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
              className={fieldPlain}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={fieldPlain}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={form.bhk}
              onChange={(e) => setForm((f) => ({ ...f, bhk: e.target.value }))}
              className={cn(fieldPlain, "flex-1")}
            >
              <option value="">Looking For</option>
              {bhkOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <button type="submit" disabled={loading} className={submitBtnClass}>
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </div>
          {error && <p className="text-sm font-medium text-orange-200">{error}</p>}
        </form>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/55">
          <Lock className="h-3 w-3" /> Your details are safe with us. Zero spam.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === "hero" &&
          "rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-6 lg:w-full",
        variant === "card" &&
          "rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-7",
        className
      )}
    >
      <div className="mb-4 border-b border-slate-100 pb-4">
        <h3 className="text-lg font-extrabold text-[#0f1729] sm:text-xl">Get Best Offers</h3>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Price, floor plan &amp; site visit — callback within 24 hrs. Zero brokerage.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-2.5">
        {formFields}
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className={submitBtnClass}>
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Lock className="h-3 w-3" /> Your details are safe with us. We never share your information.
      </p>
    </div>
  );
}
