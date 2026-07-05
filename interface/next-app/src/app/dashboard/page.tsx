"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, MessageCircle, Radio, Clock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import LinkComponent from "next/link";
import { whatsappService, WhatsAppStatus, AutomationStatus } from "@/services/whatsappService";
import { AtomLoader } from "@/components/shared/AtomLoader";

export default function DashboardOverviewPage() {
  const { wabaConnection, logs, automations, user, connectWaba } = useApp();

  const [whatsappStatus, setWhatsappStatus] =
    useState<WhatsAppStatus | null>(null);
  const [automationStatus, setAutomationStatus] =
    useState<AutomationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ws, as] = await Promise.all([
          whatsappService.getStatus(),
          whatsappService.getAutomationStatus(),
        ]);
        setWhatsappStatus(ws);
        setAutomationStatus(as);

        // Sync AppContext with real backend data
        if (ws.connected) {
          await connectWaba(ws.phone_number, "WhatsApp Business");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Count active automations
  const activeCount = Object.values(automations).filter(Boolean).length;

  const realActiveCount = automationStatus
    ? [
        automationStatus.membership_reminder_enabled,
        automationStatus.rag_bot_enabled,
      ].filter(Boolean).length
    : activeCount;

  // Recent 5 logs
  const recentLogs = logs.slice(0, 5);

  const healthChecks = [
    {
      name: "Meta SDK Authorization",
      ok: whatsappStatus?.connected ?? wabaConnection.isConnected,
    },
    {
      name: "Isolated Token Authentication",
      ok: whatsappStatus?.connected ?? wabaConnection.isConnected,
    },
    {
      name: "WABA Profile Synced",
      ok: whatsappStatus?.status === "CONNECTED",
    },
    {
      name: "Permissions Scope Approved",
      ok: whatsappStatus?.connected &&
          (automationStatus?.configured ?? false),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <AtomLoader size={44} />
          <span className="text-sm font-semibold text-gray-500">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left animate-fade-in select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#010203]">
          Good morning, {user?.businessName || "Business Owner"} 👋
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          Here is your communication automation status overview.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Connection Status Card */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans font-bold text-xs text-gray-400 uppercase tracking-wider">Connection Status</span>
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${((whatsappStatus?.connected ?? wabaConnection.isConnected)) ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
            <span className="font-heading font-extrabold text-lg sm:text-xl text-[#010203]">
              {((whatsappStatus?.connected ?? wabaConnection.isConnected)) ? "Connected" : "Not Linked"}
            </span>
          </div>
          <p className="font-sans text-[11px] text-gray-500 mt-2">
            {((whatsappStatus?.connected ?? wabaConnection.isConnected)) ? "Meta connection active" : "WhatsApp sync required"}
          </p>
        </div>

        {/* Connected Number Card */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans font-bold text-xs text-gray-400 uppercase tracking-wider">Connected Number</span>
            <ShieldCheck className="w-5 h-5 text-gray-400" />
          </div>
          <span className="font-heading font-extrabold text-lg sm:text-xl text-[#010203] block mt-1">
            {wabaConnection.isConnected ? (whatsappStatus?.phone_number || wabaConnection.phoneNumber) : "—"}
          </span>
          <p className="font-sans text-[11px] text-gray-500 mt-2">
            {wabaConnection.isConnected ? `WABA: ${wabaConnection.wabaName}` : "No active number linked"}
          </p>
        </div>

        {/* Active Automations Card */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans font-bold text-xs text-gray-400 uppercase tracking-wider">Active Automations</span>
            <Radio className="w-5 h-5 text-gray-400" />
          </div>
          <span className="font-heading font-extrabold text-lg sm:text-xl text-[#010203] block mt-1">
            {automationStatus ? `${realActiveCount} of 2` : `${activeCount} of 6`}
          </span>
          <p className="font-sans text-[11px] text-gray-500 mt-2">
            Toggled communication workflows
          </p>
        </div>

        {/* Last Sync Card */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans font-bold text-xs text-gray-400 uppercase tracking-wider">Last Sync Check</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <span className="font-heading font-extrabold text-lg sm:text-xl text-[#010203] block mt-1">
            {wabaConnection.isConnected ? (
              whatsappStatus?.last_checked_at
                ? new Date(whatsappStatus.last_checked_at)
                    .toLocaleTimeString([], {
                      hour: "2-digit", minute: "2-digit"
                    })
                : wabaConnection.lastSync || "Never"
            ) : "Never"}
          </span>
          <p className="font-sans text-[11px] text-gray-500 mt-2">
            {wabaConnection.isConnected ? "Automations operating normally" : "Waiting for verification"}
          </p>
        </div>

      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Recent Activity (60%) */}
        <div className="lg:col-span-7 bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h2 className="font-heading font-bold text-lg text-[#010203]">
                Recent Console Activity
              </h2>
              <LinkComponent
                href="/dashboard/activity"
                className="text-xs font-heading font-bold text-[#D8524B] hover:text-[#c0433d] flex items-center gap-1"
              >
                View Full Audit &rarr;
              </LinkComponent>
            </div>

            <div className="flex flex-col gap-6 relative">
              {/* Timeline connecting line */}
              {recentLogs.length > 1 && (
                <div className="absolute left-[15px] top-[10px] bottom-[10px] w-0.5 bg-gray-100 z-0" />
              )}

              {recentLogs.map((log) => (
                <div key={log.id} className="flex gap-4 items-start relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                    log.type === "success" 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                      : "bg-amber-50 border-amber-100 text-amber-600"
                  }`}>
                    <span className="text-sm font-bold">
                      {log.type === "success" ? "✓" : "!"}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-heading font-bold text-sm text-[#010203]">{log.title}</h3>
                      <span className="text-[10px] font-sans text-gray-400 font-medium shrink-0">{log.time}</span>
                    </div>
                    <p className="text-xs font-sans text-gray-500 mt-0.5 leading-relaxed">{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
            <span className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest">
              Secured under compliance logs
            </span>
          </div>
        </div>

        {/* Right Side: Connection Health & Profile Details (40%) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Connection Health checklist */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
            <h2 className="font-heading font-bold text-lg text-[#010203] border-b border-gray-100 pb-4 mb-5">
              Connection Health Status
            </h2>

            <ul className="flex flex-col gap-4">
              {healthChecks.map((item) => (
                <li key={item.name} className="flex items-center justify-between text-sm font-sans text-gray-700">
                  <span>{item.name}</span>
                  {item.ok ? (
                    <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      Pending
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {!wabaConnection.isConnected && (
              <LinkComponent
                href="/dashboard/connection"
                className="w-full flex items-center justify-center gap-2 bg-[#D8524B] text-white hover:bg-[#c0433d] text-xs font-heading font-bold py-3.5 rounded-xl mt-6 shadow-md shadow-[#D8524B]/10 hover:shadow-lg transition-all"
              >
                Set Up Integration
                <ArrowRight className="w-4 h-4" />
              </LinkComponent>
            )}
          </div>

          {/* Quick Security Badge */}
          <div className="bg-[#FFFFA7] text-[#010203] border border-[#FFFFA7] rounded-3xl p-6 text-left flex items-start gap-4">
            <span className="text-2xl mt-0.5">🔒</span>
            <div>
              <h3 className="font-heading font-extrabold text-sm tracking-tight text-[#010203]">
                Meta Encryption Active
              </h3>
              <p className="font-sans text-[11px] text-[#4A4A5A] mt-1 leading-relaxed">
                Your credentials are encrypted and isolated inside Meta WABA environments. Access parameters are verified by automatic system compliance checkers.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
