import api from "@/lib/api"

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  gym_name: string
  owner_name: string
}

export const authService = {
  async login(payload: LoginPayload) {
    const res = await api.post("/api/v1/auth/login", payload)
    return res.data.data
    // returns { access_token, refresh_token, user }
  },

  async register(payload: RegisterPayload) {
    const res = await api.post("/api/v1/auth/register", payload)
    return res.data.data
    // returns { access_token, refresh_token, user }
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem("buddy_refresh_token")
      await api.post("/api/v1/auth/logout", {
        refresh_token: refreshToken || "",
      })
    } catch {
      // Always clear tokens regardless
    }
  },

  async logoutWithToken(refreshToken: string) {
    try {
      await api.post("/api/v1/auth/logout", {
        refresh_token: refreshToken,
      })
    } catch {
      // Always clear regardless
    }
  },

  async getGym() {
    const res = await api.get("/api/v1/gym")
    return res.data.data
  },

  async deleteAccount() {
    const res = await api.delete("/api/v1/auth/account")
    return res.data
  },
}
