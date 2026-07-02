"use client";

import { Mail, Phone, MapPin, MessageSquare, Sparkles } from "lucide-react";
import { ContactTrigger } from "@/components/website/contact-trigger";
import { BRAND_PHONE } from "@/lib/website/constants";

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-600">
            <Sparkles className="h-3.5 w-3.5" /> We&apos;re Here to Help
          </p>
          <h1 className="website-section-title mt-3 text-3xl sm:text-4xl">
            Contact <span className="website-section-title-accent">TriYards</span>
          </h1>
          <p className="website-body-text mx-auto mt-3 max-w-xl text-slate-500">
            Have a question about a property or project? Fill the enquiry form and our experts will get back to you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-emerald-50/50 p-8 shadow-sm">
            <h2 className="font-heading text-xl font-black text-[#111827]">Send an Enquiry</h2>
            <p className="mt-2 text-sm text-slate-500">
              Opens a quick form — takes less than a minute. Your details go straight to our CRM team.
            </p>
            <ContactTrigger
              title="Contact TriYards"
              subtitle="Our property advisors are ready to help you find the perfect home."
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(5,150,105,0.35)] transition-colors hover:bg-emerald-700 sm:w-auto sm:px-8"
            >
              <MessageSquare className="h-4 w-4" />
              Open Enquiry Form
            </ContactTrigger>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <Phone className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Phone</p>
                <a href={`tel:${BRAND_PHONE.replace(/\s/g, "")}`} className="text-sm text-slate-500 hover:text-violet-600">
                  {BRAND_PHONE}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <Mail className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Email</p>
                <p className="text-sm text-slate-500">info@triyards.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <MapPin className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Office</p>
                <p className="text-sm text-slate-500">Bandra West, Mumbai, Maharashtra 400050</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
