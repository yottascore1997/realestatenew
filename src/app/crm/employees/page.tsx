"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Pencil, Trash2, Users, X, Loader2, Mail, Phone,
  Briefcase, Calendar, BadgeCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormSection, FormGrid } from "@/components/ui/form-section";
import {
  EMPLOYEE_DEPARTMENTS, EMPLOYEE_ROLES, ROLE_LABELS,
} from "@/lib/employees/constants";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  avatar?: string | null;
  department?: string | null;
  designation?: string | null;
  employeeCode?: string | null;
  joiningDate?: string | null;
  isActive?: boolean;
  createdAt: string;
}

const emptyForm = {
  name: "", email: "", phone: "", password: "", role: "AGENT",
  department: "Sales", designation: "", employeeCode: "",
  joiningDate: new Date().toISOString().slice(0, 10), isActive: "true",
};

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/users/employees")
      .then((r) => r.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((e) => {
      if (deptFilter && e.department !== deptFilter) return false;
      if (!q) return true;
      return [e.name, e.email, e.phone, e.department, e.designation, e.employeeCode, ROLE_LABELS[e.role]]
        .some((v) => v?.toLowerCase().includes(q));
    });
  }, [employees, search, deptFilter]);

  const activeCount = employees.filter((e) => e.isActive !== false).length;

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (e: Employee) => {
    setEditId(e.id);
    setForm({
      name: e.name, email: e.email, phone: e.phone ?? "", password: "", role: e.role,
      department: e.department ?? "Sales", designation: e.designation ?? "",
      employeeCode: e.employeeCode ?? "",
      joiningDate: e.joiningDate ? new Date(e.joiningDate).toISOString().slice(0, 10) : "",
      isActive: e.isActive === false ? "false" : "true",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setSaving(true);
    const url = editId ? `/api/users/employees/${editId}` : "/api/users/employees";
    const body = {
      ...form,
      isActive: form.isActive === "true",
      password: form.password || undefined,
    };
    const res = await fetch(url, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) { setShowForm(false); load(); }
    else { const d = await res.json(); alert(d.error || "Failed to save"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove employee "${name}"?`)) return;
    const res = await fetch(`/api/users/employees/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else { const d = await res.json(); alert(d.error || "Failed to delete"); }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (loading && employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
        <p className="mt-4 text-sm text-slate-500">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="gradient-violet relative overflow-hidden rounded-3xl px-6 py-5 text-white sm:px-8">
        <div className="bg-grid-faint absolute inset-0 opacity-30" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">CRM · Team</p>
            <h2 className="text-2xl font-extrabold tracking-tight">Employees</h2>
            <p className="mt-1 text-sm text-white/75">
              <span className="font-bold text-white">{activeCount}</span> active · {employees.length} total
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 crm-card">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search name, email, ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 outline-none focus:border-violet-400"
        >
          <option value="">All Departments</option>
          {EMPLOYEE_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="crm-card rounded-2xl py-16 text-center">
          <Users className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No employees found</p>
          <button onClick={openAdd} className="mt-3 text-sm font-semibold text-violet-600 hover:underline">Add your first employee</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className={cn(
                "crm-card crm-card-hover group rounded-2xl border border-slate-100 bg-white p-5",
                emp.isActive === false && "opacity-60"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold text-white shadow-md">
                    {emp.name.charAt(0)}
                  </div>
                  {emp.isActive !== false && (
                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{emp.name}</h3>
                      <p className="text-sm text-violet-600">{emp.designation || ROLE_LABELS[emp.role]}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => openEdit(emp)} className="rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 hover:text-violet-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(emp.id, emp.name)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {emp.employeeCode && (
                    <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{emp.employeeCode}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                  {emp.department ?? "—"} · {ROLE_LABELS[emp.role] ?? emp.role}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                  <span className="truncate">{emp.email}</span>
                </div>
                {emp.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                    {emp.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                  Joined {fmtDate(emp.joiningDate)}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  emp.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                )}>
                  <BadgeCheck className="h-3 w-3" />
                  {emp.isActive !== false ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2 sm:hidden">
                  <button onClick={() => openEdit(emp)} className="text-xs font-semibold text-violet-600">Edit</button>
                  <button onClick={() => handleDelete(emp.id, emp.name)} className="text-xs font-semibold text-rose-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editId ? "Edit Employee" : "Add Employee"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <FormSection title="Personal Info">
              <FormGrid cols={2}>
                <Input label="Full Name *" value={form.name} onChange={(e) => update("name", e.target.value)} />
                <Input label="Employee ID" value={form.employeeCode} onChange={(e) => update("employeeCode", e.target.value)} placeholder="Auto-generated if empty" />
                <Input label="Email *" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                <Input label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                <Input label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => update("joiningDate", e.target.value)} />
                <Select label="Status" value={form.isActive} onChange={(e) => update("isActive", e.target.value)}
                  options={[{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }]} />
              </FormGrid>
            </FormSection>
            <div className="mt-4">
              <FormSection title="Job Details">
                <FormGrid cols={2}>
                  <Select label="Department" value={form.department} onChange={(e) => update("department", e.target.value)}
                    options={EMPLOYEE_DEPARTMENTS.map((d) => ({ value: d, label: d }))} />
                  <Select label="Access Role" value={form.role} onChange={(e) => update("role", e.target.value)}
                    options={EMPLOYEE_ROLES.map((r) => ({ value: r.value, label: r.label }))} />
                  <div className="md:col-span-2">
                    <Input label="Designation" value={form.designation} onChange={(e) => update("designation", e.target.value)} placeholder="e.g. Senior Sales Executive" />
                  </div>
                  <div className="md:col-span-2">
                    <Input label={editId ? "New Password (optional)" : "Password"} type="password" value={form.password}
                      onChange={(e) => update("password", e.target.value)} hint={editId ? "" : "Default: employee123"} />
                  </div>
                </FormGrid>
              </FormSection>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.email.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-60"
              >
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : editId ? "Save Changes" : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
