"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { Logo } from "@/components/shared/Logo"

export default function DataDeletionStatusPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    fetch(
      `/api/v1/webhooks/data-deletion-status?id=${id}`
    )
      .then((r) => r.json())
      .then((data) => {
        setStatus(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  return (
    <div className="min-h-screen bg-[#F8F8FF] flex flex-col
      items-center justify-center px-6 py-12">
      <div className="mb-8">
        <Logo size="lg" href="/" />
      </div>

      <div className="w-full max-w-md bg-white border
        border-gray-150 rounded-3xl p-8 shadow-sm text-left">
        <h1 className="font-heading font-extrabold text-2xl
          text-[#010203] mb-2">
          Data Deletion Status
        </h1>
        <p className="font-sans text-sm text-gray-500 mb-6">
          Check the status of your data deletion request.
        </p>

        {!id && (
          <div className="flex items-start gap-3 bg-amber-50
            border border-amber-100 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-500
              shrink-0 mt-0.5" />
            <p className="text-sm font-sans text-amber-700">
              No confirmation code provided. Please use the
              link from your deletion confirmation.
            </p>
          </div>
        )}

        {id && loading && (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2
              border-[#D8524B] border-t-transparent
              animate-spin" />
            <p className="text-sm font-sans text-gray-500">
              Looking up your request...
            </p>
          </div>
        )}

        {id && !loading && status && (
          <div className="flex flex-col gap-4">
            {status.found ? (
              <div className="flex items-start gap-3
                bg-emerald-50 border border-emerald-100
                rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5
                  text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-heading
                    font-bold text-emerald-700">
                    Request {status.status === "completed"
                      ? "Completed" : "Processing"}
                  </p>
                  <p className="text-xs font-sans
                    text-emerald-600 mt-1">
                    Your data deletion request has been
                    received and processed. All associated
                    data has been permanently deleted from
                    our systems.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3
                bg-red-50 border border-red-100
                rounded-xl p-4">
                <AlertTriangle className="w-5 h-5
                  text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-sans text-red-700">
                  No deletion request found with this
                  confirmation code.
                </p>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-150
              rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between text-xs
                font-sans">
                <span className="text-gray-500">
                  Confirmation Code
                </span>
                <span className="font-mono text-gray-700
                  text-[10px]">
                  {id}
                </span>
              </div>
              {status.created_at && (
                <div className="flex justify-between
                  text-xs font-sans">
                  <span className="text-gray-500">
                    Requested
                  </span>
                  <span className="text-gray-700">
                    {new Date(status.created_at)
                      .toLocaleDateString()}
                  </span>
                </div>
              )}
              {status.completed_at && (
                <div className="flex justify-between
                  text-xs font-sans">
                  <span className="text-gray-500">
                    Completed
                  </span>
                  <span className="text-gray-700">
                    {new Date(status.completed_at)
                      .toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-xs font-sans text-gray-400
          mt-6 leading-relaxed">
          For questions about data deletion, contact us at{" "}
          <a href="mailto:contact@atomautomation.in"
            className="text-[#D8524B]">
            contact@atomautomation.in
          </a>
        </p>
      </div>
    </div>
  )
}
