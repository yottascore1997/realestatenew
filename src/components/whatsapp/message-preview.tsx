"use client";

import { renderTemplate } from "@/lib/whatsapp/template-render";

interface MessagePreviewProps {
  body: string;
  header?: string;
  footer?: string;
  sampleVars?: Record<string, string>;
}

export function MessagePreview({ body, header, footer, sampleVars }: MessagePreviewProps) {
  const rendered = renderTemplate(body, sampleVars ?? {
    name: "Rahul",
    project: "Royal Gardens Pune",
    location: "Baner, Pune",
    city: "Pune",
  });

  return (
    <div className="mx-auto w-full max-w-[280px]">
      <div className="overflow-hidden rounded-[2rem] border-8 border-slate-800 bg-slate-800 shadow-xl">
        <div className="bg-[#075E54] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
              T
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Triyards</p>
              <p className="text-[10px] text-green-100">Business Account</p>
            </div>
          </div>
        </div>
        <div
          className="min-h-[320px] bg-[#ECE5DD] px-3 py-4"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cdc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        >
          <div className="ml-auto max-w-[92%] rounded-lg rounded-tr-none bg-white px-3 py-2 shadow-sm">
            {header && <p className="mb-1 text-sm font-bold text-slate-900">{header}</p>}
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-800">{rendered}</p>
            {footer && <p className="mt-2 text-[11px] text-slate-500">{footer}</p>}
            <p className="mt-1 text-right text-[10px] text-slate-400">11:30 AM ✓✓</p>
          </div>
        </div>
      </div>
    </div>
  );
}
