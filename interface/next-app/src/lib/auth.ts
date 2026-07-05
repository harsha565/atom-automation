export const setTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  localStorage.setItem("buddy_access_token", accessToken)
  localStorage.setItem("buddy_refresh_token", refreshToken)
  document.cookie = "buddy_auth_flag=true; path=/"
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem("buddy_access_token")
}

export const clearTokens = (): void => {
  localStorage.removeItem("buddy_access_token")
  localStorage.removeItem("buddy_refresh_token")
  localStorage.removeItem("buddy_user")
  localStorage.removeItem("buddy_auth")
  document.cookie =
    "buddy_auth_flag=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
}

export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}
