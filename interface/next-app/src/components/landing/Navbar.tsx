"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Logo } from "../shared/Logo";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const MotionLink = motion(Link);

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#outcomes" },
    { label: "Security", href: "/security" },
    { label: "Support", href: "/support" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/98 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-sm font-medium text-gray-600 hover:text-[#010203] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#010203] rounded-md px-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="font-heading text-[14px] font-semibold text-[#010203] hover:text-[#D8524B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D8524B] rounded-md"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="font-heading text-[14px] font-semibold text-gray-500 hover:text-[#010203] transition-colors focus:outline-none focus:ring-2 focus:ring-[#010203] rounded-md cursor-pointer"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <MotionLink
                  href="/login"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="font-heading text-[14px] font-semibold text-gray-600 hover:text-[#010203] px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#010203] rounded-md"
                >
                  Log in
                </MotionLink>
                <MotionLink
                  href="/signup"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="font-heading text-[14px] font-semibold bg-[#D8524B] text-white hover:bg-[#c0433d] px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8524B]"
                >
                  Get Started
                </MotionLink>
              </>
            )}
          </div>

          {/* Mobile Toggler */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-700 hover:text-[#010203] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[60px] left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40 md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-sans text-base font-semibold text-gray-700 hover:text-[#010203]"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-gray-100" />
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center font-heading text-sm font-semibold bg-[#D8524B] text-white py-3 rounded-full"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center font-heading text-sm font-semibold border border-gray-200 text-gray-600 py-3 rounded-full"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center font-heading text-sm font-semibold border border-gray-200 text-gray-700 py-3 rounded-full hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center font-heading text-sm font-semibold bg-[#D8524B] text-white py-3 rounded-full hover:bg-[#c0433d] shadow-sm"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
