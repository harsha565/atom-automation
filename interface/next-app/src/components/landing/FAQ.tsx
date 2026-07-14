"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export const FAQ: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const faqs = [
    {
      q: "Is this safe to connect?",
      a: "Yes, completely. Atom Automation connects to your WhatsApp Business number via Meta's authorization API. We do not see, request, or store your passwords. Your login credentials remain secure within Meta's servers.",
    },
    {
      q: "Will I lose ownership of my WhatsApp Business account?",
      a: "Absolutely not. You retain full ownership and control of your WhatsApp Business Account (WABA). Atom Automation acts only as a utility layer that triggers notifications according to your custom preferences.",
    },
    {
      q: "Can I disconnect Atom Automation later?",
      a: "Yes. You can revoke our synchronization token at any time. Simply click 'Disconnect' in your console settings, or go directly to your Meta Business Integrations dashboard and remove the permission credentials instantly.",
    },
    {
      q: "How long does setup take?",
      a: "Our onboarding is designed for non-technical small business owners. Setup takes under 3 minutes. No developer APIs, code blocks, or servers to configure.",
    },
    {
      q: "What permissions are required?",
      a: "We request access to send and receive approved templates, read business profile details, and access template structures. We never request or monitor personal contact lists, payment files, or personal chat histories.",
    },
    {
      q: "Can I talk to support if I get stuck?",
      a: "Yes, we are here to help. You can submit support tickets directly inside the dashboard or contact our team via the support module, and we'll help get your automations running.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#F8F8FF] overflow-visible">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
            FAQ
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[44px] text-[#010203] mt-5 leading-tight">
            Questions We Get a Lot
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about security, authorization consent, and messaging parameters.
          </p>
        </div>

        {/* Animated Accordion Container */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-[28px] p-6 sm:p-10 shadow-sm relative z-10 select-none"
        >
          <Accordion.Root type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-100 py-4 last:border-b-0"
              >
                <Accordion.Header className="flex">
                  <Accordion.Trigger className="flex flex-1 items-center justify-between font-heading font-semibold text-[#010203] text-left text-base sm:text-[18px] py-3 cursor-pointer group transition-colors hover:text-[#D8524B] focus:outline-none">
                    <span>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#D8524B]" />
                  </Accordion.Trigger>
                </Accordion.Header>
                
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down">
                  <div className="font-sans text-[#4A4A5A] text-sm sm:text-[15px] leading-relaxed pt-2 pb-4 pr-6">
                    {faq.a}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </section>
  );
};
