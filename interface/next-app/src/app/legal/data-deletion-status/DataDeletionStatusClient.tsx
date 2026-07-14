"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import Link from "next/link"
import api from "@/lib/api"

export default function DataDeletionStatusClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  
  const [statusData, setStatusData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    api.get(`/api/v1/webhooks/data-deletion-status`, { params: { id } })
      .then((res) => {
        setStatusData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("API error fetching deletion status:", err)
        setError("Unable to retrieve deletion request status.\nPlease try again later.")
        setLoading(false)
      })
  }, [id])

  return (
    <div className="min-h-screen bg-[#F8F8FF] py-12 px-6 relative overflow-hidden select-none">
      {/* Decorative glows */}
      <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[30vh] bg-[#FFFFA7]/20 rounded-full filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[30vh] bg-[#D8524B]/5 rounded-full filter blur-[100px] pointer-events-none z-0" />

      <div className="max-w-3xl mx-auto w-full relative z-10">
        {/* Top Navigation / Logo */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Logo size="lg" href="/" />
          <Link
            href="/"
            className="font-sans font-bold text-sm text-[#D8524B] hover:text-[#c0433d] transition-colors duration-150 flex items-center gap-1.5"
          >
            &larr; Return to Home
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-gray-150 rounded-3xl p-8 sm:p-12 shadow-sm text-[#010203]">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#010203] tracking-tight mb-2 text-left">
            Data Deletion Request Status
          </h1>
          <p className="font-sans text-sm text-gray-500 mb-8 text-left">
            View the status of your Meta data deletion request.
          </p>

          <div className="space-y-6 font-sans text-left">
            {/* Loading State */}
            {id && loading && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                <div className="w-5 h-5 rounded-full border-2 border-[#D8524B] border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-gray-650">
                  Loading deletion request...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-5">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 whitespace-pre-line font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* No ID Provided */}
            {!id && !loading && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 font-medium">
                  No confirmation code provided. Please check the status URL sent with your request.
                </p>
              </div>
            )}

            {/* Status Details */}
            {id && !loading && !error && statusData && (
              <div className="space-y-6">
                {statusData.found ? (
                  <>
                    {statusData.status === "completed" ? (
                      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-emerald-800">
                            Completed
                          </p>
                          <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                            Your deletion request has been completed successfully. All associated data has been permanently removed from our databases.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-5">
                        <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-blue-800">
                            Pending
                          </p>
                          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            Your deletion request is currently being processed.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Confirmation Code</span>
                        <span className="font-mono font-bold text-gray-800">{id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-bold capitalize ${statusData.status === "completed" ? "text-emerald-600" : "text-blue-600"}`}>
                          {statusData.status}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-5">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-800">
                        Request Not Found
                      </p>
                      <p className="text-xs text-red-700 mt-1 leading-relaxed">
                        We could not find a deletion request for this confirmation code.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 text-left">
              For questions about data deletion, contact us at{" "}
              <a href="mailto:contact@atomautomation.in" className="text-[#D8524B] hover:underline font-medium">
                contact@atomautomation.in
              </a>
            </p>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#D8524B] hover:bg-[#c0433d] text-white font-sans font-semibold text-sm rounded-full text-center transition-colors duration-150 shadow-sm"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
