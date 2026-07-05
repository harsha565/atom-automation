"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-24 bg-[#F8F8FF] overflow-hidden select-none">
      <div className="container mx-auto px-6">
        
        {/* Rounded CTA Showcase Section with Strong Visual Identity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-[#D8524B]/5 border border-[#D8524B]/10 rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-sm"
        >
          {/* Organic glowing blobs for visual depth */}
          <div className="absolute left-[-10%] top-[-20%] w-[40%] h-[60%] bg-[#FFFFA7]/40 rounded-full filter blur-[60px] pointer-events-none z-0" />
          <div className="absolute right-[-10%] bottom-[-20%] w-[50%] h-[60%] bg-[#D8524B]/10 rounded-full filter blur-[65px] pointer-events-none z-0" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            {/* Sparkle badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D8524B]/15 text-[#D8524B] font-heading font-bold text-xs uppercase tracking-wider mb-6">
              <Sparkles className="w-4.5 h-4.5" />
              Easy Integration
            </div>

            {/* Headline */}
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[56px] leading-[1.1] text-[#010203] tracking-tight">
              Start Saving Time With WhatsApp Automation
            </h2>

            {/* Subtitle */}
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#4A4A5A] mt-6 leading-relaxed">
              Connect your WhatsApp. Set up your automations. Let Atom run the rest.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
              <Link
                href="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D8524B] text-white font-heading font-semibold text-[15px] px-8 py-4 rounded-full shadow-lg shadow-[#D8524B]/20 hover:bg-[#c0433d] hover:shadow-xl hover:shadow-[#D8524B]/30 hover:scale-[1.01] transition-all duration-200"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center border border-gray-300 bg-white text-[#010203] font-heading font-semibold text-[15px] px-8 py-4 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Book A Demo
              </Link>
            </div>

            {/* Under button subtext */}
            <span className="text-xs font-sans text-gray-500 mt-6 block tracking-wide">
              No credit card required · Setup in under 10 minutes
            </span>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
