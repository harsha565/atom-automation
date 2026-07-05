"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, Key } from "lucide-react";
import { loadMetaSDK, launchEmbeddedSignup } from "@/lib/metaSDK";
import { whatsappService } from "@/services/whatsappService";

export default function ConnectWhatsAppPage() {
  const { connectWaba, wabaConnection } = useApp();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const appId = process.env.NEXT_PUBLIC_META_APP_ID || "";
  const configId = process.env.NEXT_PUBLIC_META_CONFIG_ID || "";

  useEffect(() => {
    if (!appId) return;
    loadMetaSDK(appId)
      .then(() => setIsSdkReady(true))
      .catch(() => setErrorMessage(
        "Failed to load Meta SDK. Please check your connection."
      ));
  }, [appId]);

  const stepsPreview = [
    { num: 1, title: "Trigger Authorization", desc: "Initiate secure handshake popup served by Meta." },
    { num: 2, title: "Select Number", desc: "Select which business number you wish to sync." },
    { num: 3, title: "Review Consent Scopes", desc: "Approve access to send templates & templates list." },
    { num: 4, title: "Activate Sync", desc: "Finalize link parameters inside console settings." },
  ];

  const handleStartMetaAuth = async () => {
    if (!isSdkReady) {
      setErrorMessage("Meta SDK is not ready. Please reload the page.");
      return;
    }
    if (!configId) {
      setErrorMessage("Meta Configuration ID is missing.");
      return;
    }

    setIsConnecting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setActiveStep(2);

    try {
      // Step 1: Launch real Meta Embedded Signup
      const authCode = await launchEmbeddedSignup(configId);
      setActiveStep(3);

      // Step 2: Send code to backend
      await whatsappService.connect(authCode);
      setActiveStep(4);

      // Step 3: Trigger n8n automation
      try {
        await whatsappService.activateAutomation();
      } catch (error) {
        // Non-fatal — automation trigger failure should not block success
        console.warn("Automation trigger failed, continuing...");
      }

      // Step 4: Update context and redirect
      await connectWaba("", "");
      setSuccessMessage("WhatsApp connected successfully!");
      
      setTimeout(() => {
        router.push("/dashboard/connection");
      }, 1000);

    } catch (error: any) {
      setActiveStep(1);
      if (error?.message?.includes("cancelled")) {
        setErrorMessage("Setup cancelled. You can try again anytime.");
      } else if (error?.response?.data?.error?.message) {
        setErrorMessage(error.response.data.error.message);
      } else {
        setErrorMessage(
          "Connection failed. Please try again or contact support."
        );
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-fade-in select-none max-w-3xl mx-auto relative">
      
      {/* Step Indicators Bar */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-5">
        <div>
          <span className="text-[10px] font-heading font-extrabold text-[#D8524B] uppercase tracking-widest">
            Step 1 of 4
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] mt-1">
            Connect WhatsApp Business
          </h1>
        </div>
        
        <div className="bg-[#D8524B]/5 text-[#D8524B] font-heading font-bold text-xs px-3.5 py-1.5 rounded-full">
          ⏱ ~3 minutes
        </div>
      </div>

      {/* Process Preview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stepsPreview.map((item) => (
          <div
            key={item.num}
            className={`border p-4 rounded-xl text-left flex flex-col justify-between min-h-[120px] transition-colors ${
              item.num === activeStep 
                ? "bg-white border-[#D8524B] shadow-sm" 
                : "bg-white/50 border-gray-150"
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-heading font-bold text-xs ${
              item.num === activeStep ? "bg-[#D8524B] text-white" : "bg-gray-100 text-gray-400"
            }`}>
              {item.num}
            </span>
            <div className="mt-3">
              <h3 className="font-heading font-bold text-xs text-[#010203] leading-tight">{item.title}</h3>
              <p className="font-sans text-[10px] text-gray-400 mt-1 leading-normal">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Yellow Notice Box */}
      <div className="bg-[#FFFFA7] text-[#010203] border border-[#FFFFA7] rounded-2xl p-5 flex items-start gap-4">
        <ShieldAlert className="w-5.5 h-5.5 text-[#D8524B] shrink-0 mt-0.5" />
        <div className="text-xs font-sans leading-relaxed">
          <span className="font-bold block mb-0.5">Secure Meta Authorization Handshake</span>
          Meta handles all authentication details directly. Atom Automation never sees, requests, or stores your logins or account passwords. Access token parameters can be terminated at any moment.
        </div>
      </div>

      {/* Consent review details checklist */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-heading font-bold text-base text-[#010203] border-b border-gray-100 pb-4 mb-4">
          Permissions Scope Overview
        </h2>
        
        <ul className="flex flex-col gap-3">
          {[
            "Transmit template notification alerts",
            "Access business profile status details",
            "Review synchronizations & logs status logs",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-xs sm:text-sm font-sans text-gray-650">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-100 rounded-2xl
          p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs font-sans text-red-700">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-100
          rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs font-sans text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleStartMetaAuth}
        disabled={isConnecting || !isSdkReady}
        className="w-full flex items-center justify-center gap-2 bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-sm h-[52px] rounded-full shadow-lg shadow-[#D8524B]/10 hover:shadow-xl hover:shadow-[#D8524B]/20 transition-all duration-200 disabled:opacity-50"
      >
        {!isSdkReady ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white
              border-t-transparent animate-spin" />
            Loading Meta SDK...
          </>
        ) : isConnecting ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white
              border-t-transparent animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            Continue with Meta
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

    </div>
  );
}

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);
