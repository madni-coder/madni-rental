'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  Wallet,
  BarChart3,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/tenants', label: 'Tenants', icon: Users },
  { href: '/bills', label: 'Bills', icon: Receipt },
  { href: '/expenses', label: 'Expenses', icon: Wallet },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <aside className="fixed top-0 left-0 w-60 h-screen bg-card border-r border-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Building2 size={16} className="text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-foreground">Razvi Rental</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-100',
                isActive
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user section */}
      <div className="mt-auto border-t border-border p-4 space-y-1">
        <button
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-100"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-destructive transition-colors duration-100"
          onClick={logout}
        >
          <LogOut size={16} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}
