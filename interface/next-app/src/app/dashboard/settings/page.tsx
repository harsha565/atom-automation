"use client";

import React, { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, Bell, Trash2, Key, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";

export default function SettingsPage() {
  const { user, logout, deleteAccount, addLog } = useApp();
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile Form States
  const [businessName, setBusinessName] = useState(
    user?.businessName || ""
  )
  const [email, setEmail] = useState(
    user?.email || ""
  )
  const [isSaving, setIsSaving] = useState(false);

  // Notifications Toggles
  const [notifyFail, setNotifyFail] = useState(true);
  const [notifySync, setNotifySync] = useState(false);

  const [ownerName, setOwnerName] = useState("")
  const [phone, setPhone] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/v1/gym")
        const gym = res.data.data
        if (gym?.gym_name) setBusinessName(gym.gym_name)
        if (gym?.owner_name) setOwnerName(gym.owner_name)
        if (gym?.phone) setPhone(gym.phone)
      } catch (err) {
        console.error("Failed to fetch gym profile:", err)
      }
    }
    fetchProfile()
  }, [])

  const handleSaveProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      await api.put("/api/v1/gym", {
        gym_name: businessName,
        owner_name: ownerName,
        phone: phone,
      })
      setSaveSuccess(true)
      addLog(
        "success",
        "Settings Updated",
        "Business profile settings saved successfully."
      )
    } catch (err) {
      console.error("Failed to save profile:", err)
      addLog("error", "Save Failed", "Could not save profile.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    setDeleteConfirmText("");
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 text-left animate-fade-in select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#010203]">
          Console Settings
        </h1>
        <p className="font-sans text-sm text-gray-500 mt-1">
          Configure profile fields, notification triggers, and security credentials.
        </p>
      </div>

      {/* Radix Tabs */}
      <Tabs.Root defaultValue="profile" className="w-full">
        {/* Tab triggers */}
        <Tabs.List className="flex border-b border-gray-150 gap-6 mb-8 overflow-x-auto min-w-max">
          <Tabs.Trigger
            value="profile"
            className="flex items-center gap-2 pb-3.5 border-b-2 border-transparent font-heading font-bold text-xs uppercase tracking-wider text-gray-500 hover:text-[#010203] data-[state=active]:border-[#D8524B] data-[state=active]:text-[#D8524B] focus:outline-none cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            Business Profile
          </Tabs.Trigger>
          
          <Tabs.Trigger
            value="notifications"
            className="flex items-center gap-2 pb-3.5 border-b-2 border-transparent font-heading font-bold text-xs uppercase tracking-wider text-gray-500 hover:text-[#010203] data-[state=active]:border-[#D8524B] data-[state=active]:text-[#D8524B] focus:outline-none cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </Tabs.Trigger>

          <Tabs.Trigger
            value="security"
            className="flex items-center gap-2 pb-3.5 border-b-2 border-transparent font-heading font-bold text-xs uppercase tracking-wider text-gray-500 hover:text-[#010203] data-[state=active]:border-[#D8524B] data-[state=active]:text-[#D8524B] focus:outline-none cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            Security & Keys
          </Tabs.Trigger>

          <Tabs.Trigger
            value="account"
            className="flex items-center gap-2 pb-3.5 border-b-2 border-transparent font-heading font-bold text-xs uppercase tracking-wider text-gray-500 hover:text-[#010203] data-[state=active]:border-[#D8524B] data-[state=active]:text-[#D8524B] focus:outline-none cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Account Management
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab 1: Profile */}
        <Tabs.Content value="profile" className="focus:outline-none">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl text-left">
            <h2 className="font-heading font-bold text-base text-[#010203] border-b border-gray-100 pb-4 mb-6">
              Company Information
            </h2>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#F8F8FF] border border-gray-200 px-4 py-3 rounded-xl text-sm font-sans text-[#010203] focus:outline-none focus:ring-2 focus:ring-[#D8524B]/30 focus:border-[#D8524B]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-[#F8F8FF] border border-gray-200 px-4 py-3 rounded-xl text-sm font-sans text-[#010203] focus:outline-none focus:ring-2 focus:ring-[#D8524B]/30 focus:border-[#D8524B]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8F8FF] border border-gray-200 px-4 py-3 rounded-xl text-sm font-sans text-[#010203] focus:outline-none focus:ring-2 focus:ring-[#D8524B]/30 focus:border-[#D8524B]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-semibold text-xs text-gray-700 tracking-wide uppercase">
                  Business Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-[#F8F8FF] border border-gray-200 px-4 py-3 rounded-xl text-sm font-sans text-[#010203] focus:outline-none focus:ring-2 focus:ring-[#D8524B]/30 focus:border-[#D8524B] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-sans text-emerald-700">
                    Profile saved successfully.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="self-start flex items-center justify-center bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-xs h-[42px] px-6 rounded-xl shadow-md transition-colors"
              >
                {isSaving ? "Saving..." : "Save Profile Details"}
              </button>
            </form>
          </div>
        </Tabs.Content>

        {/* Tab 2: Notifications */}
        <Tabs.Content value="notifications" className="focus:outline-none">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl text-left">
            <h2 className="font-heading font-bold text-base text-[#010203] border-b border-gray-100 pb-4 mb-6">
              Email Notifications Settings
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4 text-sm font-sans">
                <div>
                  <span className="font-bold text-[#010203] block">Notification Dispatch Failure</span>
                  <span className="text-xs text-gray-500 mt-0.5">Receive alert email if WhatsApp message template fails.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyFail}
                  onChange={() => setNotifyFail(!notifyFail)}
                  className="w-4.5 h-4.5 accent-[#D8524B]"
                />
              </div>

              <div className="flex items-center justify-between gap-4 text-sm font-sans">
                <div>
                  <span className="font-bold text-[#010203] block">Template Synchronization Alerts</span>
                  <span className="text-xs text-gray-500 mt-0.5">Receive notifications when template lists are updated from WABA.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifySync}
                  onChange={() => setNotifySync(!notifySync)}
                  className="w-4.5 h-4.5 accent-[#D8524B]"
                />
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Tab 3: Security */}
        <Tabs.Content value="security" className="focus:outline-none">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl text-left">
            <h2 className="font-heading font-bold text-base text-[#010203] border-b border-gray-100 pb-4 mb-6">
              Isolated API Tokens
            </h2>

            <div className="bg-[#FFFFA7]/30 border border-[#FFFFA7] rounded-xl p-5 flex gap-3 text-xs font-sans text-gray-650 leading-relaxed">
              <Info className="w-5.5 h-5.5 text-[#D8524B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#010203] mb-0.5">Isolated Security Sandbox</span>
                Atom Automation token hooks are handled via Meta SSO. No password hashes are stored locally in our settings arrays. Change login credentials inside the Google/Facebook settings pages.
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Tab 4: Account Management */}
        <Tabs.Content value="account" className="focus:outline-none">
          {/* Red-tinted border card for Delete Account */}
          <div className="border border-red-200 bg-red-50/20 rounded-2xl p-6 sm:p-8 max-w-2xl text-left">
            <h2 className="font-heading font-bold text-base text-red-600 border-b border-red-100 pb-4 mb-4">
              Delete Console Profile
            </h2>
            
            <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed">
              Deleting this account terminates the Meta integration. All template sync lines, message logs, and automation statuses will be permanently deleted. This action is irreversible.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="mt-6 flex items-center justify-center gap-1.5 bg-[#D8524B] text-white hover:bg-[#c0433d] font-heading font-bold text-xs h-[42px] px-6 rounded-xl shadow-md transition-colors"
            >
              Delete Account Permanently
            </button>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010203]/40 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-[400px] bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-2xl text-left animate-slide-up">
            
            {/* Warning icon */}
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#D8524B] mb-5">
              <AlertTriangle className="w-6 h-6" />
            </div>

            {/* Content */}
            <h3 className="font-heading font-extrabold text-xl text-[#010203]">
              Delete Account Permanently?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-500 mt-2.5 leading-relaxed">
              This action is permanent and cannot be undone. All your gyms, automation configs, WhatsApp connections, and logs will be permanently deleted.
            </p>

            <div className="flex flex-col gap-1.5 mt-5">
              <label className="font-sans font-semibold text-[10px] text-gray-400 tracking-wide uppercase">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-[#F8F8FF] border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-sans text-[#010203] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D8524B]/30 focus:border-[#D8524B] transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-1/2 bg-white border border-gray-250 text-gray-700 font-heading font-bold text-xs h-11 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await deleteAccount();
                    setIsDeleteModalOpen(false);
                    router.push("/");
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                className="w-1/2 bg-[#D8524B] hover:bg-[#c0433d] text-white font-heading font-bold text-xs h-11 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
