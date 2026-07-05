"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { HelpCircle, Search, Mail, Phone, BookOpen, Send, Sparkles } from "lucide-react";

export default function SupportPage() {
  const { addLog } = useApp();
  
  // Search query
  const [searchQuery, setSearchQuery] = useState("");
  
  // Support Form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const faqs = [
    { q: "How do I disconnect my WhatsApp number?", a: "Go to the 'Connection' settings tab and click 'Disconnect', or revoke access inside Facebook Business Integrations." },
    { q: "Will I lose my number ownership?", a: "No. Your phone number is registered directly inside Meta. We only act as a messaging utility layer." },
    { q: "How long does template approval take?", a: "Meta usually approves notification templates in under 2 minutes automatically." },
    { q: "Can I sync multiple numbers?", a: "Starter and Growth packages support 1 number. Enterprise solutions support unlimited sync pipelines." },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      addLog("success", "Support Ticket Registered", `Support request on '${subject}' submitted successfully.`);
      
      // Reset
      setSubject("");
      setMessage("");
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-fade-in select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#010203]">
          Help & Support Center
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          Search the documentation library, read quick FAQs, or contact our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: FAQ search & contacts (60%) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* FAQ Search */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-heading font-bold text-base text-[#010203] mb-4">
              Search Quick Answers
            </h2>
            
            {/* Search Input bar */}
            <div className="relative w-full mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search queries e.g. disconnect, template approval..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F8FF] border border-gray-200 pl-11 pr-4 py-3 rounded-xl text-sm font-sans text-[#010203] focus:outline-none focus:ring-2 focus:ring-[#D8524B]/30 focus:border-[#D8524B]"
              />
            </div>

            <div className="flex flex-col gap-4 text-left">
              {filteredFaqs.length === 0 ? (
                <span className="text-xs font-semibold text-gray-400">No matching questions found.</span>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-heading font-bold text-sm text-[#010203]">
                      {faq.q}
                    </h4>
                    <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick contact list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-150 p-5 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <Mail className="w-5 h-5 text-[#D8524B] mb-2" />
              <span className="font-heading font-bold text-xs text-[#010203]">Email Us</span>
              <span className="font-sans text-[10px] text-gray-400 mt-1 select-all">support@atomautomation.in</span>
            </div>
            
            <div className="bg-white border border-gray-150 p-5 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <Phone className="w-5 h-5 text-[#D8524B] mb-2" />
              <span className="font-heading font-bold text-xs text-[#010203]">Call Support</span>
              <span className="font-sans text-[10px] text-gray-400 mt-1 select-all">+91 94920 19371</span>
            </div>

            <div className="bg-white border border-gray-150 p-5 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <BookOpen className="w-5 h-5 text-[#D8524B] mb-2" />
              <span className="font-heading font-bold text-xs text-[#010203]">Documentation</span>
              <span className="font-sans text-[10px] text-gray-400 mt-1">docs.atomautomation.com</span>
            </div>
          </div>

        </div>

        {/* Right column: Ticket Form (40%) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm text-left h-full flex flex-col justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-[#010203] border-b border-gray-100 pb-4 mb-6">
                Submit Support Ticket
              </h2>

              <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                    Ticket Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sync delayed, template rejected"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#F8F8FF] border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-sans text-[#010203] focus:outline-none focus:border-[#D8524B]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                    Description details
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details on WABA limits or message templates..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#F8F8FF] border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-sans text-[#010203] focus:outline-none focus:border-[#D8524B] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-xs h-[42px] rounded-xl shadow-md transition-colors mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Submitting..." : "Submit Support Ticket"}
                </button>
              </form>
            </div>

            {/* Success popup notice */}
            {submitSuccess && (
              <div className="mt-4 bg-emerald-50 border border-emerald-100 text-emerald-700 p-3.5 rounded-xl text-xs font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                Ticket registered! Our support team will reach out shortly.
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
