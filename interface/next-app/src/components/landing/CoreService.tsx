"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { ConnectionFlowDiagram } from "../shared/ConnectionFlowDiagram";
import { motion } from "framer-motion";

export const CoreService: React.FC = () => {
  const trustPoints = [
    "Meta-verified authorization process",
    "Password never shared or stored",
    "Revoke access anytime from Meta settings",
  ];

  return (
    <section id="connection" className="py-24 bg-[#F8F8FF] overflow-visible">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
            Core Service
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[44px] text-[#010203] mt-5 leading-tight">
            Secure WhatsApp Business Connection
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed max-w-2xl mx-auto">
            The foundation of everything we do. Connect your WhatsApp Business Account through Meta&apos;s official authorization — we never touch your password.
          </p>
        </div>

        {/* Massive Featured Dark Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="relative w-full bg-[#010203] text-white rounded-[28px] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[460px] z-10"
        >
          {/* Decorative Glow inside dark card */}
          <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-[#D8524B]/10 to-transparent rounded-full filter blur-[80px] pointer-events-none" />

          {/* Left half: Content */}
          <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10">
            <span className="text-xs font-heading font-bold text-[#D8524B] uppercase tracking-widest mb-3">
              Legitimate Sync
            </span>
            <h3 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight">
              Your Account. <br className="hidden sm:inline" /> Our Automation.
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#A0A0A0] mt-4 leading-relaxed max-w-md">
              We link to your WhatsApp Business number via Meta&apos;s secure partner authentication protocol. This creates a secure communication bridge while keeping full account control in your hands.
            </p>

            <ul className="flex flex-col gap-3.5 mt-8">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm font-sans text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-[#D8524B] shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right half: Onboarding Path Diagram (Visual) */}
          <div className="lg:w-1/2 bg-[#08080c] p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-white/5 flex items-center justify-center relative overflow-hidden">
            {/* Visual containment grid */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            
            <div className="w-full max-w-lg lg:scale-[0.85] origin-center py-6">
              <ConnectionFlowDiagram variant="dark-bg" scale={0.9} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
