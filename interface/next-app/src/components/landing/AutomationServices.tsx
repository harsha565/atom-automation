"use client";

import React from "react";
import { motion as fm, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles, Check, Play, ChevronRight } from "lucide-react";
import { WhatsAppMessageBubble } from "../shared/WhatsAppMessageBubble";

export const AutomationServices: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="services" className="py-24 bg-[#F8F8FF] overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
            Automation Services
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[44px] text-[#010203] mt-5 leading-tight">
            Everything Your Business Communicates, Automated
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed max-w-2xl mx-auto">
            Two services. One connection. Zero manual messaging. Connect once and let Atom handle the rest.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          {/* Row 1: 58% salmon | 42% gray */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Card 1: Membership Renewal */}
            <fm.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="lg:w-[58%] relative bg-[#F5D5C8] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden min-h-[440px] select-none"
            >
              {/* Organic blob background decorator */}
              <div 
                className="absolute right-[-10%] top-[10%] w-[70%] h-[70%] bg-[#ECC5B7] rounded-full filter blur-[24px] pointer-events-none z-0" 
                style={{ borderRadius: "50%" }}
              />

              <div className="relative z-10">
                <span className="text-[12px] font-heading font-bold text-[#D8524B] uppercase tracking-wider block mb-2">
                  Memberships
                </span>
                <h3 className="font-heading font-bold text-2xl sm:text-[28px] text-[#010203] leading-tight max-w-md">
                  Never Lose a Member to a Forgotten Renewal
                </h3>
                <p className="font-sans text-sm sm:text-[15px] text-[#6A5A55] mt-3 leading-relaxed max-w-sm">
                  Send automated updates before membership terms lapse. Help members stay current without constant phone tags.
                </p>
              </div>

              {/* Internal illustration: Timeline messages */}
              <div className="relative z-10 mt-6 bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-white/30 flex flex-col gap-4 max-w-md">
                <div className="flex items-start gap-3 border-l-2 border-[#D8524B]/30 pl-4 relative">
                  <span className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#D8524B]" />
                  <div>
                    <span className="text-[10px] font-heading font-bold text-[#D8524B] uppercase tracking-widest block">7 days before</span>
                    <p className="text-xs text-gray-700 mt-0.5 font-sans">"Hi John! Your gym pass expires next week. Secure your lock-in rate here..."</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-l-2 border-[#D8524B]/30 pl-4 relative">
                  <span className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#D8524B]" />
                  <div>
                    <span className="text-[10px] font-heading font-bold text-[#D8524B] uppercase tracking-widest block">3 days before</span>
                    <p className="text-xs text-gray-700 mt-0.5 font-sans">"Friendly reminder: renewal invoice will process on Thursday..."</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2 mt-6">
                {["Gyms", "Fitness Studios", "Clubs"].map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-gray-700 border border-gray-100 shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            </fm.div>

            {/* Card 2: Appointment Reminders */}
            <fm.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="lg:w-[42%] relative bg-[#EDEDE8] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden min-h-[440px] select-none"
            >
              <div className="absolute left-[-10%] bottom-[-10%] w-[80%] h-[60%] bg-[#E4E4DF] rounded-full filter blur-[20px] pointer-events-none z-0" />

              <div className="relative z-10">
                <span className="text-[12px] font-heading font-bold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
                  Appointments
                  <span className="bg-[#D8524B]/10 text-[#D8524B] px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                    Future Vision
                  </span>
                </span>
                <h3 className="font-heading font-bold text-2xl sm:text-[28px] text-[#010203] leading-tight">
                  Reduce No-Shows Automatically
                </h3>
                <p className="font-sans text-sm sm:text-[15px] text-gray-600 mt-3 leading-relaxed">
                  Send timely appointment reminders. Let clients confirm, reschedule, or cancel directly on WhatsApp.
                </p>
              </div>

              {/* Visual illustration: WhatsApp mockup bubble */}
              <div className="relative z-10 mt-6 flex justify-start">
                <WhatsAppMessageBubble
                  businessName="Glow Wellness Salon"
                  message="Hi Sarah! Your appointment is tomorrow at 2:00 PM. Reply YES to confirm, or call us if you need to reschedule. See you soon!"
                  time="1:45 PM"
                />
              </div>

              <div className="relative z-10 flex flex-wrap gap-2 mt-6">
                {["Clinics", "Salons", "Studios"].map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-gray-600 border border-gray-150">
                    {t}
                  </span>
                ))}
              </div>
            </fm.div>
          </div>

          {/* Row 2: 42% salmon | 58% gray */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Card 3: Booking Confirmations */}
            <fm.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="lg:w-[42%] relative bg-[#F5D5C8] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden min-h-[440px] select-none"
            >
              <div className="absolute right-[-10%] bottom-[-10%] w-[80%] h-[60%] bg-[#ECC5B7] rounded-full filter blur-[24px] pointer-events-none z-0" />

              <div className="relative z-10">
                <span className="text-[12px] font-heading font-bold text-[#D8524B] uppercase tracking-wider block mb-2 flex items-center gap-2">
                  Bookings
                  <span className="bg-[#D8524B]/10 text-[#D8524B] px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                    Future Vision
                  </span>
                </span>
                <h3 className="font-heading font-bold text-2xl sm:text-[28px] text-[#010203] leading-tight">
                  Instant Confirmation on Every Booking
                </h3>
                <p className="font-sans text-sm sm:text-[15px] text-[#6A5A55] mt-3 leading-relaxed">
                  Confirm bookings instantly. Send customers check-in guidelines, seat selections, or receipt details immediately.
                </p>
              </div>

              {/* Visual WhatsApp bubble */}
              <div className="relative z-10 mt-6 flex justify-start">
                <WhatsAppMessageBubble
                  businessName="Taco Fiesta Restaurant"
                  message="✅ Booking Confirmed! Your table for 4 is reserved for tonight at 7:30 PM under the name Sarah. Directions: 12 Main St."
                  time="Just now"
                />
              </div>

              <div className="relative z-10 flex flex-wrap gap-2 mt-6">
                {["Restaurants", "Tickets", "Tours"].map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-gray-600 border border-gray-150">
                    {t}
                  </span>
                ))}
              </div>
            </fm.div>

            {/* Card 4: Customer Notifications */}
            <fm.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="lg:w-[58%] relative bg-[#EDEDE8] rounded-[28px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden min-h-[440px] select-none"
            >
              <div className="absolute left-[10%] top-[10%] w-[70%] h-[70%] bg-[#E4E4DF] rounded-full filter blur-[20px] pointer-events-none z-0" />

              <div className="relative z-10">
                <span className="text-[12px] font-heading font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  AI Auto Reply
                </span>
                <h3 className="font-heading font-bold text-2xl sm:text-[28px] text-[#010203] leading-tight">
                  AI Auto Message Reply
                </h3>
                <p className="font-sans text-sm sm:text-[15px] text-gray-600 mt-3 leading-relaxed max-w-sm">
                  Respond to customer inquiries 24/7. Automatically answer FAQs, capture hot leads, and provide instant support.
                </p>
              </div>

              {/* Visual illustration: Notification tags */}
              <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 max-w-md">
                {[
                  { text: "FAQ Answering", emoji: "💬" },
                  { text: "Lead Capturing", emoji: "🎯" },
                  { text: "Instant Support", emoji: "⚡" },
                  { text: "24/7 Availability", emoji: "🕒" }
                ].map((tag) => (
                  <div key={tag.text} className="bg-white/80 border border-gray-200/50 p-3.5 rounded-xl flex items-center gap-2.5 shadow-sm">
                    <span className="text-lg">{tag.emoji}</span>
                    <span className="text-xs font-heading font-bold text-gray-700">{tag.text}</span>
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex flex-wrap gap-2 mt-6">
                {["FAQs", "Lead Forms", "Auto Support"].map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-gray-600 border border-gray-150">
                    {t}
                  </span>
                ))}
              </div>
            </fm.div>
          </div>

          {/* Row 3: 33% white | 33% salmon | 33% dark */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Card 5: Follow-ups */}
            <fm.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="lg:w-1/3 relative bg-white rounded-[28px] p-8 flex flex-col justify-between overflow-hidden min-h-[380px] border border-gray-150 select-none shadow-sm"
            >
              <div>
                <span className="text-[12px] font-heading font-bold text-[#D8524B] uppercase tracking-wider block mb-2 flex items-center gap-2">
                  Follow-Ups
                  <span className="bg-[#D8524B]/10 text-[#D8524B] px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                    Future Vision
                  </span>
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#010203] leading-tight">
                  Conversations That Continue Automatically
                </h3>
                <p className="font-sans text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
                  Follow up with new leads, ask for feedback after appointments, and nurture customer relationships automatically.
                </p>
              </div>

              {/* 3 tag pills */}
              <div className="flex flex-col gap-2 mt-4">
                {["⭐ Feedback Request", "👋 Lead Check-in", "🎁 Re-engagement offer"].map((p) => (
                  <div key={p} className="bg-[#F8F8FF] border border-gray-100 p-2.5 rounded-xl text-xs font-heading font-bold text-gray-600">
                    {p}
                  </div>
                ))}
              </div>
            </fm.div>

            {/* Card 6: Workflows */}
            <fm.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="lg:w-1/3 relative bg-[#F5D5C8] rounded-[28px] p-8 flex flex-col justify-between overflow-hidden min-h-[380px] select-none"
            >
              <div>
                <span className="text-[12px] font-heading font-bold text-[#D8524B] uppercase tracking-wider block mb-2 flex items-center gap-2">
                  Workflows
                  <span className="bg-[#D8524B]/10 text-[#D8524B] px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                    Future Vision
                  </span>
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#010203] leading-tight">
                  Structured Conversations, Zero Manual Work
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#6A5A55] mt-2.5 leading-relaxed">
                  Design custom automated conversation paths. Lead customers from first message to booking confirmation seamlessly.
                </p>
              </div>

              {/* Flow preview */}
              <div className="flex items-center justify-between gap-1.5 mt-4 bg-white/40 p-3 rounded-xl border border-white/20 text-[10px] font-heading font-bold text-gray-700">
                <span className="bg-white px-2 py-1 rounded">Trigger</span>
                <ChevronRight className="w-3 h-3 text-[#D8524B]" />
                <span className="bg-[#D8524B] text-white px-2 py-1 rounded">Message 1</span>
                <ChevronRight className="w-3 h-3 text-[#D8524B]" />
                <span className="bg-white px-2 py-1 rounded">Wait</span>
                <ChevronRight className="w-3 h-3 text-[#D8524B]" />
                <span className="bg-white px-2 py-1 rounded">Message 2</span>
              </div>
            </fm.div>

            {/* Card 7: Summary */}
            <fm.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="lg:w-1/3 relative bg-[#010203] rounded-[28px] p-8 flex flex-col justify-between overflow-hidden min-h-[380px] text-white select-none"
            >
              <div>
                <span className="text-[12px] font-heading font-bold text-[#D8524B] uppercase tracking-wider block mb-2">
                  Full Suite
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-extrabold text-[96px] text-[#D8524B] leading-none">2</span>
                  <span className="font-heading font-bold text-xl text-gray-300">Automations</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">
                  One WhatsApp connection powers both of them. Scale your operations without technical overhead.
                </p>
              </div>

              <div className="mt-6">
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 text-sm font-heading font-bold text-[#D8524B] hover:text-[#c0433d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D8524B]"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </fm.div>
          </div>
        </div>
      </div>
    </section>
  );
};
