"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, ShieldAlert, CheckCircle2, Info } from "lucide-react";
import { PermissionsTable } from "@/components/landing/PermissionsTable";

export default function DashboardPermissionsPage() {
  const { wabaConnection } = useApp();

  return (
    <div className="flex flex-col gap-8 text-left animate-fade-in select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#010203]">
          Authorization Scopes & Consent
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          Review exactly what data is accessible under the Meta integration token.
        </p>
      </div>

      {/* Integration Status Info */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        wabaConnection.isConnected 
          ? "bg-emerald-50/50 border-emerald-100" 
          : "bg-amber-50/50 border-amber-100"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            wabaConnection.isConnected 
              ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
              : "bg-amber-50 border-amber-100 text-amber-600"
          }`}>
            {wabaConnection.isConnected ? <ShieldCheck className="w-5.5 h-5.5" /> : <ShieldAlert className="w-5.5 h-5.5" />}
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-[#010203]">
              {wabaConnection.isConnected ? "Secure Token Authorized" : "No Active Token Detected"}
            </h3>
            <p className="font-sans text-xs text-gray-500 mt-0.5 max-w-md">
              {wabaConnection.isConnected 
                ? `Syncing permissions with WABA profile ${wabaConnection.wabaName} securely.` 
                : "Linked number authorization token is required to enable messaging sync."}
            </p>
          </div>
        </div>

        {wabaConnection.isConnected && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider flex items-center gap-1 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Consent Token Syncing
          </div>
        )}
      </div>

      {/* Permissions Transparency Table */}
      <div>
        <h2 className="font-heading font-bold text-base text-[#010203] mb-4">
          Data Consent Specifications
        </h2>
        <PermissionsTable />
      </div>

      {/* Info Notice Box */}
      <div className="bg-white border border-gray-150 p-6 rounded-3xl flex items-start gap-4 max-w-3xl">
        <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-heading font-bold text-sm text-[#010203]">
            What is an Authorization Scope?
          </h3>
          <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
            Meta uses permission scopes to ensure application sync parameters are isolated. This guarantees that Atom Automation can only send template notification logs without gaining access to private chat contents or business settings.
          </p>
        </div>
      </div>

    </div>
  );
}
