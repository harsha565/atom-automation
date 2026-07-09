"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Mail, Phone, Clock, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicSupportPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !subject || !message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

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
              Get In Touch
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#010203] mt-5 leading-tight">
              Support Center
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed">
              Have questions about integrating with Meta, setting up templates, or configuring billing? Our team is ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Contact Cards */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D8524B]/5 border border-[#D8524B]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5.5 h-5.5 text-[#D8524B]" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-bold text-sm text-[#010203]">Email Support</h3>
                  <a href="mailto:contact@atomautomation.in" className="font-sans text-xs text-gray-500 mt-1 block hover:text-[#D8524B] break-all select-all font-semibold">
                    contact@atomautomation.in
                  </a>
                  <p className="font-sans text-[10px] text-gray-400 mt-1">We typically reply in under 2 hours.</p>
                </div>
              </div>

              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5.5 h-5.5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-bold text-sm text-[#010203]">Call Us</h3>
                  <a href="tel:+919492019371" className="font-sans text-xs text-gray-500 mt-1 block hover:text-emerald-600 select-all font-semibold">
                    +91 94920 19371
                  </a>
                  <p className="font-sans text-[10px] text-gray-400 mt-1">Available for direct support queries.</p>
                </div>
              </div>

              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5.5 h-5.5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-bold text-sm text-[#010203]">Business Hours</h3>
                  <p className="font-sans text-xs text-gray-500 mt-1">
                    Monday to Saturday <br />
                    10:00 AM – 6:00 PM <br />
                    <span className="text-[10px] text-gray-400 italic">(WhatsApp support available for urgent queries)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Support Form */}
            <div className="md:col-span-7">
              <div className="bg-white border border-gray-150 rounded-2xl p-8 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-lg text-[#010203] border-b border-gray-100 pb-4 mb-6 text-left">
                    Send a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F8F8FF] border border-gray-200 px-4 py-3 rounded-xl text-xs font-sans text-[#010203] focus:outline-none focus:border-[#D8524B] focus:ring-1 focus:ring-[#D8524B]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Meta verification question, pricing inquiry"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-[#F8F8FF] border border-gray-200 px-4 py-3 rounded-xl text-xs font-sans text-[#010203] focus:outline-none focus:border-[#D8524B] focus:ring-1 focus:ring-[#D8524B]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                        Message Details
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#F8F8FF] border border-gray-200 px-4 py-3 rounded-xl text-xs font-sans text-[#010203] focus:outline-none focus:border-[#D8524B] focus:ring-1 focus:ring-[#D8524B] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-sm h-[48px] rounded-xl shadow-md transition-colors mt-2"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Sending..." : "Submit Inquiry"}
                    </button>
                  </form>
                </div>

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-xs font-sans flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    Thank you! Your message has been received. We will respond shortly.
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
