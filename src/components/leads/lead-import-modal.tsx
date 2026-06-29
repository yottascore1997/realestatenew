"use client";

import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, X, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseLeadRows } from "@/lib/leads/import-utils";

interface LeadImportModalProps {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

export function LeadImportModal({ open, onClose, onImported }: LeadImportModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);

  if (!open) return null;

  const parseFile = async (file: File) => {
    setLoading(true);
    setResult(null);
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const { leads, skipped: parseSkipped } = parseLeadRows(rows);

      if (leads.length === 0) {
        setResult({
          imported: 0,
          skipped: parseSkipped || rows.length,
          errors: [
            parseSkipped > 0
              ? "No valid rows — each row needs Name and a 10-digit Mobile."
              : "File is empty or missing Name / Mobile columns.",
          ],
        });
        return;
      }

      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ imported: 0, skipped: parseSkipped, errors: [data.error || "Import failed"] });
        return;
      }
      setResult({ ...data, skipped: (data.skipped ?? 0) + parseSkipped });
      if (data.imported > 0) onImported();
    } catch {
      setResult({ imported: 0, skipped: 0, errors: ["Failed to parse file. Use Excel with at least Name and Mobile columns."] });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = "Name,Mobile\nRahul Sharma,9876543210\nPriya Patel,9123456789\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lead-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-[#4F6BF5]" />
            <h3 className="text-lg font-bold text-slate-900">Import Leads from Excel</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Upload .xlsx or .csv file. Only <strong>Name</strong> and <strong>Mobile</strong> are required — other columns (Email, Source, Budget, Notes) are optional.
        </p>

        <button
          type="button"
          onClick={downloadTemplate}
          className="mb-4 flex items-center gap-2 text-sm text-[#4F6BF5] hover:underline"
        >
          <Download className="h-4 w-4" /> Download sample template
        </button>

        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-10 text-center transition-colors hover:border-[#4F6BF5] hover:bg-blue-50/30"
        >
          {loading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4F6BF5]" />
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700">Click to upload Excel / CSV</p>
              <p className="text-xs text-slate-400">.xlsx, .xls, .csv supported</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && parseFile(e.target.files[0])}
        />

        {result && (
          <div className={`mt-4 rounded-lg p-3 text-sm ${result.imported > 0 ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
            <p>Imported: {result.imported} | Skipped: {result.skipped}</p>
            {result.errors.length > 0 && (
              <ul className="mt-1 list-disc pl-4 text-xs">{result.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}</ul>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  );
}
