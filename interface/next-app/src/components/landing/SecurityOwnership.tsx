"use client";

import React from "react";
import { ShieldCheck, Key, RefreshCw, XCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";

export const SecurityOwnership: React.FC = () => {
  const trustPoints = [
    {
      title: "Authentication Handled by Meta",
      desc: "All sign-ins go directly through Meta's partner popup. Your password never touches our servers.",
      icon: ShieldCheck,
    },
    {
      title: "Passwords Never Shared",
      desc: "We operate entirely on isolated token structures. We do not store or see passwords.",
      icon: Key,
    },
    {
      title: "Ownership Stays with Your Business",
      desc: "Your WhatsApp Business Account (WABA) remains completely yours. We are just an utility layer.",
      icon: RefreshCw,
    },
    {
      title: "Disconnect Instantly, Anytime",
      desc: "Revoke our sync permissions directly from your Meta Business dashboard at any time.",
      icon: XCircle,
    },
    {
      title: "Full Transparency",
      desc: "Read exactly what scopes we request beforehand. No hidden APIs, no background access.",
      icon: Eye,
    },
  ];

  return (
    <section className="py-24 bg-[#F8F8FF] overflow-visible">
      <div className="container mx-auto px-6">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
            Security & Trust
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[44px] text-[#010203] mt-5 leading-tight">
            Built Around Meta&apos;s Process
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed max-w-2xl mx-auto">
            Atom Automation is engineered to guarantee business asset isolation. We build trust through transparency, clear consent boundaries, and instant revocability.
          </p>
        </div>

        {/* Layout container - Light Terracotta Background Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-[#D8524B]/5 border border-[#D8524B]/10 rounded-[32px] p-8 sm:p-12 md:p-16 relative overflow-hidden"
        >
          {/* Decorative subtle cream background shapes */}
          <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[50%] bg-[#FFFFA7]/40 rounded-full filter blur-[50px] pointer-events-none z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Col: Core Message */}
            <div className="lg:col-span-5 text-left">
              <h3 className="font-heading font-bold text-3xl text-[#010203] leading-tight">
                You Own Your Account. <br /> Always.
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#4A4A5A] mt-4 leading-relaxed">
                We believe security isn&apos;t a technical feature — it&apos;s the core foundation of our service. Our integration hooks onto Meta&apos;s compliance structures, keeping you in full control.
              </p>
              
              {/* Soft secondary yellow warning notice block */}
              <div className="mt-8 bg-[#FFFFA7] text-[#010203] rounded-2xl p-5 border border-[#FFFFA7] flex items-start gap-3.5">
                <span className="text-xl">⚠️</span>
                <div className="text-xs font-sans leading-relaxed">
                  <span className="font-bold block mb-0.5">Direct Meta Verification</span>
                  Always check the URL prefix during authentication. The verification popup is served directly by facebook.com/meta.com. We never prompt for passwords inside Atom Automation.
                </div>
              </div>
            </div>

            {/* Right Col: Trust Points Grid */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {trustPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white/80 border border-gray-150 p-6 rounded-2xl flex items-start gap-4 transition-all duration-350 shadow-sm"
                  >
                    {/* Icon container */}
                    <div className="w-10 h-10 rounded-xl bg-[#D8524B]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#D8524B]" />
                    </div>

                    <div className="flex flex-col text-left">
                      <h4 className="font-heading font-bold text-sm text-[#010203]">
                        {point.title}
                      </h4>
                      <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
