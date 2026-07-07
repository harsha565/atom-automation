"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { AtomLoader } from "@/components/shared/AtomLoader";
import Link from "next/link";
import { LayoutDashboard, Radio, Key, ListFilter, ShieldCheck, Settings, HelpCircle, LogOut, MessageCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  // Route guard: Redirect if not authenticated
  useEffect(() => {
    // Check local storage or state
    const auth = localStorage.getItem("buddy_auth");
    if (auth !== "true" && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const tabs = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Automations", href: "/dashboard/automations", icon: Radio },
    { label: "Connection", href: "/dashboard/connection", icon: Key },
    { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
    { label: "Activity", href: "/dashboard/activity", icon: ListFilter },
    { label: "Permissions", href: "/dashboard/permissions", icon: ShieldCheck },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Support", href: "/dashboard/support", icon: HelpCircle },
  ];

  if (!isAuthenticated && typeof window !== "undefined" && localStorage.getItem("buddy_auth") !== "true") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF] font-sans">
        <div className="flex flex-col items-center gap-4">
          <AtomLoader size={44} />
          <span className="text-sm font-semibold text-gray-500">Checking auth token...</span>
        </div>
      </div>
    );
  }

  const businessInitials = user?.businessName ? user.businessName.substring(0, 2).toUpperCase() : "BU";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8FF] text-[#010203] font-sans select-none">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-150 sticky top-0 z-30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo size="sm" href="/dashboard" />

          {/* Right Profile Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#F8F8FF] border border-gray-100 pl-3 pr-4 py-1.5 rounded-full shadow-sm">
              <div className="w-7 h-7 rounded-full bg-[#D8524B] text-white flex items-center justify-center font-heading font-black text-xs">
                {businessInitials}
              </div>
              <span className="font-sans font-bold text-xs text-gray-700 hidden sm:inline">
                {user?.businessName || "Business"}
              </span>
            </div>
            


            <button
              onClick={async () => {
                await logout()
                router.push("/")
              }}
              className="p-2 rounded-full text-gray-400 hover:text-[#D8524B] hover:bg-[#D8524B]/5 transition-all focus:outline-none"
              title="Log Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Secondary Horizontal Sub-Tab Navigation */}
        <div className="bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 overflow-x-auto">
            <nav className="flex items-center gap-6 md:gap-8 min-w-max h-12">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.label}
                    href={tab.href}
                    className={`flex items-center gap-2 h-full border-b-2 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-150 px-1 ${
                      isActive
                        ? "border-[#D8524B] text-[#D8524B]"
                        : "border-transparent text-gray-500 hover:text-[#010203]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel Content Area */}
      <main className="container mx-auto px-6 py-8 flex-grow">
        {children}
      </main>


    </div>
  );
}
