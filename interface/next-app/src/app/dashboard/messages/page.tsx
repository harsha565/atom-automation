"use client"

import React, { useState } from "react"
import { MessageCircle, Send, UserCheck,
         PhoneOff, CheckCircle2, AlertTriangle } from "lucide-react"
import { useApp } from "@/context/AppContext"
import api from "@/lib/api"

export default function MessagesPage() {
  const { wabaConnection } = useApp()

  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState(
    "membership_reminder"
  )
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<
    "success" | "error" | null
  >(null)
  const [humanEscalation, setHumanEscalation] = useState(false)
  const [messages] = useState([
    {
      id: "1",
      from: "+91 98765 43210",
      text: "Hi, when does my membership expire?",
      time: "10:32 AM",
      type: "incoming",
    },
    {
      id: "2",
      from: "bot",
      text: "Your membership expires on August 15, 2026. Would you like to renew?",
      time: "10:32 AM",
      type: "outgoing",
    },
    {
      id: "3",
      from: "+91 98765 43210",
      text: "Yes please, how do I pay?",
      time: "10:33 AM",
      type: "incoming",
    },
  ])

  const templates = [
    {
      value: "membership_reminder",
      label: "Membership Renewal Reminder",
    },
    {
      value: "appointment_reminder",
      label: "Appointment Reminder",
    },
    {
      value: "welcome_message",
      label: "Welcome Message",
    },
  ]

  const handleSendTemplate = async () => {
    if (!phoneNumber) return
    setIsSending(true)
    setSendResult(null)
    try {
      await api.post("/api/v1/whatsapp/send-template", {
        phone_number: phoneNumber,
        template_name: selectedTemplate,
      })
      setSendResult("success")
    } catch {
      setSendResult("error")
    } finally {
      setIsSending(false)
    }
  }

  if (!wabaConnection.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center
        min-h-[400px] text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gray-50
          border border-gray-150 flex items-center
          justify-center mb-6">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="font-heading font-extrabold text-xl
          text-[#010203]">
          No WhatsApp Account Connected
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-2">
          Connect your WhatsApp Business Account first to
          send and receive messages.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-left
      animate-fade-in select-none">

      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl
          sm:text-3xl text-[#010203]">
          Messages
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          Send template messages and manage customer
          conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Send Template Card */}
        <div className="bg-white border border-gray-150
          rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-heading font-bold text-base
            text-[#010203] border-b border-gray-100 pb-4">
            Send Template Message
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-semibold text-xs
              text-gray-700 uppercase tracking-wide">
              Recipient Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-[#F8F8FF] border border-gray-200
                px-4 py-3 rounded-xl text-sm font-sans
                text-[#010203] placeholder-gray-400
                focus:outline-none focus:ring-2
                focus:ring-[#D8524B]/30 focus:border-[#D8524B]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-semibold text-xs
              text-gray-700 uppercase tracking-wide">
              Select Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-[#F8F8FF] border border-gray-200
                px-4 py-3 rounded-xl text-sm font-sans
                text-[#010203] focus:outline-none focus:ring-2
                focus:ring-[#D8524B]/30 focus:border-[#D8524B]"
            >
              {templates.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {sendResult === "success" && (
            <div className="bg-emerald-50 border border-emerald-100
              rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-sans text-emerald-700">
                Template message sent successfully.
              </p>
            </div>
          )}

          {sendResult === "error" && (
            <div className="bg-red-50 border border-red-100
              rounded-xl p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-xs font-sans text-red-700">
                Failed to send. Check your WhatsApp connection.
              </p>
            </div>
          )}

          <button
            onClick={handleSendTemplate}
            disabled={isSending || !phoneNumber}
            className="w-full flex items-center justify-center
              gap-2 bg-[#D8524B] text-white hover:bg-[#c0433d]
              font-heading font-bold text-sm h-[48px] rounded-full
              shadow-lg disabled:opacity-50 transition-all"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 rounded-full border-2
                  border-white border-t-transparent animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Template
              </>
            )}
          </button>
        </div>

        {/* Controls Card */}
        <div className="flex flex-col gap-6">

          {/* Human Escalation */}
          <div className="bg-white border border-gray-150
            rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50
                  border border-blue-100 flex items-center
                  justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm
                    text-[#010203]">
                    Human Escalation
                  </h3>
                  <p className="font-sans text-xs text-gray-500 mt-1">
                    Hand off conversations to a human agent
                    when needed.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHumanEscalation(!humanEscalation)}
                className={`w-12 h-6 rounded-full transition-all
                  duration-200 relative ${
                  humanEscalation ? "bg-[#D8524B]" : "bg-gray-200"
                }`}
              >
                <span className={`absolute top-1 w-4 h-4
                  rounded-full bg-white shadow transition-all
                  duration-200 ${
                  humanEscalation ? "left-7" : "left-1"
                }`} />
              </button>
            </div>
            {humanEscalation && (
              <div className="mt-4 bg-blue-50 border border-blue-100
                rounded-xl p-3">
                <p className="text-xs font-sans text-blue-700">
                  Human escalation is active. New messages will
                  be routed to your support team.
                </p>
              </div>
            )}
          </div>

          {/* Opt-out Notice */}
          <div className="bg-white border border-gray-150
            rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50
                border border-amber-100 flex items-center
                justify-center shrink-0">
                <PhoneOff className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm
                  text-[#010203]">
                  Opt-Out Handling
                </h3>
                <p className="font-sans text-xs text-gray-500
                  mt-1 leading-relaxed">
                  Customers can reply STOP at any time to
                  opt out of messages. Opt-out requests are
                  automatically processed and respected.
                  No further messages will be sent to
                  opted-out numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages Feed */}
      <div className="bg-white border border-gray-150
        rounded-2xl p-6 shadow-sm">
        <h2 className="font-heading font-bold text-base
          text-[#010203] border-b border-gray-100 pb-4 mb-5">
          Recent Conversations
        </h2>

        <div className="flex flex-col gap-4 max-h-[400px]
          overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "outgoing"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className={`max-w-[70%] rounded-2xl px-4 py-3
                ${msg.type === "outgoing"
                  ? "bg-[#D8524B] text-white"
                  : "bg-gray-100 text-[#010203]"
                }`}
              >
                {msg.type === "incoming" && (
                  <p className="text-[10px] font-heading font-bold
                    text-gray-500 mb-1">
                    {msg.from}
                  </p>
                )}
                <p className="text-sm font-sans">{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${
                  msg.type === "outgoing"
                    ? "text-white/70"
                    : "text-gray-400"
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
