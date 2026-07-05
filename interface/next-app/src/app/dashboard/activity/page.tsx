"use client";

import React, { useState } from "react";
import { useApp, ActivityLog } from "@/context/AppContext";
import { ShieldAlert, CheckCircle2, RefreshCw, Filter } from "lucide-react";

export default function ActivityLogPage() {
  const { logs, addLog } = useApp();
  const [filter, setFilter] = useState<"all" | "success" | "warning">("all");

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.type === filter;
  });

  const handleSimulateCheck = () => {
    addLog(
      "success",
      "Manual Audit Performed",
      "System logs checked manually. All token encryption configurations operating normally."
    );
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-fade-in select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-150 pb-5">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#010203]">
            Security Audit Trail
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Chronological audit log tracking sync handshakes and notification logs.
          </p>
        </div>

        <button
          onClick={handleSimulateCheck}
          className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-bold text-gray-700 px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
          Run Manual Audit
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400 mr-1" />
        
        {(["all", "success", "warning"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`text-xs font-heading font-bold px-3 py-1.5 rounded-lg border transition-all uppercase tracking-wider ${
              filter === type
                ? "bg-[#D8524B]/5 border-[#D8524B]/20 text-[#D8524B]"
                : "bg-white border-gray-200 text-gray-500 hover:text-[#010203]"
            }`}
          >
            {type === "all" ? "All Logs" : type === "success" ? "Success" : "Warnings"}
          </button>
        ))}
      </div>

      {/* Audit Log Timeline Card */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm text-left relative overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-sm font-semibold text-gray-400">No logs found matching filter criteria.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6 relative">
            {/* Connecting Timeline Line */}
            {filteredLogs.length > 1 && (
              <div className="absolute left-[15px] top-[10px] bottom-[10px] w-0.5 bg-gray-100 z-0" />
            )}

            {filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-4 items-start relative z-10 animate-fade-in">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                  log.type === "success" 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                    : "bg-amber-50 border-amber-100 text-amber-600"
                }`}>
                  <span className="text-sm font-bold">
                    {log.type === "success" ? "✓" : "!"}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-heading font-bold text-sm text-[#010203]">{log.title}</h3>
                    <span className="text-[10px] font-sans text-gray-400 font-medium shrink-0">{log.time}</span>
                  </div>
                  <p className="text-xs font-sans text-gray-500 mt-0.5 leading-relaxed">{log.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
