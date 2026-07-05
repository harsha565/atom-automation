import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Atom Automation",
  description: "Learn more about Atom Automation - AI Business Automation Platform.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#F8F8FF] py-12 px-6 relative overflow-hidden select-none">
      {/* Decorative glows */}
      <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[30vh] bg-[#FFFFA7]/20 rounded-full filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[30vh] bg-[#D8524B]/5 rounded-full filter blur-[100px] pointer-events-none z-0" />

      <div className="max-w-3xl mx-auto w-full relative z-10">
        {/* Top Navigation / Logo */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Logo size="lg" href="/" />
          <Link
            href="/"
            className="font-sans font-bold text-sm text-[#D8524B] hover:text-[#c0433d] transition-colors duration-150 flex items-center gap-1.5"
          >
            &larr; Back to home
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-gray-150 rounded-3xl p-8 sm:p-12 shadow-sm text-[#010203]">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#010203] tracking-tight mb-2">
            About Us
          </h1>
          <p className="font-sans text-sm text-gray-500 mb-8">
            AI Automation for Growing Businesses
          </p>

          <div className="space-y-6 font-sans text-gray-600 text-[15px] leading-relaxed text-left">
            <p>
              <strong>Atom Automation</strong> is an AI-powered automation platform built to help businesses save time, reduce manual work, and improve customer communication. We design simple, reliable automation solutions for gyms, clinics, salons, restaurants, and other service-based businesses — helping them run smoother without changing the way they already operate.
            </p>
            <p>
              In today's fast-moving business environment, staying on top of renewals, bookings, and customer queries manually is a losing battle. Atom Automation bridges that gap by handling the repetitive, time-consuming parts of customer communication automatically — so business owners can focus on what actually grows their business.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              Our Mission
            </h2>
            <p>
              Our mission is to give businesses a practical, easy-to-adopt automation platform that helps them:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Automate repetitive customer communication</li>
              <li>Reduce missed renewals and no-shows</li>
              <li>Provide instant, 24/7 customer support</li>
              <li>Improve retention and customer experience</li>
              <li>Operate more efficiently without adding overhead</li>
            </ul>
            <p>
              We believe automation shouldn't be complicated or disruptive — it should quietly work in the background and make everyday operations easier.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              What We Offer
            </h2>
            
            <h3 className="font-heading font-bold text-base text-[#010203] pt-2">
              1. Membership Reminders
            </h3>
            <p>
              Automatically remind customers about upcoming membership expirations and renewals through WhatsApp, SMS, or email — helping businesses improve retention and reduce missed renewals.
            </p>

            <h3 className="font-heading font-bold text-base text-[#010203] pt-2">
              2. AI Auto Message Reply
            </h3>
            <p>
              A 24/7 AI-powered assistant that responds to customer inquiries on WhatsApp — answering FAQs, capturing leads, and providing instant support, even outside business hours.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              Future Vision
            </h2>
            
            <h3 className="font-heading font-bold text-base text-[#010203] pt-2">
              1. Appointment Booking
            </h3>
            <p>
              Let customers book, reschedule, or cancel appointments automatically through chat or online forms, complete with instant confirmations and reminders.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              Why Choose Atom Automation
            </h2>
            <p>
              <strong>✔ Simple to Set Up</strong><br />
              No technical complexity — we get your business automated quickly, without disrupting your existing workflow.
            </p>
            <p>
              <strong>✔ Built for Indian SMBs</strong><br />
              Designed specifically for gyms, clinics, salons, restaurants, and service businesses that rely on repeat customers.
            </p>
            <p>
              <strong>✔ WhatsApp-First</strong><br />
              Reach customers where they already are, using official WhatsApp Business API integration.
            </p>
            <p>
              <strong>✔ Reliable & Secure</strong><br />
              Your customer data and communication are handled with strong security practices and dependable uptime.
            </p>
            <p>
              <strong>✔ Dedicated Support</strong><br />
              Our team is available to help with onboarding, setup, and ongoing support.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              Who Atom Automation Is For
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Gyms and fitness centers managing membership renewals</li>
              <li>Clinics and healthcare providers handling appointment scheduling</li>
              <li>Salons and spas needing booking and reminder automation</li>
              <li>Restaurants managing reservations and customer queries</li>
              <li>Any service-based business looking to automate customer communication</li>
            </ul>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              Our Commitment
            </h2>
            <p>
              We're committed to continuous improvement — regularly refining our platform with new features, better reliability, and stronger automation capabilities, while staying fully compliant with WhatsApp and Meta's platform policies.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              Our Approach
            </h2>
            <p>
              We believe in simplicity in design, reliability in execution, transparency in service, and practical, real-world automation — not complexity for its own sake. Our goal is to become the one-stop automation partner for Indian SMBs looking to save time and serve their customers better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
