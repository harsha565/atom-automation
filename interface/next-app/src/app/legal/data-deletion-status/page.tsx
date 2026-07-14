import React, { Suspense } from "react"
import { Metadata } from "next"
import DataDeletionStatusClient from "./DataDeletionStatusClient"

export const metadata: Metadata = {
  title: "Data Deletion Status | Atom Automation",
  description: "View the status of your Meta data deletion request.",
}

export default function DataDeletionStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center">
          <div
            className="w-5 h-5 rounded-full border-2 border-[#D8524B] border-t-transparent animate-spin"
          />
          <span className="ml-2 font-sans text-sm text-gray-500">
            Loading...
          </span>
        </div>
      }
    >
      <DataDeletionStatusClient />
    </Suspense>
  )
}
