"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Moon,
  Receipt,
  Sun,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  {
    disabled: true,
    icon: LayoutDashboard,
    label: "Dashboard",
    title: "Dashboard will be added later.",
  },
  {
    href: "/properties",
    icon: Building2,
    label: "Properties",
  },
  {
    href: "/tenants",
    icon: Users,
    label: "Tenants",
  },
  {
    disabled: true,
    icon: CreditCard,
    label: "Bills",
    title: "Bill management will be added later.",
  },
  {
    disabled: true,
    icon: Wallet,
    label: "Expenses",
    title: "Expense tracking will be added later.",
  },
  {
    disabled: true,
    icon: BarChart3,
    label: "Reports",
    title: "Reports will be added later.",
  },
];

export function Sidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onMobileClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-border bg-surface transition-transform duration-200 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <Building2 aria-hidden="true" size={18} />
            </div>
            <div>
              <p className="text-base font-bold text-text">Razvi Rental</p>
              <p className="text-xs text-muted">Admin workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-border/30 hover:text-text"
              onClick={toggleTheme}
              type="button"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              aria-label="Close navigation"
              className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-border/30 hover:text-text md:hidden"
              onClick={onMobileClose}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname.startsWith(item.href) : false;

            if (item.disabled) {
              return (
                <button
                  key={item.label}
                  className="flex min-h-11 w-full cursor-not-allowed items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium text-muted opacity-40"
                  disabled
                  title={item.title}
                  type="button"
                >
                  <Icon aria-hidden="true" size={16} />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted hover:bg-border/30 hover:text-text",
                )}
                href={item.href}
                onClick={onMobileClose}
              >
                <Icon aria-hidden="true" size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border p-4">
          <div className="mb-3 rounded-xl border border-border bg-bg/45 p-3">
            <p className="text-sm font-medium text-text">{user?.name ?? "Razvi Admin"}</p>
            <p className="text-xs text-muted">{user?.email ?? "admin@razvi"}</p>
          </div>
          <Button className="w-full justify-center" onClick={logout} size="sm" variant="ghost">
            <LogOut aria-hidden="true" size={16} />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}