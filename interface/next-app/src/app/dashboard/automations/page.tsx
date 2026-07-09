"use client";

import React, { useEffect, useState } from "react";
import { useApp, AutomationsState } from "@/context/AppContext";
import { ShieldCheck, MessageCircle, AlertCircle, Sparkles, Check, AlertTriangle, CheckCircle2 } from "lucide-react";
import { whatsappService, AutomationStatus } from "@/services/whatsappService";
import api from "@/lib/api";

export default function AutomationsPage() {
  const { automations, toggleAutomation, wabaConnection, addLog } = useApp();
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [reminderResult, setReminderResult] = useState<"success" | "error" | null>(null);
  const [reminderError, setReminderError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAutomation = async () => {
      try {
        const status = await whatsappService.getAutomationStatus();
        setAutomationStatus(status);
      } catch (err) {
        console.error("Automation status error:", err);
      }
    };
    fetchAutomation();
  }, []);

  const services = [
    {
      key: "renewal" as keyof AutomationsState,
      name: "Membership Renewal Automation",
      desc: "Dispatches friendly text reminders 7 days and 3 days prior to membership expirations.",
      icon: "💳",
      status: (automationStatus?.membership_reminder_enabled ?? automations.renewal) ? "Active" : "Inactive",
      syncDetails: "Synchronized with active template list",
      disabled: false,
    },
    {
      key: "appointment" as keyof AutomationsState,
      name: "Appointment Reminder Automation",
      desc: "Sends confirmations 24 hours prior and lets clients tap to confirm or cancel.",
      icon: "📅",
      status: (automationStatus?.rag_bot_enabled ?? automations.appointment) ? "Active" : "Inactive",
      syncDetails: "Synchronized with calendar system",
      disabled: false,
    },
    {
      key: "booking" as keyof AutomationsState,
      name: "Booking Confirmation Automation",
      desc: "Delivers reservation details, check-in links, and checkout receipts instantly.",
      icon: "✅",
      status: automations.booking ? "Active" : "Inactive",
      syncDetails: "Synchronized with checkout logs",
      disabled: false,
    },
    {
      key: "notification" as keyof AutomationsState,
      name: "Customer Notification Automation",
      desc: "Dispatches class scheduling alterations, service changes, and alerts immediately.",
      icon: "📢",
      status: automations.notification ? "Active" : "Inactive",
      syncDetails: "Synchronized with notification hub",
      disabled: false,
    },
    {
      key: "followup" as keyof AutomationsState,
      name: "Lead Follow-Up Automation",
      desc: "Sends feedback inquiries post-appointment and automated lead follow-ups.",
      icon: "👋",
      status: automations.followup ? "Active" : "Inactive",
      syncDetails: "Synchronized with re-engagement list",
      disabled: false,
    },
    {
      key: "workflow" as keyof AutomationsState,
      name: "AI Customer Assistant",
      desc: "Launches conversational responses to basic customer queries. Coming soon.",
      icon: "🤖",
      status: "Coming Soon",
      syncDetails: "Development phase active",
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col gap-8 text-left animate-fade-in select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#010203]">
          Communication Automations
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          Manage and configure templates synced from your connected WhatsApp number.
        </p>
      </div>

      {/* Warning if WhatsApp is not connected */}
      {!wabaConnection.isConnected && (
        <div className="bg-[#FFFFA7] text-[#010203] border border-[#FFFFA7] rounded-2xl p-5 flex items-start gap-3.5 max-w-3xl">
          <AlertCircle className="w-5.5 h-5.5 text-[#D8524B] shrink-0 mt-0.5" />
          <div className="text-xs font-sans leading-relaxed">
            <span className="font-bold block mb-0.5">WhatsApp Account Disconnected</span>
            No WhatsApp Business Account is connected to this console. Automations are currently inactive. Go to the <span className="font-bold">Connection</span> tab to authenticate with Meta and start sending alerts.
          </div>
        </div>
      )}

      {wabaConnection.isConnected &&
       automationStatus &&
       !automationStatus.configured && (
        <button
          onClick={async () => {
            setIsActivating(true);
            try {
              await whatsappService.activateAutomation();
              const status = await whatsappService.getAutomationStatus();
              setAutomationStatus(status);
            } catch (err) {
              console.error("Activation error:", err);
            } finally {
              setIsActivating(false);
            }
          }}
          disabled={isActivating}
          className="w-full flex items-center justify-center gap-2 bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-sm h-[48px] rounded-full shadow-lg disabled:opacity-50 max-w-sm"
        >
          {isActivating ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Activating...
            </>
          ) : (
            "Activate Automations"
          )}
        </button>
      )}

      {/* Send Test Reminder Control */}
      <div className="flex flex-col gap-3 max-w-sm">
        <button
          onClick={async () => {
            setIsSendingReminder(true);
            setReminderResult(null);
            setReminderError(null);
            try {
              await api.post("/api/v1/automations/send-test-reminder");
              setReminderResult("success");
              addLog(
                "success",
                "Test Reminder Sent",
                "Test reminder webhook invoked successfully."
              );
            } catch (err: any) {
              const msg =
                err?.response?.data?.error?.message ||
                "Failed to send test reminder.";
              setReminderResult("error");
              setReminderError(msg);
              addLog(
                "error",
                "Test Reminder Failed",
                msg
              );
            } finally {
              setIsSendingReminder(false);
            }
          }}
          disabled={isSendingReminder}
          className="w-full flex items-center justify-center gap-2 bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-sm h-[48px] rounded-full shadow-lg disabled:opacity-50"
        >
          {isSendingReminder ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Sending...
            </>
          ) : (
            "Send Test Reminder"
          )}
        </button>

        {reminderResult === "success" && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs font-sans text-emerald-700">Reminder sent successfully.</p>
          </div>
        )}

        {reminderResult === "error" && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs font-sans text-red-700">{reminderError}</p>
          </div>
        )}
      </div>

      {/* Automations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((item) => {
          const isActive = item.status === "Active";
          const isComingSoon = item.status === "Coming Soon";
          
          return (
            <div
              key={item.name}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                isActive ? "border-emerald-100 shadow-sm" : "border-gray-150"
              }`}
            >
              {/* Top Row: Icon and Status Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-150 flex items-center justify-center text-xl">
                  {item.icon}
                </div>

                {/* Premium status indicator */}
                {isComingSoon ? (
                  <span className="bg-purple-50 border border-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider">
                    Coming Soon
                  </span>
                ) : isActive ? (
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                ) : (
                  <span className="bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Inactive
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-4 text-left">
                <h3 className="font-heading font-bold text-base text-[#010203]">
                  {item.name}
                </h3>
                <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* Bottom Row: Sync info and Status toggler */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-sans text-gray-400 font-semibold tracking-wide">
                  {item.syncDetails}
                </span>

                {/* Premium switch control */}
                {!isComingSoon && (
                  <button
                    onClick={() => {
                      if (!item.disabled) {
                        toggleAutomation(item.key as keyof AutomationsState);
                      }
                    }}
                    disabled={!wabaConnection.isConnected}
                    className={`text-[11px] font-heading font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 focus:outline-none ${
                      !wabaConnection.isConnected
                        ? "bg-gray-50 border-gray-150 text-gray-300 cursor-not-allowed"
                        : isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/50"
                        : "bg-white border-gray-300 text-[#010203] hover:bg-gray-50"
                    }`}
                  >
                    {isActive ? "Disable Sync" : "Enable Sync"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
