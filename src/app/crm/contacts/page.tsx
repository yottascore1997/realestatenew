"use client";

import { useEffect, useState } from "react";
import { Contact, Mail, Phone, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
  createdAt: string;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactRecord | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => setContacts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div className="gradient-violet relative overflow-hidden rounded-3xl px-6 py-5 text-white sm:px-8">
        <div className="bg-grid-faint absolute inset-0 opacity-30" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">CRM · Directory</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Contacts</h2>
            <p className="mt-1 text-sm text-white/75">
              <span className="font-bold text-white">{contacts.length}</span> enquiries from website & CRM
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="mt-3 text-sm text-slate-500">Loading contacts...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="crm-card rounded-2xl py-16 text-center">
          <Contact className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No contacts yet</p>
          <p className="mt-1 text-xs text-slate-400">Website enquiry form submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {contacts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c)}
              className="crm-card crm-card-hover rounded-2xl border border-slate-100 bg-white p-5 text-left transition-all hover:border-violet-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                  {initials(c.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 line-clamp-1">{c.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </p>
                  {c.phone && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <Phone className="h-3 w-3 shrink-0" /> {c.phone}
                    </p>
                  )}
                  {c.company && (
                    <span className="mt-2 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      {c.company}
                    </span>
                  )}
                  <p className="mt-2 text-[10px] font-medium text-slate-400">
                    {format(new Date(c.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
                <p className="text-xs text-slate-400">
                  {format(new Date(selected.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4 text-violet-500" /> {selected.email}
              </p>
              {selected.phone && (
                <p className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4 text-violet-500" /> {selected.phone}
                </p>
              )}
              {selected.company && (
                <p className="flex items-center gap-2 text-slate-600">
                  <MessageSquare className="h-4 w-4 text-violet-500" /> {selected.company}
                </p>
              )}
            </div>
            {selected.notes && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Notes</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{selected.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
