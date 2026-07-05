import axios from "axios"

const api = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
})

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("buddy_access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor — handle 401, token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isAuthRequest = original.url?.includes("/auth/login") || original.url?.includes("/auth/register")
    if (error.response?.status === 401 && !isAuthRequest && !original._retry) {
      original._retry = true
      try {
        const refreshToken = localStorage.getItem("buddy_refresh_token")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }
        const res = await axios.post(
          "/api/v1/auth/refresh",
          { refresh_token: refreshToken }
        )
        const newToken = res.data.data.access_token
        localStorage.setItem("buddy_access_token", newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (err) {
        localStorage.removeItem("buddy_access_token")
        localStorage.removeItem("buddy_refresh_token")
        localStorage.removeItem("buddy_user")
        localStorage.removeItem("buddy_auth")
        document.cookie =
          "buddy_auth_flag=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api
