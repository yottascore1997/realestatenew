"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/website/brand-logo";
import { LoginShowcase } from "./login-showcase";

export function CrmLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/crm";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <LoginShowcase />

      {/* Right — login form */}
      <div className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-[#faf9fc]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/80 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />

        {/* Mobile background */}
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1200&fit=crop"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a1d]/80 via-[#0c0a1d]/60 to-[#faf9fc]" />
        </div>

        <div className="relative flex h-full items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-[420px]">
            {/* Mobile brand + tagline */}
            <div className="mb-6 text-center lg:hidden">
              <BrandLogo href={null} height={54} variant="full" theme="light" className="mx-auto" />
              <p className="mt-2 text-sm text-white/70">Secure team access</p>
            </div>

            {/* Desktop heading */}
            <div className="mb-7 hidden lg:block">
              <BrandLogo href="/" height={56} variant="full" theme="dark" className="mb-4" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Welcome back</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Sign in to CRM</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Apne account se login karke leads, projects aur revenue manage karein.
              </p>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-2xl shadow-violet-200/25 sm:p-8">
              <div className="mb-5 lg:hidden">
                <h3 className="text-xl font-extrabold text-slate-900">Sign in</h3>
                <p className="mt-0.5 text-sm text-slate-500">Email aur password enter karein</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-[38px] h-4 w-4 text-slate-400" />
                  <Input
                    label="Email Address"
                    type="text"
                    inputMode="email"
                    name="crm-login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    data-lpignore="true"
                    data-1p-ignore
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-[38px] h-4 w-4 text-slate-400" />
                  <Input
                    label="Password"
                    type={showPass ? "text" : "password"}
                    name="crm-login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-[38px] text-slate-400 hover:text-violet-600"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-300/40 transition-all hover:shadow-violet-400/50 hover:brightness-105 disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                  ) : (
                    <>Sign In to Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <Link href="/" className="text-sm font-semibold text-slate-500 transition-colors hover:text-violet-600">
                  ← Back to Website
                </Link>
                <p className="text-[11px] text-slate-400">Need access? Contact admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
