"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export const TrustBar: React.FC = () => {
  const items = [
    "Meta-Authorized Integration Flow",
    "Your Account, Your Ownership",
    "Permission-Based Access Only",
    "Disconnect Anytime",
  ];

  return (
    <section className="w-full bg-[#F8F8FF] border-y border-gray-100 py-6 select-none overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-around gap-6 md:gap-4">
        {items.map((item, index) => (
          <React.Fragment key={item}>
            {index > 0 && (
              <div className="hidden md:block w-px h-8 bg-gray-200" aria-hidden="true" />
            )}
            <div className="flex items-center gap-2.5 font-sans font-medium text-sm text-[#010203]">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#D8524B] shrink-0" />
              <span>{item}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
