"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { AutomationServices } from "@/components/landing/AutomationServices";
import { Industries } from "@/components/landing/Industries";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CoreService } from "@/components/landing/CoreService";
import { SecurityOwnership } from "@/components/landing/SecurityOwnership";
import { PermissionsTable } from "@/components/landing/PermissionsTable";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8FF] overflow-visible">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1 overflow-visible">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Trust Strip */}
        <TrustBar />

        {/* 4. Services (The 6 automations) */}
        <AutomationServices />

        {/* 5. Why Automation Works (Business outcomes) */}
        <Industries />

        {/* 6. How Buddy Works (Step timeline) */}
        <HowItWorks />

        {/* 7. WhatsApp Connection Process */}
        <section id="connection-process" className="py-24 bg-[#F8F8FF] overflow-visible text-left">
          <div className="container mx-auto px-6">
            
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
                Setup Step
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[44px] text-[#010203] mt-5 leading-tight">
                Simple, Secure Authorization
              </h2>
              <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed max-w-2xl mx-auto">
                Connecting your account takes less than 3 minutes. Meta handles the authentication handshake directly so we never see your credentials.
              </p>
            </div>

            {/* 3 Steps Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              {[
                {
                  step: "01",
                  title: "Trigger Meta Authorization",
                  desc: "Click 'Continue with Meta' inside your dashboard. A secure authorization window will open directly from Meta's servers.",
                },
                {
                  step: "02",
                  title: "Review Scope Permissions",
                  desc: "Select the specific WhatsApp numbers and templates you wish to sync. Verify the access boundaries beforehand.",
                },
                {
                  step: "03",
                  title: "Connection Completed",
                  desc: "Once verified, your connection profile turns green. Atom immediately starts handling your automated reminders.",
                },
              ].map((item) => (
                <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="font-heading font-black text-2xl text-[#D8524B] mb-4 block">
                      {item.step}
                    </span>
                    <h3 className="font-heading font-bold text-base text-[#010203]">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Permissions Transparency Table integrated directly below connection explanation */}
            <PermissionsTable />

          </div>
        </section>

        {/* 8. Security & Ownership */}
        <SecurityOwnership />

        {/* 9. Core Service Detail Showcase (Move down as per directive) */}
        <CoreService />

        {/* 10. Business Success Stories (Success stories replace testimonials) */}
        <Testimonials />

        {/* 11. Solutions Custom Scale (Replaces pricing cards in v1) */}
        <Pricing />

        {/* 12. FAQ Accordions */}
        <FAQ />

        {/* 13. Final CTA */}
        <FinalCTA />
      </main>

      {/* 14. Footer */}
      <Footer />
    </div>
  );
}
