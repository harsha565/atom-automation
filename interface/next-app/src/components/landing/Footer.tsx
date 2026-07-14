"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "../shared/Logo";

export const Footer: React.FC = () => {
  const linkColumns = [
    {
      title: "Services",
      links: [
        { label: "Renewal Reminders", href: "#services" },
        { label: "Appointment Alerts", href: "#services" },
        { label: "Booking Confirms", href: "#services" },
        { label: "Notifications", href: "#services" },
        { label: "Follow-Ups", href: "#services" },
        { label: "Workflows", href: "#services" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Terms of Service", href: "/legal/terms" },
        { label: "Data Deletion", href: "/legal/data-deletion" },
        { label: "Disclaimer", href: "/legal/disclaimer" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Help Center", href: "/support" },
        { label: "Contact Us", href: "/support" },
        { label: "Report an Issue", href: "/support" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-16 select-none relative z-10 text-left">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 justify-between">
          
          {/* Left Block (30% width approximate) */}
          <div className="lg:w-[30%] flex flex-col gap-6 items-start">
            <Logo size="lg" />
            
            <p className="font-sans text-[15px] text-[#4A4A5A] leading-relaxed max-w-xs">
              WhatsApp automation for real businesses. Safe, transparent, and built to scale.
            </p>

            <div className="flex flex-col gap-1 text-[13px] font-sans text-[#4A4A5A]">
              <span>Email: <a href="mailto:contact@atomautomation.in" className="font-bold text-[#D8524B] hover:underline">contact@atomautomation.in</a></span>
              <span>Phone: <a href="tel:+919492019371" className="font-bold hover:text-[#010203]">+91 94920 19371</a></span>
              <p className="text-xs text-gray-400 mt-2">
                Atom Automations
              </p>
              <p className="text-xs text-gray-400">
                Andhra Pradesh, India
              </p>
              <p className="text-xs text-gray-400">
                MSME Registered
              </p>
            </div>
            
            <div className="mt-4">
              <span className="font-sans text-[13px] text-[#9A9A9A]">
                All rights reserved. &copy; 2026 Atom Automation
              </span>
            </div>
          </div>

          {/* Right Block (70% width approximate: 4 link columns) */}
          <div className="lg:w-[65%] grid grid-cols-2 sm:grid-cols-4 gap-10">
            {linkColumns.map((col) => (
              <div key={col.title} className="flex flex-col">
                <span className="font-sans font-bold text-[11px] text-[#9A9A9A] uppercase tracking-wider mb-5">
                  {col.title}
                </span>
                
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="font-sans text-[15px] text-[#4A4A5A] hover:text-[#010203] transition-all duration-150 block w-fit"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};
