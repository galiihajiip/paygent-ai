"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat Assistant", icon: MessageCircle },
  { href: "/dashboard", label: "CFO Dashboard", icon: BarChart3 },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md dark:border-[#1E293B] dark:bg-[#0F172A]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center">
          <Logo size={34} showText />
        </Link>

        <nav className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={
                  "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-colors sm:px-3 sm:text-sm " +
                  (active
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:bg-[#1E293B] dark:hover:text-[#F8FAFC]")
                }
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">
                  {href === "/dashboard"
                    ? "CFO"
                    : href === "/chat"
                      ? "Chat"
                      : "Home"}
                </span>
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
