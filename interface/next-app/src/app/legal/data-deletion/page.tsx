import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion Instructions | Atom Automation",
  description: "Instructions on how to request deletion of your account and associated data from Atom Automation.",
};

export default function DataDeletionPage() {
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
            Data Deletion Instructions
          </h1>
          <p className="font-sans text-sm text-gray-500 mb-8">
            Last Updated: 09/07/2026
          </p>

          <div className="space-y-6 font-sans text-gray-600 text-[15px] leading-relaxed text-left">
            <p>
              At Atom Automation, we respect your privacy and provide transparent ways for you to manage, export, and delete your personal data. Below, you will find detailed instructions on how to request the deletion of your account and all associated data.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              1. Self-Service Account and Data Deletion
            </h2>
            <p>
              The quickest and easiest way to delete your data is by initiating a deletion directly within your account console:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in to your <strong>Atom Automation</strong> account dashboard.</li>
              <li>Navigate to the <strong>Settings</strong> page.</li>
              <li>Under the profile or account management section, click the <strong>Delete Account</strong> option.</li>
              <li>Confirm the action by entering the required confirmation text.</li>
            </ol>
            <p>
              This action is permanent and will instantly remove your credentials and initiate the automated cleanup of your profile.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              2. What Gets Deleted
            </h2>
            <p>
              When you delete your account, we permanently and securely purge the following information from our active databases:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> Your name, business email, encrypted password hash, and user preferences.</li>
              <li><strong>Gym Profile:</strong> Your registered business details, phone number, and physical location information.</li>
              <li><strong>WhatsApp Connection Details:</strong> All tokens, application IDs, secrets, and connection metadata established with Meta/Facebook APIs.</li>
              <li><strong>Automation Configurations:</strong> Your custom scheduled renewal parameters, auto-reply configurations, and template settings.</li>
            </ul>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              3. Deletion for Facebook / Meta Login Connections
            </h2>
            <p>
              If you connected or signed up for Atom Automation via Facebook or Meta integration, you can also request data deletion through your Facebook App Settings:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to your Facebook account's <strong>Settings & Privacy &gt; Settings</strong>.</li>
              <li>Navigate to <strong>Apps and Websites</strong> in the left menu.</li>
              <li>Find and select <strong>Atom Automation</strong>.</li>
              <li>Click the <strong>Remove</strong> button.</li>
            </ol>
            <p>
              Once removed, Facebook will automatically dispatch a secure data deletion callback notification to our systems, prompting us to immediately delete your associated account data.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              4. Processing Time
            </h2>
            <p>
              Requests initiated via the self-service deletion option in <strong>Settings</strong> are processed <strong>immediately</strong>. All active configurations, connection secrets, and login credentials will be revoked and deleted in real-time. System backups containing historical log archives are naturally overwritten in standard database cycles.
            </p>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#010203] tracking-tight pt-4">
              5. Contact Support for Manual Deletion Assistance
            </h2>
            <p>
              If you no longer have access to your dashboard, cannot log in, or prefer to submit a manual deletion request, you can contact our support team.
            </p>
            <p className="border-t border-gray-100 pt-4">
              <strong>Atom Automation Support</strong><br />
              Email: <a href="mailto:contact@atomautomation.in" className="font-bold text-[#D8524B] hover:underline">contact@atomautomation.in</a><br />
              Phone / WhatsApp: <a href="tel:+919492019371" className="font-bold hover:underline">+91 94920 19371</a>
            </p>
            <p className="text-xs text-gray-500 italic mt-2">
              *Please note that manual request verification and processing may take up to 2–3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
