"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  CalendarPlus,
  FileCheck,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/events/create",
      label: "Events",
      icon: CalendarPlus,
      exact: false,
    },
    {
      href: "/admin/certificates",
      label: "Certificates",
      icon: FileCheck,
      exact: false,
    },
    {
      href: "/admin/management",
      label: "Management",
      icon: Settings,
      exact: false,
    },
  ];

  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="glass sticky top-0 z-50 w-full px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <Link
            href="/admin"
            className="font-bold text-lg tracking-wide transition hover:text-primary"
          >
            Admin Portal
          </Link>
        </div>

        {/* Center Menu */}
        <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full p-1 border border-border">
          {navItems.map((item) => {
             const active = isActive(item.href, item.exact);
             return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full gap-2 px-4 transition-all",
                    active && "bg-background shadow-sm text-foreground hover:bg-background"
                  )}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </Button>
              </Link>
             )
          })}
        </div>

        {/* Right Side: Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
        >
          <LogOut className="h-4 w-4" />{" "}
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
