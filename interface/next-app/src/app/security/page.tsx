"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ShieldCheck, Eye, ShieldAlert, Key, Server, Lock } from "lucide-react";
import { PermissionsTable } from "@/components/landing/PermissionsTable";

export default function SecurityPage() {
  const securityFeatures = [
    {
      title: "Meta-Approved Integration",
      desc: "Our platform connects directly through Meta's Embedded Signup. We do not request, process, or store your passwords. Your credentials stay strictly within Meta's servers.",
      icon: ShieldCheck,
    },
    {
      title: "Isolated API Scopes",
      desc: "We only ask for the minimum required permissions to read and send approved messaging templates. We have zero access to your private chats, customer payment information, or account settings.",
      icon: Lock,
    },
    {
      title: "Data Protection & Sandbox",
      desc: "All session tokens and sync parameters are isolated in secure databases. We employ state-of-the-art encryption protocols (TLS 1.3/AES-256) for data transit and storage.",
      icon: Key,
    },
    {
      title: "Dedicated Storage Infrastructure",
      desc: "Customer configuration variables are isolated at the database level. Each gym profile is containerized to prevent data leakage and ensure compliance with security standards.",
      icon: Server,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8FF] overflow-visible">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 relative z-10">
        {/* Decorative background glows */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-gradient-to-r from-[#FFFFA7]/20 to-[#D8524B]/10 rounded-full filter blur-[100px] pointer-events-none z-0" />

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
              Trust & Compliance
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#010203] mt-5 leading-tight">
              Enterprise-Grade Security
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed">
              We design our infrastructure to guarantee isolation, transparency, and data privacy. Your business assets remain entirely your own.
            </p>
          </div>

          {/* Grid: Core security details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 text-left">
            {securityFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="bg-white border border-gray-150 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#D8524B]/5 border border-[#D8524B]/10 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-[#D8524B]" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-[#010203]">
                      {feat.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-500 mt-3 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Permissions Table Section */}
          <div className="bg-white border border-gray-150 rounded-3xl p-8 sm:p-12 shadow-sm mb-20">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="font-heading font-bold text-2xl text-[#010203]">
                Permissions Transparency
              </h2>
              <p className="font-sans text-xs sm:text-sm text-gray-500 mt-2">
                We advocate for clear, explicit boundaries. Here is exactly what we can and cannot see when you connect.
              </p>
            </div>
            <PermissionsTable />
          </div>

          {/* Callout Notice */}
          <div className="bg-[#FFFFA7] text-[#010203] border border-[#FFFFA7] rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start gap-6 text-left">
            <ShieldAlert className="w-10 h-10 text-[#D8524B] shrink-0" />
            <div>
              <h3 className="font-heading font-bold text-lg">
                Direct Meta Handshake Verification
              </h3>
              <p className="font-sans text-sm text-gray-700 mt-2 leading-relaxed">
                When authorize your WhatsApp number, always verify that the authorization window popup is served directly on `facebook.com` or `meta.com`. Atom Automation will never prompt for passwords, database keys, or logins within our own application layout.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
