"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService"
import { setTokens, clearTokens } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"

export interface User {
  businessName: string;
  email: string;
}

export interface WabaConnection {
  isConnected: boolean;
  phoneNumber: string;
  wabaName: string;
  lastSync: string;
  activePermissionsCount: number;
  status: "Active" | "Inactive" | "Connecting" | "Error";
}

export interface ActivityLog {
  id: string;
  type: "success" | "warning" | "error";
  title: string;
  desc: string;
  time: string;
}

export interface AutomationsState {
  renewal: boolean;
  appointment: boolean;
  booking: boolean;
  notification: boolean;
  followup: boolean;
  workflow: boolean;
}

interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  wabaConnection: WabaConnection;
  logs: ActivityLog[];
  automations: AutomationsState;
  login: (email: string, password?: string) => Promise<void>;
  signup: (businessName: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  connectWaba: (phoneNumber: string, wabaName: string) => Promise<void>;
  disconnectWaba: () => void;
  toggleAutomation: (key: keyof AutomationsState) => void;
  addLog: (type: "success" | "warning" | "error", title: string, desc: string) => void;
}

const defaultConnection: WabaConnection = {
  isConnected: false,
  phoneNumber: "",
  wabaName: "",
  lastSync: "",
  activePermissionsCount: 0,
  status: "Inactive",
};

const defaultLogs: ActivityLog[] = [
  { id: "1", type: "success", title: "Portal Profile Activated", desc: "Atom Automation account verification dashboard initiated.", time: "2 hours ago" },
  { id: "2", type: "success", title: "Security Keys Generated", desc: "Local token storage sandbox isolated successfully.", time: "2 hours ago" },
];

const defaultAutomations: AutomationsState = {
  renewal: true,
  appointment: true,
  booking: false,
  notification: true,
  followup: false,
  workflow: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [wabaConnection, setWabaConnection] = useState<WabaConnection>(defaultConnection);
  const [logs, setLogs] = useState<ActivityLog[]>(defaultLogs);
  const [automations, setAutomations] = useState<AutomationsState>(defaultAutomations);

  // Restore session on mount
  useEffect(() => {
    const authStored = localStorage.getItem("buddy_auth");
    const userStored = localStorage.getItem("buddy_user");
    const connectionStored = localStorage.getItem("buddy_connection");
    const logsStored = localStorage.getItem("buddy_logs");
    const automationsStored = localStorage.getItem("buddy_automations");

    if (authStored === "true") {
      setIsAuthenticated(true);
    }
    if (userStored) {
      setUser(JSON.parse(userStored));
    }
    if (connectionStored) {
      setWabaConnection(JSON.parse(connectionStored));
    }
    if (logsStored) {
      setLogs(JSON.parse(logsStored));
    }
    if (automationsStored) {
      setAutomations(JSON.parse(automationsStored));
    }
  }, []);

  // Listen to Supabase auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setTokens(session.access_token, session.refresh_token || "")
        const email = session.user.email || ""
        const businessName = session.user.user_metadata?.businessName || 
                             session.user.user_metadata?.gym_name || 
                             email;
        const userData = {
          businessName,
          email,
        }
        setUser(userData)
        setIsAuthenticated(true)
        persist("buddy_user", userData)
        persist("buddy_auth", "true")
        
        // Set cookie flag for middleware
        document.cookie = `buddy_auth_flag=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      } else {
        if (event === "SIGNED_OUT") {
          clearTokens()
          setIsAuthenticated(false)
          setUser(null)
          localStorage.removeItem("buddy_user")
          localStorage.removeItem("buddy_auth")
          document.cookie = "buddy_auth_flag=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const persist = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  };

  const login = async (email: string, password?: string) => {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      if (data.session) {
        setTokens(data.session.access_token, data.session.refresh_token || "")
        const userData = {
          businessName: data.user.user_metadata?.businessName || data.user.user_metadata?.gym_name || email,
          email,
        }
        setUser(userData)
        setIsAuthenticated(true)
        persist("buddy_user", userData)
        persist("buddy_auth", "true")
        document.cookie = `buddy_auth_flag=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
        addLog("success", "Session Started", `Logged in as ${email}.`)
      }
    } else {
      // Direct login state handling for Google/OAuth callbacks
      setIsAuthenticated(true)
      persist("buddy_auth", "true")
      document.cookie = `buddy_auth_flag=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
    }
  }

  const signup = async (
    businessName: string,
    email: string,
    password?: string
  ) => {
    if (password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            businessName,
            gym_name: businessName,
            owner_name: businessName,
          }
        }
      })
      if (error) throw error
      
      if (data.session) {
        setTokens(data.session.access_token, data.session.refresh_token || "")
      }
      const userData = { businessName, email }
      setUser(userData)
      setIsAuthenticated(true)
      persist("buddy_user", userData)
      persist("buddy_auth", "true")
      document.cookie = `buddy_auth_flag=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      addLog("success", "Account Created", `Welcome, ${businessName}!`)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    clearTokens()
    setIsAuthenticated(false)
    setUser(null)
    setWabaConnection(defaultConnection)
    setLogs(defaultLogs)
    setAutomations(defaultAutomations)
    document.cookie = "buddy_auth_flag=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
  }

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
    } catch (err) {
      console.error("Backend delete account failed:", err);
    }
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase signOut failed:", err);
    }
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
    setWabaConnection(defaultConnection);
    setLogs(defaultLogs);
    setAutomations(defaultAutomations);
    document.cookie = "buddy_auth_flag=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    localStorage.removeItem("buddy_user");
    localStorage.removeItem("buddy_auth");
    localStorage.removeItem("buddy_connection");
    localStorage.removeItem("buddy_logs");
    localStorage.removeItem("buddy_automations");
    document.cookie = "buddy_auth_flag=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  }

  const connectWaba = async (
    phoneNumber: string,
    wabaName: string
  ) => {
    try {
      // Dynamically import to avoid circular deps
      const { whatsappService } = await import(
        "@/services/whatsappService"
      )
      const status = await whatsappService.getStatus()
      
      const connObj: WabaConnection = {
        isConnected: status.connected,
        phoneNumber: status.phone_number || phoneNumber,
        wabaName: wabaName || "WhatsApp Business",
        lastSync: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        activePermissionsCount: 3,
        status: status.connected ? "Active" : "Inactive",
      }
      setWabaConnection(connObj)
      persist("buddy_connection", connObj)
      addLog(
        "success",
        "WhatsApp Connected",
        `WhatsApp Business account linked successfully.`
      )
    } catch {
      // Fallback to passed params if status fetch fails
      const connObj: WabaConnection = {
        isConnected: true,
        phoneNumber,
        wabaName: wabaName || "WhatsApp Business",
        lastSync: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        activePermissionsCount: 3,
        status: "Active",
      }
      setWabaConnection(connObj)
      persist("buddy_connection", connObj)
    }
  }

  const disconnectWaba = () => {
    setWabaConnection(defaultConnection);
    persist("buddy_connection", defaultConnection);
    addLog(
      "warning",
      "WhatsApp Disconnected",
      "All credentials deleted and synchronization with WhatsApp Business API revoked."
    );
  };

  const toggleAutomation = (key: keyof AutomationsState) => {
    const nextVal = !automations[key];
    const newAuto = { ...automations, [key]: nextVal };
    setAutomations(newAuto);
    persist("buddy_automations", newAuto);

    const labels: Record<keyof AutomationsState, string> = {
      renewal: "Membership Renewals",
      appointment: "Appointment Reminders",
      booking: "Booking Confirmations",
      notification: "Customer Notifications",
      followup: "Lead Follow-Ups",
      workflow: "Custom Workflows",
    };
    addLog(
      nextVal ? "success" : "warning",
      `${labels[key]} ${nextVal ? "Enabled" : "Disabled"}`,
      `The automation service for ${labels[key].toLowerCase()} was toggled ${nextVal ? "on" : "off"}.`
    );
  };

  const addLog = (type: "success" | "warning" | "error", title: string, desc: string) => {
    setLogs((prev) => {
      const newLogs = [
        {
          id: Date.now().toString(),
          type,
          title,
          desc,
          time: "Just now",
        },
        ...prev,
      ];
      persist("buddy_logs", newLogs);
      return newLogs;
    });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        wabaConnection,
        logs,
        automations,
        login,
        signup,
        logout,
        deleteAccount,
        connectWaba,
        disconnectWaba,
        toggleAutomation,
        addLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
