import api from "@/lib/api"

export interface WhatsAppStatus {
  connected: boolean
  status: "CONNECTED" | "PENDING" | "DISCONNECTED"
  phone_number: string
  connected_at?: string
  last_checked_at?: string
}

export interface AutomationStatus {
  configured: boolean
  membership_reminder_enabled: boolean
  rag_bot_enabled: boolean
  last_activation_status: string | null
  last_activation_at: string | null
}

export const whatsappService = {
  async connect(
    authorizationCode: string,
    businessId?: string,
    wabaId?: string,
    phoneNumberId?: string
  ) {
    const payload: any = {
      authorization_code: authorizationCode,
    }
    if (businessId) payload.business_id = businessId
    if (wabaId) payload.waba_id = wabaId
    if (phoneNumberId) payload.phone_number_id = phoneNumberId

    const res = await api.post("/api/v1/whatsapp/connect", payload)
    return res.data
  },

  async getStatus(): Promise<WhatsAppStatus> {
    const res = await api.get("/api/v1/whatsapp/status")
    return res.data.data
  },

  async disconnect() {
    const res = await api.post("/api/v1/whatsapp/disconnect")
    return res.data
  },

  async getAutomationStatus(): Promise<AutomationStatus> {
    const res = await api.get("/api/v1/automations/status")
    return res.data.data
  },

  async activateAutomation() {
    const res = await api.post("/api/v1/automations/activate")
    return res.data
  },
}
