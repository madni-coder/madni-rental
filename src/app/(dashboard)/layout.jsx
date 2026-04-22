"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-bg text-text">
        <div className="hidden h-screen w-60 border-r border-border bg-surface md:block" />
        <main className="flex-1 px-4 py-4 md:ml-60 md:px-6 lg:px-8">
          <div className="mb-6 h-10 w-48 animate-pulse rounded-xl bg-border/40" />
          <div className="mb-4 h-16 animate-pulse rounded-2xl bg-surface/80" />
          <div className="h-105 animate-pulse rounded-2xl bg-surface/80" />
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="min-h-screen md:ml-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/85 px-4 py-4 backdrop-blur md:hidden">
          <div>
            <p className="text-sm font-semibold text-text">Razvi Rental</p>
            <p className="text-xs text-muted">Property workspace</p>
          </div>
          <button
            aria-label="Open navigation"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-surface text-text transition-all duration-150 hover:bg-border/30 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
            onClick={() => setMobileOpen(true)}
            type="button"
          >
            <span className="text-lg leading-none">☰</span>
          </button>
        </header>
        <main className="px-4 py-4 md:px-6 md:py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}