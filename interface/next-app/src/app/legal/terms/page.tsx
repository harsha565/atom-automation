import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Atom Automation",
  description: "Terms & Conditions for Atom Automation.",
};

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="font-sans text-sm text-gray-500 mb-8">
            Effective Date: 01/07/2026
          </p>

          <div className="space-y-6 font-sans text-gray-600 text-[15px] leading-relaxed text-left">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Atom Automation, you agree to be bound by these Terms & Conditions. If you do not agree, you must not use the platform.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              2. Service Overview
            </h2>
            <p>
              Atom Automation provides an AI-powered business automation platform that enables users to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Send automated membership and renewal reminders</li>
              <li>Manage appointment bookings, rescheduling, and cancellations</li>
              <li>Deploy an AI Auto Reply assistant for customer support on WhatsApp</li>
              <li>Automate customer communication via WhatsApp, SMS, or email</li>
            </ul>
            <p>
              Atom Automation acts only as a technology platform and does not control or guarantee message delivery.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              3. User Responsibilities
            </h2>
            <p>
              By using Atom Automation, you agree to provide accurate business and contact information, to maintain account security, not to use the platform for spam, fraud, or illegal activity, and to comply with all applicable laws. You are solely responsible for all activities under your account.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              4. WhatsApp & Meta Compliance (Strict)
            </h2>
            <p>
              Users must strictly follow the WhatsApp Business Policy, Meta Platform Policies, and opt-in requirements for messaging. Prohibited activities include sending unsolicited messages, spamming customers, and misleading or fraudulent communication.
            </p>
            <p>
              Violation may result in immediate suspension, permanent account termination, and reporting to Meta/WhatsApp. Atom Automation is not responsible for any bans or restrictions imposed by Meta or WhatsApp.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              5. Account Registration & Access
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Users must verify their email/phone and provide valid business details</li>
              <li>Atom Automation reserves the right to reject or suspend accounts</li>
              <li>Sharing login credentials is prohibited</li>
            </ul>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              6. Payments & Billing
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All services are prepaid</li>
              <li>Subscription plans must be paid in advance</li>
              <li>Prices are subject to change without notice</li>
            </ul>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              7. No Refund Policy (Strict)
            </h2>
            <p>
              All payments made to Atom Automation are non-refundable under any circumstances, including but not limited to subscription plans, setup services, usage-based charges, or partial usage or non-usage. Users are responsible for evaluating the service before purchase.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              8. Service Availability
            </h2>
            <p>
              We aim to provide high uptime but do not guarantee uninterrupted service. Downtime may occur due to maintenance or third-party services.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              9. Limitation of Liability
            </h2>
            <p>
              Atom Automation shall not be liable for message delivery failures, WhatsApp/Meta bans or restrictions, data loss or delays, or business losses or damages. Use of the platform is at your own risk.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              10. Data Usage & Privacy
            </h2>
            <p>
              User data is processed as per our Privacy Policy. Users retain ownership of their data, and Atom Automation is not responsible for misuse of data by users.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              11. Account Suspension & Termination
            </h2>
            <p>
              Atom Automation reserves the right to suspend or terminate accounts without prior notice, remove data if required, and block access for policy violations. Reasons include spam activity, fraudulent usage, and abuse of services.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              12. Third-Party Services
            </h2>
            <p>
              Atom Automation integrates with Meta (WhatsApp API), SMS and email service providers, and payment gateways. We are not responsible for third-party service failures or policy changes.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              13. Intellectual Property
            </h2>
            <p>
              All platform content, design, and technology belong to Atom Automation. Unauthorized copying or redistribution is prohibited.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              14. Modifications to Service
            </h2>
            <p>
              We reserve the right to modify or discontinue services, update features or pricing, and change policies without prior notice.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              15. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the appropriate courts.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              16. Contact Information
            </h2>
            <p className="border-t border-gray-100 pt-4">
              <strong>Atom Automation</strong><br />
              Email: <a href="mailto:contact@atomautomation.in" className="font-bold text-[#D8524B] hover:underline">contact@atomautomation.in</a><br />
              Phone / WhatsApp: <a href="tel:+919492019371" className="font-bold hover:underline">+91 94920 19371</a>
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              17. Final Agreement
            </h2>
            <p>
              By using Atom Automation, you confirm that you have read and understood these Terms, agree to comply with all policies, and accept all risks associated with usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
