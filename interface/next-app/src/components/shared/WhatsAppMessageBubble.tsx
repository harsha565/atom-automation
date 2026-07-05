"use client";

import React from "react";
import { CheckCheck } from "lucide-react";

interface WhatsAppMessageBubbleProps {
  businessName: string;
  message: string;
  time?: string;
  status?: "sent" | "delivered" | "read";
}

export const WhatsAppMessageBubble: React.FC<WhatsAppMessageBubbleProps> = ({
  businessName,
  message,
  time = "10:24 AM",
  status = "read",
}) => {
  return (
    <div className="w-full max-w-[320px] rounded-2xl bg-[#E2F4D9] border border-[#D0EBC2] p-3 text-[#111b21] shadow-sm flex flex-col gap-1 text-left relative select-none">
      {/* Sender Eyebrow */}
      <span className="text-[11px] font-bold text-[#008069] tracking-wide uppercase select-none">
        {businessName}
      </span>

      {/* Message Text */}
      <p className="text-sm font-sans leading-relaxed text-[#111b21] whitespace-pre-line">
        {message}
      </p>

      {/* Status & Time */}
      <div className="flex items-center justify-end gap-1 text-[9px] text-[#667781] self-end mt-0.5">
        <span>{time}</span>
        {status === "read" && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
        {status === "delivered" && <CheckCheck className="w-3.5 h-3.5 text-[#8696a0]" />}
      </div>

      {/* WhatsApp speech bubble tail pointer */}
      <div className="absolute right-[-6px] top-0 w-3 h-3 bg-[#E2F4D9] border-r border-t border-[#D0EBC2] rotate-45 rounded-sm pointer-events-none" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
    </div>
  );
};
