"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export const PermissionsTable: React.FC = () => {
  const allowed = [
    "Send approved notification messages",
    "Deliver renewal reminder alerts",
    "Send booking confirmation alerts",
    "Sync business template names",
    "Monitor message delivery status logs",
  ];

  const restricted = [
    "Read personal WhatsApp messages",
    "See personal contact phone lists",
    "View bank card or checkout details",
    "Access account logins/passwords",
    "Send promotional spam messages",
    "Modify business profile settings",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-gray-100 rounded-[28px] p-6 sm:p-10 shadow-sm relative z-10 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
        
        {/* Vertical divider on desktop */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 -translate-x-1/2" />

        {/* Left Col: Can Do */}
        <div className="flex flex-col text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-heading font-bold text-xs uppercase tracking-wider mb-6 self-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            What Atom Can Access
          </div>

          <ul className="flex flex-col gap-4">
            {allowed.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm font-sans text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Col: Cannot Do */}
        <div className="flex flex-col text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 font-heading font-bold text-xs uppercase tracking-wider mb-6 self-start">
            <XCircle className="w-4 h-4 text-red-600" />
            What Atom Cannot Access
          </div>

          <ul className="flex flex-col gap-4">
            {restricted.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm font-sans text-gray-700">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};
