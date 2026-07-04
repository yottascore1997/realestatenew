"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Gift } from "lucide-react";
import { LaunchInquiryForm } from "@/components/website/launch-inquiry-form";
import type { LaunchLandingData } from "@/lib/website/launch-types";

const POPUP_DELAY_MS = 15000;

type LaunchLeadPopupProps = {
  launch: LaunchLandingData;
};

export function LaunchLeadPopup({ launch }: LaunchLeadPopupProps) {
  const [open, setOpen] = useState(false);
  const storageKey = `launch-popup-dismissed-${launch.slug}`;

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
            className="relative z-[101] max-h-[min(90vh,720px)] w-full max-w-md overflow-y-auto"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_32px_80px_rgba(15,23,41,0.35)]">
              <div className="relative bg-[#0f1729] px-5 py-4 text-white">
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20"
                >
                  <Gift className="h-5 w-5 text-orange-400" />
                </motion.div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">
                  <Sparkles className="h-3 w-3" /> Limited Time Offer
                </p>
                <h3 id="launch-popup-title" className="mt-1 text-lg font-extrabold leading-snug">
                  Get Exclusive Pricing for {launch.name}
                </h3>
                <p className="mt-1 text-xs text-white/65">
                  Fill details now — floor plan, site visit &amp; pre-launch benefits free.
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Close"
                  className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 sm:p-5">
                <LaunchInquiryForm
                  launch={launch}
                  variant="hero"
                  utmSource="launch-lp-popup"
                  utmCampaign={launch.slug}
                  onSuccess={() => window.setTimeout(dismiss, 2800)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
