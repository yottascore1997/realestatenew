"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/crm/sidebar";
import { Header } from "@/components/crm/header";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/crm/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50/30 to-slate-100">
      <Sidebar />
      <div className="ml-64 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
