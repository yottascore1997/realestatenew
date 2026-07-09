"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND_PHONE } from "@/lib/website/constants";

export function FloatingContactCta() {
  const [isOpen, setIsOpen] = useState(true);
  const cleanPhone = BRAND_PHONE.replace(/\s/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone.replace("+", "")}?text=Hello!%20I%20am%20interested%20in%20properties%20listed%20on%20your%20website.`;
  const telUrl = `tel:${cleanPhone}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-3">
            {/* WhatsApp Chat Button */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-lg shadow-green-500/20 transition-transform focus:outline-none"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="h-5 w-5 fill-current" />
              <span className="text-sm font-semibold">WhatsApp Us</span>
            </motion.a>

            {/* Direct Call Button */}
            <motion.a
              href={telUrl}
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              transition={{ delay: 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 items-center gap-2 rounded-full bg-violet-600 px-4 text-white shadow-lg shadow-violet-500/20 transition-transform focus:outline-none"
              title="Call Us"
            >
              <Phone className="h-4 w-4" fill="currentColor" />
              <span className="text-sm font-semibold">Call Now</span>
            </motion.a>
          </div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f1729] text-white shadow-lg shadow-slate-900/20 transition-colors hover:bg-slate-800 focus:outline-none"
        title={isOpen ? "Hide contact options" : "Show contact options"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {isOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="relative">
              <Phone className="h-5 w-5 animate-pulse" />
              <span className="absolute -right-1 -top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
              </span>
            </div>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
