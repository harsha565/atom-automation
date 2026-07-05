"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const MotionLink = motion(Link);

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const shouldReduceMotion = useReducedMotion();

  const plans = billingCycle === "monthly" ? [
    {
      name: "Setup & Integration",
      tagline: "Meta verification, embedded signup, and sandbox configuration.",
      price: "₹4,000",
      period: "One-time setup fee",
      isPopular: false,
      features: [
        "Meta embedded signup connection",
        "WhatsApp number API integration",
        "Standard template submissions",
        "Direct onboarding call assistance",
      ],
      ctaText: "Get Setup Done",
      ctaHref: "/signup",
    },
    {
      name: "Membership Reminders",
      tagline: "Automated WhatsApp notifications for gym & clinic renewals.",
      price: "₹1,000",
      period: "per month",
      isPopular: true,
      features: [
        "Automated expiry reminder alerts",
        "Pre-scheduled expiry warnings",
        "Custom WhatsApp message templates",
        "Message delivery success tracking",
      ],
      ctaText: "Add Reminders",
      ctaHref: "/signup",
    },
    {
      name: "AI Auto Reply",
      tagline: "A 24/7 smart assistant responding to FAQ queries.",
      price: "₹800",
      period: "per month",
      isPopular: false,
      features: [
        "Instant automated text replies",
        "Custom FAQ knowledge base",
        "Lead capture and sync to console",
        "Human agent hand-off indicator",
      ],
      ctaText: "Add AI Chat",
      ctaHref: "/signup",
    }
  ] : [
    {
      name: "One-Time Setup",
      tagline: "Meta verification and API setup included for free.",
      price: "FREE",
      period: "With Yearly Bundle",
      isPopular: false,
      features: [
        "Meta embedded signup connection",
        "WhatsApp number API integration",
        "Standard template submissions",
        "Direct onboarding call assistance",
      ],
      ctaText: "Get Free Setup",
      ctaHref: "/signup",
    },
    {
      name: "Yearly All-In Bundle",
      tagline: "Complete automation suite: Setup + Reminders + AI Auto Reply.",
      price: "₹18,000",
      period: "per year",
      isPopular: true,
      features: [
        "Includes free ₹4,000 setup fee",
        "Includes Membership Reminders (1 Year)",
        "Includes AI Auto Message Reply (1 Year)",
        "Priority premium support & setup assistance",
      ],
      ctaText: "Get All-In Yearly",
      ctaHref: "/signup",
    },
    {
      name: "AI Auto Reply",
      tagline: "Fully integrated into your Yearly All-In bundle.",
      price: "INCLUDED",
      period: "With Yearly Bundle",
      isPopular: false,
      features: [
        "Instant automated text replies",
        "Custom FAQ knowledge base",
        "Lead capture and sync to console",
        "Human agent hand-off indicator",
      ],
      ctaText: "Start AI Chat",
      ctaHref: "/signup",
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-[#F8F8FF] overflow-visible">
      <div className="container mx-auto px-6">
        
        {/* Animated Outer Container */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-[32px] p-8 sm:p-12 shadow-sm select-none"
        >
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-gray-100 pb-10 mb-10 text-left">
            <div>
              <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full block w-fit mb-3">
                Solutions Scale
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#010203] leading-tight">
                Simple & Transparent Pricing
              </h2>
            </div>
            
            {/* Billing Cycle Switcher */}
            <div className="bg-[#EDEDE8] p-1 rounded-full flex items-center gap-1">
              <motion.button
                onClick={() => setBillingCycle("monthly")}
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className={`font-heading font-bold text-xs px-4 py-2.5 rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#D8524B] cursor-pointer ${
                  billingCycle === "monthly" ? "bg-white text-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly Plan
              </motion.button>
              <motion.button
                onClick={() => setBillingCycle("yearly")}
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className={`font-heading font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#D8524B] cursor-pointer ${
                  billingCycle === "yearly" ? "bg-white text-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Yearly Bundle
                <span className="bg-[#D8524B]/10 text-[#D8524B] text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  Save 29%
                </span>
              </motion.button>
            </div>
          </div>

          {/* 3 cards inside with animated transition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { y: -4 }}
                className={`relative rounded-[24px] p-8 flex flex-col justify-between text-left min-h-[460px] border transition-all duration-300 ${
                  plan.isPopular 
                    ? "bg-[#F5E8E2] border-[#EAD5CC]" 
                    : "bg-[#F5F1EC] border-[#EBE6DF]"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-4 right-4 bg-[#D8524B] text-white font-heading font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Best Value
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <span className="font-heading font-extrabold text-lg text-[#D8524B]">
                    {plan.name}
                  </span>
                  
                  {/* Tagline */}
                  <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">
                    {plan.tagline}
                  </p>

                  <hr className={`my-5 ${plan.isPopular ? "border-[#EAD5CC]" : "border-[#EBE6DF]"}`} />

                  {/* Pricing block */}
                  <div className="mb-6">
                    <span className="font-heading font-black text-4xl text-[#010203]">
                      {plan.price}
                    </span>
                    <span className="font-sans text-xs text-gray-500 ml-1.5">
                      {plan.period}
                    </span>
                  </div>

                  {/* Bullet features list */}
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D8524B] shrink-0 mt-2" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Pill Button */}
                <div className="mt-8">
                  <MotionLink
                    href={plan.ctaHref}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className="w-full flex items-center justify-center bg-[#010203] text-white hover:bg-gray-800 text-xs uppercase tracking-wider font-heading font-extrabold py-3.5 px-6 rounded-full shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010203]"
                  >
                    {plan.ctaText}
                  </MotionLink>
                </div>

              </motion.div>
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  );
};
