import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Atom Automation",
  description: "Privacy Policy for Atom Automation.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-gray-500 mb-8">
            Effective Date: 01/07/2026
          </p>

          <div className="space-y-6 font-sans text-gray-600 text-[15px] leading-relaxed text-left">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              1. Introduction
            </h2>
            <p>
              This Privacy Policy describes how Atom Automation collects, uses, processes, stores, and protects user data in compliance with applicable laws, including but not limited to Meta (Facebook/WhatsApp) policies and applicable data protection standards.
            </p>
            <p>
              By accessing or using Atom Automation, you agree to the terms outlined in this Privacy Policy. If you do not agree, you must discontinue use of the platform immediately.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              2. Scope of Policy
            </h2>
            <p>
              This policy applies to website visitors, registered businesses and users, clients using our automation services, API users and integrations, and third-party integrations. It covers all data collected via the Atom Automation platform, website (atomautomation.in), APIs, and customer communication systems (WhatsApp, SMS, email).
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              3. Data We Collect
            </h2>
            <p>
              We may collect the following types of data:
            </p>
            <h3 className="font-heading font-bold text-base text-[#010203] pt-2">
              3.1 Personal Information
            </h3>
            <p className="pl-4">
              Name, email address, phone number, and business details.
            </p>
            <h3 className="font-heading font-bold text-base text-[#010203] pt-2">
              3.2 Technical Data
            </h3>
            <p className="pl-4">
              IP address, device type, browser information, and usage logs.
            </p>
            <h3 className="font-heading font-bold text-base text-[#010203] pt-2">
              3.3 Communication Data
            </h3>
            <p className="pl-4">
              Messages sent via WhatsApp, SMS, or email, appointment and booking data, membership and renewal data, and chat history (processed but not owned by Atom Automation).
            </p>
            <h3 className="font-heading font-bold text-base text-[#010203] pt-2">
              3.4 Payment Data
            </h3>
            <p className="pl-4">
              Transaction details and billing information. (Note: We do NOT store card details; payments are handled by third-party gateways).
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              4. Data Usage
            </h2>
            <p>
              We use collected data for account creation and authentication, membership reminder delivery, appointment booking, rescheduling, and cancellation, AI Auto Reply and customer support, campaign and messaging delivery via WhatsApp/SMS/email, platform improvement and performance optimization, and legal compliance and fraud prevention.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              5. Data Ownership
            </h2>
            <p>
              Users (businesses) retain ownership of their customer data. However, Atom Automation acts as a data processor, not a data controller. Users are solely responsible for the data they upload or process, and Atom Automation is not liable for misuse of customer data by users.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              6. Third-Party Services
            </h2>
            <p>
              Atom Automation integrates with third-party platforms including Meta (WhatsApp, Facebook APIs), SMS and email service providers, and payment gateways (Razorpay, Stripe, etc.). By using Atom Automation, you agree to comply with Meta Platform Policies, WhatsApp Business Messaging Policy, and the Terms of Service of any connected third-party providers. We are not responsible for third-party data handling practices.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              7. WhatsApp & Meta Compliance
            </h2>
            <p>
              Users must strictly follow the WhatsApp Business Messaging Policy, opt-in requirements, and anti-spam guidelines. Any violation may result in account suspension, permanent termination, and reporting to Meta authorities. Atom Automation holds no responsibility for bans or restrictions imposed by WhatsApp/Meta.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              8. Data Security
            </h2>
            <p>
              We implement industry-standard security measures including secure servers, encryption protocols, and access control systems. However, no system is 100% secure, and users are responsible for safeguarding their credentials.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              9. Data Storage & Retention
            </h2>
            <p>
              Data is stored on secure servers with industry-standard protection measures. Logs may be retained for system monitoring, optimization, and security purposes. Old or unnecessary data may be automatically deleted to maintain system performance.
            </p>
            <p>
              We reserve the right to remove unused or redundant data, optimize and maintain database performance, and delete inactive or unused accounts. Users are advised to maintain their own backups of any important data, as Atom Automation shall not be responsible for any data loss resulting from data retention or deletion policies.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              10. Cookies & Tracking
            </h2>
            <p>
              We use cookies and tracking technologies for analytics, performance monitoring, and user experience improvement. Users can disable cookies via browser settings.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              11. No Refund Policy (Strict)
            </h2>
            <p>
              All payments made to Atom Automation are final and non-refundable. This includes subscription plans, setup services, and usage-based charges. Once a service is activated or delivered, no refund requests will be accepted under any circumstances. Users are advised to review features carefully before purchase and contact support for clarification before payment.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              12. Limitation of Liability
            </h2>
            <p>
              Atom Automation shall NOT be liable for message delivery failures, WhatsApp/Meta restrictions or bans, data loss due to external systems, or business losses or damages. Use of the platform is at your own risk.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              13. User Responsibilities
            </h2>
            <p>
              Users agree to use the platform legally, avoid spam or abusive messaging, maintain proper opt-in consent, and protect login credentials. Violation may result in immediate account suspension or a permanent ban without notice.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              14. Account Suspension & Termination
            </h2>
            <p>
              Atom Automation reserves the right to suspend or terminate accounts, block access without prior notice, and remove data if required. Reasons include policy violation, fraudulent activity, and abuse of services.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              15. Compliance with Laws
            </h2>
            <p>
              Users must comply with local laws and regulations, data protection laws, and anti-spam laws. Atom Automation is not responsible for legal violations by users.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              16. Changes to Privacy Policy
            </h2>
            <p>
              We may update this policy at any time without prior notice. Users are responsible for reviewing the policy regularly. Continued use of Atom Automation implies acceptance of updated terms.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              17. Contact Information
            </h2>
            <p className="border-t border-gray-100 pt-4">
              <strong>Atom Automation</strong><br />
              Email: <a href="mailto:contact@atomautomation.in" className="font-bold text-[#D8524B] hover:underline">contact@atomautomation.in</a><br />
              Phone / WhatsApp: <a href="tel:+919492019371" className="font-bold hover:underline">+91 94920 19371</a>
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              18. Final Agreement
            </h2>
            <p>
              By using Atom Automation, you confirm that you have read and understood this Privacy Policy, agree to all terms and conditions, and accept the data handling practices described above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
