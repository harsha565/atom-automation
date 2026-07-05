"use client";

import React from "react";
import { CheckCircle2, Clock, Calendar, BarChart3, HelpCircle, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export const Industries: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const outcomes = [
    {
      title: "Reduce Missed Appointments",
      metric: "85%",
      label: "Reduction in no-shows",
      desc: "Send interactive confirmation bubbles. Clients confirm or cancel in a single tap, letting you fill empty slots instantly.",
      icon: Calendar,
      bgColor: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Save Critical Staff Hours",
      metric: "15 hrs",
      label: "Saved every single week",
      desc: "Stop calling or texting clients individually. Let automated triggers do the heavy lifting while your reception desk focuses on welcoming visitors.",
      icon: Clock,
      bgColor: "bg-blue-50 text-blue-600",
    },
    {
      title: "Increase Recurring Renewals",
      metric: "3.2x",
      label: "Higher membership retention",
      desc: "Deliver renewal alerts directly to members' WhatsApp. Make billing continuity simple and frictionless.",
      icon: Users,
      bgColor: "bg-[#D8524B]/5 text-[#D8524B]",
    },
    {
      title: "Improve Customer Response Time",
      metric: "< 1 min",
      label: "Instant response loops",
      desc: "Handle customer queries instantly. Dispatch confirmation notes, scheduling changes, and address links immediately.",
      icon: BarChart3,
      bgColor: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <section id="outcomes" className="py-24 bg-[#F8F8FF] overflow-visible">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
            Why Automation Works
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[44px] text-[#010203] mt-5 leading-tight">
            Built for Businesses That Run on Relationships
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed max-w-2xl mx-auto">
            Focus entirely on outcomes. Automating standard notifications keeps customer engagement high without manual administrative friction.
          </p>
        </div>

        {/* 2x2 grid of metric outcome cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {outcomes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: index * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { y: -4 }}
                className="bg-white border border-gray-100 rounded-[24px] p-8 flex flex-col md:flex-row items-start gap-6 transition-all duration-300 shadow-sm"
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.bgColor}`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex flex-col text-left">
                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#010203]">
                    {item.title}
                  </h3>
                  
                  {/* Metric Large Text */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#D8524B]">
                      {item.metric}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {item.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-sm text-[#4A4A5A] mt-3.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
