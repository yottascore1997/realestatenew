"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Gift, User, Phone, Mail, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { BRAND_PHONE } from "@/lib/website/constants";
import type { LaunchLandingData } from "@/lib/website/launch-types";

const POPUP_DELAY_MS = 15000;

const BUDGET_OPTIONS = [
  "Under ₹50 Lakh",
  "₹50 L - ₹1 Cr",
  "₹1 Cr - ₹2 Cr",
  "₹2 Cr - ₹5 Cr",
  "Above ₹5 Cr",
];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK", "Plot / Villa"];

type LaunchLeadPopupProps = {
  launch: LaunchLandingData;
};

export function LaunchLeadPopup({ launch }: LaunchLeadPopupProps) {
  const [open, setOpen] = useState(false);
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
  
  const storageKey = `launch-popup-dismissed-${launch.slug}`;
  const phoneHref = `tel:${BRAND_PHONE.replace(/\s/g, "")}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(storageKey)) return;

    const timer = window.setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dismiss = () => {
    sessionStorage.setItem(storageKey, "1");
    setOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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
          utmSource: "launch-lp-popup-horizontal",
          utmCampaign: launch.slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
      window.setTimeout(dismiss, 2850);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const bhkOptions = launch.bhk ? [...new Set([launch.bhk, ...BHK_OPTIONS])] : BHK_OPTIONS;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0f1729]/60 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden
          />
          
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="launch-popup-title"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-[101] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_32px_80px_rgba(15,23,41,0.3)]"
          >
            {/* Close Button on Top Right */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute right-4 top-4 z-[102] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 p-1.5 transition-all shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Horizontal Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1.85fr] min-h-[350px]">
              
              {/* Left Column (Offer details banner with visual background rendering) */}
              <div className="relative bg-[#0f1729] p-6 sm:p-8 text-white flex flex-col justify-center overflow-hidden">
                {/* Visual background image from launch */}
                {launch.image && (
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={launch.image} 
                      alt="" 
                      className="h-full w-full object-cover opacity-65 filter saturate-[1.15]" 
                    />
                    {/* Balanced dark overlay for image visibility and text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0f1729]/90 via-[#0f1729]/75 to-[#0f1729]/50" />
                  </div>
                )}
                
                {/* Glow spotlight */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-gradient-to-l from-orange-500/10 to-transparent blur-[60px] pointer-events-none z-0" />
                
                <div className="relative z-10 space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/20"
                  >
                    <Gift className="h-5 w-5" />
                  </motion.div>
                  
                  <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">
                    <Sparkles className="h-3.5 w-3.5" /> Limited Time Offer
                  </p>
                  
                  <h3 id="launch-popup-title" className="text-lg sm:text-xl font-black leading-snug">
                    Get Exclusive Pricing for {launch.name}
                  </h3>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Fill details now — get instant floor plans, catalog sheets &amp; pre-launch site visit slots free.
                  </p>
                </div>
              </div>

              {/* Right Column (2-Column Form with Clean Spaced Fields & Colorful Tags) */}
              <div className="p-6 sm:p-8 flex flex-col justify-center bg-slate-50/50">
                {done ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                    <h3 className="mt-4 text-base font-bold text-slate-900">Enquiry Submitted!</h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                      Our coordinator will call you back within <strong>2 hours</strong> with private site visit details.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Full Name (with proper pl-10 standard spacing) */}
                    <div className="relative sm:col-span-2">
                      <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        placeholder="Full Name *"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pl-10 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                      />
                    </div>

                    {/* Mobile (with proper pl-10 standard spacing) */}
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="tel"
                        placeholder="Mobile Number *"
                        value={form.mobile}
                        onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pl-10 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                      />
                    </div>

                    {/* Email (with proper pl-10 standard spacing) */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pl-10 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                      />
                    </div>

                    {/* BHK Dropdown */}
                    <select
                      value={form.bhk}
                      onChange={(e) => setForm((f) => ({ ...f, bhk: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-655 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                    >
                      <option value="">Looking For BHK</option>
                      {bhkOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>

                    {/* Budget Dropdown */}
                    <select
                      value={form.budget}
                      onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-655 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all"
                    >
                      <option value="">Budget Range</option>
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>

                    {error && <p className="text-xs font-bold text-red-500 sm:col-span-2">{error}</p>}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="sm:col-span-2 h-11 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-black text-white uppercase tracking-wider rounded-lg shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      {loading ? "Submitting..." : (
                        <>
                          Get Exclusive Benefits <ArrowRight className="h-4 w-4 shrink-0" />
                        </>
                      )}
                    </button>
                    
                    {/* Trust badges styled in premium distinct high-contrast colors */}
                    <div className="sm:col-span-2 mt-2 pt-2.5 border-t border-slate-200/60 flex items-center justify-center gap-3.5">
                      <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg text-[10px] font-black shadow-sm">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> RERA Approved
                      </span>
                      <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-lg text-[10px] font-black shadow-sm">
                        <Gift className="h-3.5 w-3.5 text-orange-600" /> Free Site Tour Cab
                      </span>
                    </div>

                    {/* Contact Number Callout Ribbon */}
                    <div className="sm:col-span-2 text-center mt-2.5 text-[11px] text-slate-500 font-bold leading-none border-t border-slate-100 pt-3">
                      Questions? Call Specialist: <a href={phoneHref} className="text-orange-600 font-black hover:underline">{BRAND_PHONE}</a>
                    </div>

                  </form>
                )}
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
