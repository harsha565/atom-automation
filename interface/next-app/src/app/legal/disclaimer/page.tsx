import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Atom Automation",
  description: "Disclaimer for Atom Automation.",
};

export default function DisclaimerPage() {
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
            Disclaimer
          </h1>
          <p className="font-sans text-sm text-gray-500 mb-8">
            Effective Date: 01/07/2026
          </p>

          <div className="space-y-6 font-sans text-gray-600 text-[15px] leading-relaxed text-left">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              1. General Information
            </h2>
            <p>
              Atom Automation provides an AI-powered automation platform for business communication, including membership reminders, appointment booking, and AI-driven customer support. All information, features, and services offered on this platform are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any guarantees or warranties of any kind.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              2. No Guarantee of Results
            </h2>
            <p>
              Atom Automation does not guarantee:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Message delivery rates</li>
              <li>Customer response or engagement rates</li>
              <li>Retention, booking, or conversion outcomes</li>
              <li>Business growth or revenue outcomes</li>
            </ul>
            <p>
              All results depend on multiple external factors, including customer behavior, WhatsApp/Meta policies, and third-party services.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              3. Third-Party Dependency (Important)
            </h2>
            <p>
              Atom Automation relies on third-party platforms such as:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Meta (WhatsApp & Facebook APIs)</li>
              <li>SMS and email service providers</li>
              <li>Payment gateways</li>
            </ul>
            <p>
              We do not control these services and are not responsible for API changes, downtime or outages, account bans or restrictions, or policy updates by third-party providers.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              4. WhatsApp & Meta Compliance
            </h2>
            <p>
              Users are fully responsible for complying with:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>WhatsApp Business Messaging Policy</li>
              <li>Meta Platform Policies</li>
              <li>Opt-in and anti-spam rules</li>
            </ul>
            <p>
              Any violation may lead to message blocking, number restrictions, or permanent bans. Atom Automation is not liable for any such actions taken by Meta or WhatsApp.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              5. User Responsibility
            </h2>
            <p>
              By using Atom Automation, you acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are responsible for your data and messaging content</li>
              <li>You must obtain proper customer consent before sending reminders or messages</li>
              <li>You must use the platform legally and ethically</li>
            </ul>
            <p>
              Misuse of the platform may result in account suspension or termination.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              6. No Professional Advice
            </h2>
            <p>
              The information provided by Atom Automation (including guides, onboarding support, or documentation) is for general informational purposes only and does not constitute legal, financial, or business advice. Users should seek professional advice before making decisions based on our platform.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              7. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall Atom Automation be liable for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Direct or indirect losses</li>
              <li>Loss of data or profits</li>
              <li>Business interruptions</li>
              <li>API failures or message delivery issues</li>
            </ul>
            <p>
              Use of the platform is entirely at your own risk.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              8. Data & Content Disclaimer
            </h2>
            <p>
              Atom Automation does not own or control user data. All data processed through the platform belongs to the user. We are not responsible for data accuracy, data misuse by users, or loss of data due to external systems. Users are advised to maintain their own backups.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              9. Service Availability
            </h2>
            <p>
              We strive to provide reliable service but do not guarantee uninterrupted access. Maintenance, updates, or external issues may cause temporary downtime.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              10. No Refund Disclaimer
            </h2>
            <p>
              All payments made to Atom Automation are <strong>final and non-refundable</strong>. We do not provide refunds for subscription plans, setup services, or partial usage or dissatisfaction. Users are advised to evaluate the service before making payment.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              11. Changes to Disclaimer
            </h2>
            <p>
              Atom Automation reserves the right to update or modify this Disclaimer at any time without prior notice. Continued use of the platform implies acceptance of the updated terms.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              12. Contact Information
            </h2>
            <p className="border-t border-gray-100 pt-4">
              <strong>Atom Automation</strong><br />
              Email: <a href="mailto:contact@atomautomation.in" className="font-bold text-[#D8524B] hover:underline">contact@atomautomation.in</a><br />
              Phone / WhatsApp: <a href="tel:+919492019371" className="font-bold hover:underline">+91 94920 19371</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
