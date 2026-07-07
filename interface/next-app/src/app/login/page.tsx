"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { MatrixRain } from "@/components/shared/MatrixRain";
import { motion, useReducedMotion } from "framer-motion";

const MotionLink = motion(Link);
const MotionButton = motion.button;

const loginSchema = z.object({
  email: z.string().email("Please enter a valid business email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await login(data.email, data.password);
      document.cookie = "buddy_auth_flag=true; path=/; max-age=2592000; SameSite=Lax";
      router.push("/dashboard");
    } catch (error: any) {
      const msg =
        error?.response?.data?.error?.message ||
        "Invalid email or password. Please try again.";
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8F8FF] overflow-x-hidden relative select-none">
      
      {/* LEFT COLUMN: Visual/Branding Panel with Matrix Rain */}
      <div className="w-full md:w-1/2 bg-[#F8F8FF] flex flex-col justify-between p-8 md:p-12 relative overflow-hidden border-r border-gray-150 shrink-0 min-h-[380px] md:min-h-screen">
        {/* Matrix Rain component background */}
        <MatrixRain />

        {/* Decorative glows overlay */}
        <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[30vh] bg-[#FFFFA7]/20 rounded-full filter blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[30vh] bg-[#D8524B]/5 rounded-full filter blur-[100px] pointer-events-none z-0" />
        
        {/* Top bar (Logo) */}
        <div className="relative z-10">
          <Logo size="lg" href="/" />
        </div>

        {/* Center content */}
        <div className="my-auto max-w-md relative z-10 pt-10 md:pt-0 text-left">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-[#010203] tracking-tight leading-tight">
            Ready to start your preview
          </h2>
          <p className="font-sans text-base text-gray-500 mt-4 leading-relaxed">
            Connect your WhatsApp Business Account, configure automated membership notifications, and watch your business grow in real-time.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <MotionLink
              href="/"
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-lg shadow-[#D8524B]/10 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8524B]"
            >
              Learn More
            </MotionLink>
            <MotionLink
              href="/support"
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-[#010203] font-heading font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-sm transition-all duration-150 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010203]"
            >
              Need Help? &rarr;
            </MotionLink>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 pt-10 md:pt-0 text-left">
          <span className="font-sans text-xs text-gray-400">
            &copy; 2026 Atom Automation. All rights reserved.
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Forms */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12 relative min-h-screen">
        <div className="w-full max-w-[420px] text-left">
          
          {/* Header */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#010203] tracking-tight">
            Welcome back
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-2">
            Sign in to your automation console
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                Business Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                className={`w-full bg-[#F8F8FF] border px-4 py-3 rounded-xl text-sm font-sans text-[#010203] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D8524B]/30 focus:border-[#D8524B] transition-all duration-150 ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <span className="text-[11px] font-sans font-bold text-red-500 mt-0.5">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                  Console Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-semibold text-[#D8524B] hover:text-[#c0433d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D8524B] rounded-sm"
                >
                  Forgot password?
                </Link>
              </div>
              
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full bg-[#F8F8FF] border pl-4 pr-12 py-3 rounded-xl text-sm font-sans text-[#010203] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D8524B]/30 focus:border-[#D8524B] transition-all duration-150 ${
                    errors.password ? "border-red-400" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D8524B] rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] font-sans font-bold text-red-500 mt-0.5">
                  {errors.password.message}
                </span>
              )}
            </div>

            {apiError && (
              <p className="text-[11px] font-sans font-bold text-red-500 text-center -mt-1">
                {apiError}
              </p>
            )}

            {/* Submit Button */}
            <MotionButton
              type="submit"
              disabled={isSubmitting}
              whileHover={shouldReduceMotion || isSubmitting ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion || isSubmitting ? {} : { scale: 0.98 }}
              className="w-full flex items-center justify-center bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-sm h-[52px] rounded-full shadow-lg shadow-[#D8524B]/10 hover:shadow-xl hover:shadow-[#D8524B]/20 transition-all duration-200 mt-2 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8524B]"
            >
              {isSubmitting ? "Verifying..." : "Sign In"}
            </MotionButton>
          </form>



          {/* Footer Link */}
          <div className="mt-8 text-center text-xs font-sans">
            <span className="text-gray-400">New to Atom Automation?</span>{" "}
            <Link
              href="/signup"
              className="font-bold text-[#D8524B] hover:text-[#c0433d] hover:underline"
            >
              Create account &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
