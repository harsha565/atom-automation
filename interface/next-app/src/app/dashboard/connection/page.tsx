"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ShieldCheck, MessageCircle, AlertTriangle, RefreshCw, LogOut, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { whatsappService, WhatsAppStatus } from "@/services/whatsappService";
import { AtomLoader } from "@/components/shared/AtomLoader";

export default function ConnectionManagementPage() {
  const { wabaConnection, disconnectWaba, addLog, connectWaba } = useApp();
  const router = useRouter();
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await whatsappService.getStatus();
        setWhatsappStatus(status);
        if (status.connected) {
          await connectWaba(status.phone_number, "WhatsApp Business");
        }
      } catch (err) {
        console.error("Connection status error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const status = await whatsappService.getStatus();
      setWhatsappStatus(status);
      if (status.connected) {
        await connectWaba(status.phone_number, "WhatsApp Business");
      }
      addLog(
        "success",
        "Synchronization Checked",
        "Status refreshed from backend successfully."
      );
    } catch {
      addLog("error", "Refresh Failed", "Could not reach backend.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReconnect = () => {
    // Directs to onboarding flow
    router.push("/dashboard/connect");
  };

  const handleConfirmDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await whatsappService.disconnect();
      disconnectWaba();
      setWhatsappStatus(null);
      setIsDisconnectModalOpen(false);
      addLog(
        "warning",
        "Connection Terminated",
        "WhatsApp account synchronization was revoked."
      );
      router.push("/dashboard/connect");
    } catch {
      addLog("error", "Disconnect Failed", "Could not disconnect. Please try again.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const permissions = [
    { name: "whatsapp_business_messaging", scope: "Send template notifications", status: "Active" },
    { name: "whatsapp_business_management", scope: "Read profile and template names", status: "Active" },
    { name: "business_management", scope: "Verify client account links", status: "Active" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AtomLoader size={44} />
      </div>
    );
  }

  if (!isLoading && !whatsappStatus?.connected && !wabaConnection.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center select-none max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center mb-6">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203]">
          No WhatsApp Account Connected
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-2 leading-relaxed">
          Atom Automation requires a WhatsApp Business Account connection to sync templates and dispatch automated notifications.
        </p>
        <Link
          href="/dashboard/connect"
          className="w-full flex items-center justify-center bg-[#D8524B] text-white hover:bg-[#c0433d] text-sm font-heading font-bold py-3.5 rounded-full mt-8 shadow-md"
        >
          Connect Account Now
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left animate-fade-in select-none relative">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#010203]">
          Connection Management
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          Review credentials, update permission tokens, or disconnect your linked phone number.
        </p>
      </div>

      {/* Connected Account Card */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-emerald-600" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#010203]">
                  {whatsappStatus?.phone_number || wabaConnection.phoneNumber}
                </h3>
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-heading font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              </div>
              <p className="font-sans text-xs text-gray-500 mt-1">
                WABA Profile Name: <span className="font-semibold text-gray-700">{wabaConnection.wabaName}</span>
              </p>
              <p className="font-sans text-[10px] text-gray-400 mt-0.5">
                Last checked: {whatsappStatus?.last_checked_at
                  ? new Date(whatsappStatus.last_checked_at)
                      .toLocaleTimeString([], {
                        hour: "2-digit", minute: "2-digit"
                      })
                  : wabaConnection.lastSync || "Just now"}
              </p>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-bold text-gray-700 px-4 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#D8524B]" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            
            <button
              onClick={handleReconnect}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-bold text-gray-700 px-4 py-2.5 rounded-xl transition-all"
            >
              Reconnect
            </button>

            <button
              onClick={() => setIsDisconnectModalOpen(true)}
              className="flex items-center gap-1.5 bg-red-50 border border-red-100 hover:bg-red-100/60 text-xs font-heading font-bold text-red-600 px-4 py-2.5 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Permissions details list */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-heading font-bold text-lg text-[#010203] border-b border-gray-100 pb-4 mb-5">
          Active Authorization Permissions
        </h2>

        <div className="flex flex-col gap-4">
          {permissions.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 text-sm font-sans"
            >
              <div>
                <span className="font-bold text-gray-750 block">{p.scope}</span>
                <span className="text-[10px] font-mono text-gray-400 font-semibold uppercase">{p.name}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {p.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disconnect Confirmation Modal Overlay */}
      {isDisconnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010203]/40 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-[400px] bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-2xl text-left animate-slide-up">
            
            {/* Warning icon */}
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-5">
              <AlertTriangle className="w-6 h-6" />
            </div>

            {/* Content */}
            <h3 className="font-heading font-extrabold text-xl text-[#010203]">
              Disconnect WhatsApp Account?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
              This action will revoke the active synchronization token with Meta. All automated workflows, renewal alerts, and appointment notifications will halt immediately.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setIsDisconnectModalOpen(false)}
                className="w-1/2 bg-white border border-gray-250 text-gray-700 font-heading font-bold text-xs h-11 rounded-xl hover:bg-gray-50"
              >
                Keep Connected
              </button>
              
              <button
                onClick={handleConfirmDisconnect}
                disabled={isDisconnecting}
                className="w-1/2 bg-[#D8524B] hover:bg-[#c0433d] text-white font-heading font-bold text-xs h-11 rounded-xl shadow-md disabled:opacity-50"
              >
                {isDisconnecting ? "Disconnecting..." : "Yes, Disconnect"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
