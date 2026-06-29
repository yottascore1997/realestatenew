"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Bell, ChevronDown, LogOut, Settings, Menu } from "lucide-react";

interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  AGENT: "Agent",
};

export function Header({ title, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/crm/login");
    router.refresh();
  };

  const avatar = user?.avatar || `https://i.pravatar.cc/150?u=${user?.email ?? "user"}`;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:h-16 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">{title}</h1>}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search leads, properties, deals..."
            className="h-10 w-80 rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <Link href="/crm/leads/new">
          <button className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:brightness-110 sm:px-3.5">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New</span>
          </button>
        </Link>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-600">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-1 flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 py-1 pl-1 pr-3 transition-colors hover:bg-violet-50"
          >
            <img src={avatar} alt={user?.name ?? "User"} className="h-8 w-8 rounded-lg object-cover ring-2 ring-violet-100" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900">{user?.name ?? "Loading..."}</p>
              <p className="text-[10px] font-medium text-violet-600">{ROLE_LABEL[user?.role ?? ""] ?? user?.role ?? ""}</p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <Link
                href="/crm/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
              >
                <Settings className="h-4 w-4" /> Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
