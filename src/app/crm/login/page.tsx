"use client";

import { Suspense } from "react";
import { CrmLoginForm } from "./login-form";

export default function CrmLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center overflow-hidden">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
      </div>
    }>
      <CrmLoginForm />
    </Suspense>
  );
}
