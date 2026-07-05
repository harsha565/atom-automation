"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ConnectionFlowDiagram } from "../shared/ConnectionFlowDiagram";
import { ArrowRight } from "lucide-react";

const MotionLink = motion(Link);

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center pt-32 pb-20 bg-[#F8F8FF] overflow-visible">
      {/* Decorative background glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-gradient-to-r from-[#FFFFA7]/30 to-[#D8524B]/10 rounded-full filter blur-[100px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D8524B]/5 border border-[#D8524B]/15 text-[#D8524B] font-heading font-bold text-xs uppercase tracking-wider mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#D8524B] animate-ping" />
            Official Meta integration gateway
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.05] tracking-tight text-[#010203] max-w-4xl"
          >
            Atom Automation <br />
            <span className="text-[#D8524B]">That Works While You Don&apos;t</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-base sm:text-lg md:text-xl text-[#4A4A5A] max-w-2xl mt-6 leading-relaxed"
          >
            We provide WhatsApp Business API solutions, AI-powered customer support, sales automation, and business messaging infrastructure for companies.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
          >
            <MotionLink
              href="/signup"
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D8524B] text-white font-heading font-semibold text-[15px] px-8 py-4 rounded-full shadow-lg shadow-[#D8524B]/20 hover:bg-[#c0433d] hover:shadow-xl hover:shadow-[#D8524B]/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8524B]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </MotionLink>
            <MotionLink
              href="/login"
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center border-2 border-[#010203] text-[#010203] font-heading font-semibold text-[15px] px-8 py-4 rounded-full hover:bg-[#010203] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010203]"
            >
              Book A Demo
            </MotionLink>
          </motion.div>
        </motion.div>

        {/* Hero Visual centerpiece (animated connection path) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.6 }}
          className="w-full mt-16 md:mt-24"
        >
          <ConnectionFlowDiagram />
        </motion.div>

        {/* Hero bottom labels (Stripe style) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-8 mt-12 text-xs font-heading font-bold text-gray-500 uppercase tracking-widest border-t border-gray-100 pt-8 w-full max-w-xl mx-auto"
        >
          <span>✓ Official Meta Integration</span>
          <span>✓ Ownership Retained</span>
          <span>✓ Permission-Based Sync</span>
        </motion.div>
      </div>
    </section>
  );
};
