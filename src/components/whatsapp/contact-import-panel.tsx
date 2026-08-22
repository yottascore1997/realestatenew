"use client";

import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Download, Loader2, X } from "lucide-react";
import { parseLeadRows } from "@/lib/leads/import-utils";
import { dedupeImportedContacts } from "@/lib/whatsapp/import-contacts";
import type { ImportedContact } from "@/lib/whatsapp/types";

interface ContactImportPanelProps {
  contacts: ImportedContact[];
  onContactsChange: (contacts: ImportedContact[], meta: { fileName: string; skipped: number }) => void;
}

export function ContactImportPanel({ contacts, onContactsChange }: ContactImportPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [skipped, setSkipped] = useState(0);

  const parseFile = async (file: File) => {
    setLoading(true);
    setError("");
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const { leads, skipped: parseSkipped } = parseLeadRows(rows);
      const imported: ImportedContact[] = dedupeImportedContacts(
        leads.map((l) => ({
          fullName: l.fullName,
          mobile: l.mobile,
          city: l.city,
          email: l.email,
        })),
      );

      if (imported.length === 0) {
        setError(
          parseSkipped > 0
            ? "No valid rows — each row needs Name and a 10-digit Mobile."
            : "File is empty or missing Name / Mobile columns.",
        );
        onContactsChange([], { fileName: file.name, skipped: parseSkipped || rows.length });
        return;
      }

      setFileName(file.name);
      setSkipped(parseSkipped);
      onContactsChange(imported, { fileName: file.name, skipped: parseSkipped });
    } catch {
      setError("Failed to parse file. Use Excel or CSV with Name and Mobile columns.");
      onContactsChange([], { fileName: "", skipped: 0 });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = "Name,Mobile,City\nRahul Sharma,9876543210,Mumbai\nPriya Patel,9123456789,Pune\nAmit Kumar,9988776655,Bangalore\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whatsapp-blast-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setFileName("");
    setSkipped(0);
    setError("");
    onContactsChange([], { fileName: "", skipped: 0 });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Upload <strong>.xlsx</strong>, <strong>.xls</strong> ya <strong>.csv</strong> — columns:{" "}
        <strong>Name</strong>, <strong>Mobile</strong> (required), City / Email optional.
      </p>

      <button
        type="button"
        onClick={downloadTemplate}
        className="flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline"
      >
        <Download className="h-4 w-4" /> Download sample CSV template
      </button>

      <div
        onClick={() => !loading && fileRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-green-200 bg-green-50/40 py-8 text-center transition-colors hover:border-green-400 hover:bg-green-50"
      >
        {loading ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600" />
        ) : (
          <>
            <Upload className="mx-auto h-8 w-8 text-green-600" />
            <p className="mt-2 text-sm font-semibold text-slate-800">Click to upload Excel / CSV</p>
            <p className="text-xs text-slate-500">500–1000 contacts ek saath import kar sakte ho</p>
          </>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) parseFile(file);
        }}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {contacts.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-green-900">
                <FileSpreadsheet className="h-4 w-4" />
                {fileName || "Imported file"}
              </p>
              <p className="mt-1 text-sm text-green-800">
                <strong>{contacts.length.toLocaleString("en-IN")}</strong> contacts ready for blast
                {skipped > 0 && (
                  <span className="text-green-700"> · {skipped} rows skipped (invalid / duplicate)</span>
                )}
              </p>
            </div>
            <button type="button" onClick={clear} className="rounded-lg p-1 text-green-700 hover:bg-green-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-white/80 text-xs">
            <table className="w-full">
              <thead className="sticky top-0 bg-white text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Name</th>
                  <th className="px-3 py-2 text-left font-semibold">Mobile</th>
                  <th className="px-3 py-2 text-left font-semibold">City</th>
                </tr>
              </thead>
              <tbody>
                {contacts.slice(0, 8).map((c, i) => (
                  <tr key={`${c.mobile}-${i}`} className="border-t border-green-100">
                    <td className="px-3 py-1.5 text-slate-800">{c.fullName}</td>
                    <td className="px-3 py-1.5 text-slate-600">{c.mobile}</td>
                    <td className="px-3 py-1.5 text-slate-500">{c.city ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length > 8 && (
              <p className="border-t border-green-100 px-3 py-2 text-slate-500">
                + {(contacts.length - 8).toLocaleString("en-IN")} more contacts
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
