"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, MessageCircle, Zap } from "lucide-react";

interface ConnectionFlowDiagramProps {
  variant?: "light" | "dark-bg";
  scale?: number;
}

export const ConnectionFlowDiagram: React.FC<ConnectionFlowDiagramProps> = ({
  variant = "light",
  scale = 1,
}) => {
  const isDarkBg = variant === "dark-bg";

  const nodes = [
    {
      id: "business",
      title: "Your Business",
      status: "Verified",
      icon: Building2,
      badgeColor: "bg-emerald-500",
      iconColor: isDarkBg ? "text-emerald-400" : "text-emerald-500",
    },
    {
      id: "meta",
      title: "Meta Authorization",
      status: "Secure Authorization Flow",
      icon: ShieldCheck,
      badgeColor: "bg-blue-500",
      iconColor: isDarkBg ? "text-blue-400" : "text-blue-500",
    },
    {
      id: "whatsapp",
      title: "WhatsApp Business",
      status: "Active Sync",
      icon: MessageCircle,
      badgeColor: "bg-green-500",
      iconColor: isDarkBg ? "text-green-400" : "text-green-500",
    },
    {
      id: "buddy",
      title: "Atom Automation",
      status: "Running",
      icon: Zap,
      badgeColor: "bg-[#D8524B]",
      iconColor: "text-[#D8524B]",
    },
  ];

  return (
    <div
      className="relative flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto gap-8 md:gap-4 py-8 select-none overflow-visible"
      style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
    >
      {/* Background SVG connection path for desktop */}
      <div className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0 overflow-visible">
        <svg className="w-full h-full" style={{ overflow: "visible" }}>
          {/* Path coordinates are dynamic but we can lay out nodes and draw straight lines between them */}
          {/* We will draw a line across the center of the container (y = 50%) */}
          <line
            x1="8%"
            y1="50%"
            x2="92%"
            y2="50%"
            stroke={isDarkBg ? "rgba(255, 255, 255, 0.1)" : "rgba(1, 2, 3, 0.08)"}
            strokeWidth="3"
            strokeDasharray="8 6"
            className="animate-dash"
          />
          {/* Moving glowing dot along the path */}
          <motion.circle
            r="6"
            fill="#D8524B"
            className="shadow-lg shadow-[#D8524B]/50"
            initial={{ cx: "8%" }}
            animate={{ cx: "92%" }}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </svg>
      </div>

      {/* Background SVG connection paths for mobile vertical flow */}
      <div className="absolute inset-0 w-full h-full pointer-events-none block md:hidden z-0 overflow-visible">
        <svg className="w-full h-full" style={{ overflow: "visible" }}>
          <line
            x1="50%"
            y1="5%"
            x2="50%"
            y2="95%"
            stroke={isDarkBg ? "rgba(255, 255, 255, 0.1)" : "rgba(1, 2, 3, 0.08)"}
            strokeWidth="3"
            strokeDasharray="8 6"
            className="animate-dash"
          />
          <motion.circle
            r="6"
            fill="#D8524B"
            initial={{ cy: "5%" }}
            animate={{ cy: "95%" }}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ cx: "50%" }}
          />
        </svg>
      </div>

      {/* Node items */}
      {nodes.map((node, index) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className={`relative z-10 w-[240px] md:w-[180px] lg:w-[210px] p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${
              isDarkBg
                ? "bg-[#0b0c10] border border-white/5 shadow-2xl"
                : "bg-white border border-[#010203]/5 shadow-xl shadow-gray-100"
            }`}
          >
            {/* Glowing Active Ring for Buddy or Connected node */}
            {node.id === "buddy" && (
              <span className="absolute -inset-px rounded-2xl border-2 border-[#D8524B]/30 animate-pulse pointer-events-none" />
            )}

            {/* Icon Circle */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                isDarkBg ? "bg-white/5 border border-white/10" : "bg-[#F8F8FF] border border-[#010203]/5"
              }`}
            >
              <Icon className={`w-6 h-6 ${node.iconColor}`} />
            </div>

            {/* Node Info */}
            <span
              className={`font-heading font-bold text-sm ${
                isDarkBg ? "text-white" : "text-[#010203]"
              }`}
            >
              {node.title}
            </span>

            {/* Status Badge */}
            <div className="flex items-center gap-1.5 mt-2 bg-[#F8F8FF]/5 border border-[#010203]/5 px-2 py-0.5 rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${node.badgeColor} animate-pulse`} />
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${isDarkBg ? "text-gray-400" : "text-gray-500"}`}>
                {node.status}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
