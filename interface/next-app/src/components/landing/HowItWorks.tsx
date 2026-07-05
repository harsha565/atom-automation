"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { UserPlus, Link, Shield, Key, CheckCircle, Smartphone } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const steps = [
    {
      number: 1,
      title: "Create Account",
      desc: "Register your business profile and set your credentials in seconds.",
      icon: UserPlus,
    },
    {
      number: 2,
      title: "Connect WhatsApp",
      desc: "Link your company number to prepare the sync pipeline.",
      icon: Link,
    },
    {
      number: 3,
      title: "Review Permissions",
      desc: "See exactly what scopes are required. Absolute transparency.",
      icon: Shield,
    },
    {
      number: 4,
      title: "Authorize via Meta",
      desc: "Log in through Meta's secure window. Your password never leaves Meta.",
      icon: Key,
    },
    {
      number: 5,
      title: "Verify Connection",
      desc: "Run a mock handshake check to test the status indicator.",
      icon: Smartphone,
    },
    {
      number: 6,
      title: "Complete Setup",
      desc: "Enable renewal, appointment, or confirmation automations instantly.",
      icon: CheckCircle,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#F8F8FF] overflow-visible">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
            Process
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[44px] text-[#010203] mt-5 leading-tight">
            Up and Running in Minutes
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed max-w-2xl mx-auto">
            Zero development required. Connect your account securely through Meta and activate templates in less than three minutes.
          </p>
        </div>

        {/* Desktop Horizontal / Mobile Vertical Timeline */}
        <div className="relative max-w-6xl mx-auto px-4">
          
          {/* Timeline Connector Line (Desktop) */}
          <div className="absolute top-[24px] left-[5%] right-[5%] h-0.5 bg-gray-200 hidden lg:block z-0">
            <motion.div
              className="h-full bg-[#D8524B]"
              initial={shouldReduceMotion ? { width: "100%" } : { width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: false, margin: "-100px" }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Timeline Connector Line (Mobile) */}
          <div className="absolute left-[30px] top-[24px] bottom-[24px] w-0.5 bg-gray-200 lg:hidden z-0">
            <motion.div
              className="w-full bg-[#D8524B]"
              initial={shouldReduceMotion ? { height: "100%" } : { height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: false, margin: "-100px" }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Steps list */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: index * 0.08 }}
                  className="flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center gap-6 lg:gap-4 group"
                >
                  {/* Step bubble */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#D8524B] text-white flex items-center justify-center font-heading font-extrabold text-[17px] shadow-lg shadow-[#D8524B]/20 relative z-10 transition-transform duration-300 group-hover:scale-110">
                      {step.number}
                    </div>
                    {/* Ring highlight */}
                    <div className="absolute -inset-1.5 rounded-full border-2 border-[#D8524B]/25 animate-pulse pointer-events-none z-0" />
                  </div>

                  {/* Step details */}
                  <div className="flex flex-col">
                    {/* Icon indicator */}
                    <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 mb-2.5 mx-auto transition-colors duration-200 group-hover:bg-[#D8524B]/5 group-hover:text-[#D8524B]">
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <h3 className="font-heading font-bold text-base text-[#010203] tracking-tight">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-[13px] text-[#4A4A5A] mt-1.5 leading-relaxed max-w-[200px] lg:mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
