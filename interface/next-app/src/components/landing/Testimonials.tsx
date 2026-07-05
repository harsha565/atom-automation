"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface CaseStudy {
  id: number;
  industry: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  challenge: string;
  automation: string;
  outcome: string;
  initials: string;
  avatarColor: string;
}

export const Testimonials: React.FC = () => {
  const caseStudies: CaseStudy[] = [
    {
      id: 0,
      industry: "Gym & Wellness",
      quote: "Atom changed our membership renewals completely. We automated expiry alerts 7 days before lapse, resulting in a 40% jump in retention and saving our receptionist 10 hours a week.",
      author: "Marcus Vance",
      title: "Owner & General Manager",
      company: "Active Fitness Club",
      challenge: "Manually tracking 400 memberships and sending manual texts.",
      automation: "Automated renewal alerts and +40% retention.",
      outcome: "Saved 10 hours a week, 40% renewal spike.",
      initials: "MV",
      avatarColor: "bg-[#D8524B] text-white",
    },
    {
      id: 1,
      industry: "Clinic & Dental",
      quote: "No-shows dropped to nearly zero in the first month. By sending automatic confirmation messages 24 hours prior and enabling direct replies, clients cancel or reschedule instantly.",
      author: "Dr. Sarah Patel",
      title: "Chief Orthodontist",
      company: "Apex Dental Center",
      challenge: "20% appointment no-shows, lost revenue.",
      automation: "Direct confirmations and rescheduling flows.",
      outcome: "No-shows dropped to 2%, automated rescheduling.",
      initials: "SP",
      avatarColor: "bg-blue-600 text-white",
    },
    {
      id: 2,
      industry: "Salons & Studios",
      quote: "Our clients love receiving instant confirmations and styling update notes on WhatsApp. The integration process took under 3 minutes and it works perfectly in the background.",
      author: "Elena Rostova",
      title: "Founder & Creative Lead",
      company: "Glow & Co. Hair Salon",
      challenge: "Confirming bookings manually, clients forgetting appointments.",
      automation: "Instant booking confirmations and style briefs.",
      outcome: "100% automated booking confirmations, zero missed bookings.",
      initials: "ER",
      avatarColor: "bg-[#FFFFA7] text-[#010203]",
    },
    {
      id: 3,
      industry: "Restaurants & Grills",
      quote: "We automated table confirmations and reservation alerts. It runs seamlessly while our staff concentrates on service. We've seen a noticeable bump in customer satisfaction.",
      author: "Ricardo Ramos",
      title: "Managing Director",
      company: "Taco Fiesta Grill",
      challenge: "Busy dinner rush reservation phone calls.",
      automation: "Instant text reservation confirmations.",
      outcome: "Fewer phone interruptions, higher customer satisfaction.",
      initials: "RR",
      avatarColor: "bg-emerald-600 text-white",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % caseStudies.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  };

  const current = caseStudies[currentIndex];
  const nextItem = caseStudies[(currentIndex + 1) % caseStudies.length];
  const prevItem = caseStudies[(currentIndex - 1 + caseStudies.length) % caseStudies.length];

  return (
    <section id="case-studies" className="py-24 bg-[#F8F8FF] overflow-visible">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#D8524B] bg-[#D8524B]/5 px-3.5 py-1.5 rounded-full">
            Success Stories
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-[44px] text-[#010203] mt-5 leading-tight">
            Real Outcomes for Real Businesses
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#4A4A5A] mt-4 leading-relaxed max-w-2xl mx-auto">
            Read how small and medium businesses leverage automated reminders to optimize their daily scheduling operations.
          </p>
        </div>

        {/* 3-Column Asymmetric Testimonial Grid with scroll animations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch"
        >
          
          {/* LEFT COLUMN (25%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 flex flex-col justify-between gap-6"
          >
            {/* Top Stat Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 text-left shadow-sm flex flex-col justify-center min-h-[160px]">
              <span className="font-heading font-extrabold text-[#D8524B] text-sm uppercase tracking-widest block mb-1">
                Trusted
              </span>
              <p className="font-heading font-bold text-lg text-[#010203] leading-tight">
                By growing <br /> businesses
              </p>
              <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">
                Loved by owners. Simple integrations.
              </p>
            </div>

            {/* Business Owner Initials Avatar Frame */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-4 shadow-sm flex items-center justify-center min-h-[180px] lg:flex-1">
              <div className={`w-32 h-32 rounded-2xl flex items-center justify-center font-heading font-black text-4xl shadow-inner ${current.avatarColor}`}>
                {current.initials}
              </div>
            </div>
          </motion.div>

          {/* CENTER COLUMN (50%) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 bg-white border border-gray-100 rounded-[28px] p-8 sm:p-12 shadow-sm flex flex-col justify-between min-h-[400px] text-left relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-[40%] h-[40%] bg-gradient-to-br from-[#FFFFA7]/20 to-transparent rounded-full filter blur-[40px] pointer-events-none" />

            <div>
              {/* Huge quote mark */}
              <span className="font-heading font-extrabold text-[96px] leading-[0.8] text-[#D8524B] block -mb-4 select-none">
                &ldquo;
              </span>
              
              {/* Quote text */}
              <p className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-[#010203] leading-relaxed relative z-10">
                {current.quote}
              </p>
            </div>

            {/* Author info & Case Details */}
            <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="font-heading font-bold text-base text-[#010203]">
                  {current.author}
                </h4>
                <p className="font-sans text-xs text-gray-500 mt-0.5">
                  {current.title}, <span className="font-semibold text-gray-700">{current.company}</span>
                </p>
              </div>

              {/* Action badges showing Outcome details */}
              <div className="bg-[#D8524B]/5 border border-[#D8524B]/15 px-3 py-1.5 rounded-xl text-left self-start">
                <span className="text-[10px] font-heading font-bold text-[#D8524B] uppercase tracking-wider block">Outcome</span>
                <span className="text-[11px] font-bold text-[#010203]">{current.outcome}</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (25%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3 flex flex-col justify-between gap-4"
          >
            {/* Next Testimonial Card */}
            <button
              onClick={nextTestimonial}
              className="bg-[#F5D5C8] hover:bg-[#ecc5b7] text-[#6A4A40] text-left p-6 rounded-[24px] flex flex-col justify-between flex-1 min-h-[180px] transition-colors duration-200 group relative overflow-hidden cursor-pointer focus:outline-none"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-heading font-bold text-xs uppercase tracking-wider">Next Story &rarr;</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-heading font-bold text-xs text-[#6A4A40] shadow-sm">
                  {nextItem.initials}
                </div>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-heading font-bold tracking-widest text-[#D8524B] uppercase block">{nextItem.industry}</span>
                <p className="font-sans text-xs line-clamp-2 text-[#6A4A40]/80 mt-1">
                  &ldquo;{nextItem.quote}&rdquo;
                </p>
              </div>
            </button>

            {/* Previous Testimonial Card */}
            <button
              onClick={prevTestimonial}
              className="bg-[#EDEDE8] hover:bg-[#e4e4df] text-gray-700 text-left p-6 rounded-[24px] flex flex-col justify-between flex-1 min-h-[180px] transition-colors duration-200 group relative overflow-hidden cursor-pointer focus:outline-none"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-heading font-bold text-xs uppercase tracking-wider">&larr; Prev Story</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-heading font-bold text-xs text-gray-650 shadow-sm">
                  {prevItem.initials}
                </div>
              </div>
              <div className="mt-4">
                <span className="text-[11px] font-heading font-bold tracking-widest text-gray-500 uppercase block">{prevItem.industry}</span>
                <p className="font-sans text-xs line-clamp-2 text-gray-600 mt-1">
                  &ldquo;{prevItem.quote}&rdquo;
                </p>
              </div>
            </button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
