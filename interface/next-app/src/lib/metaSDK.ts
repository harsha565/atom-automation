declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}

let sdkPromise: Promise<void> | null = null
let isInitialized = false

export const loadMetaSDK = (appId: string): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve()
  if (isInitialized) return Promise.resolve()
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const initialize = () => {
      try {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: "v25.0",
        })
        isInitialized = true
        resolve()
      } catch (err) {
        reject(err)
      }
    }

    if (window.FB) {
      initialize()
      return
    }

    window.fbAsyncInit = () => {
      initialize()
    }

    const scriptId = "facebook-jssdk"
    if (document.getElementById(scriptId)) {
      if (window.FB) {
        initialize()
      }
      return
    }

    const script = document.createElement("script")
    script.id = scriptId
    script.src = "https://connect.facebook.net/en_US/sdk.js"
    script.async = true
    script.defer = true
    script.crossOrigin = "anonymous"
    script.onerror = () => {
      sdkPromise = null
      reject(new Error("Failed to load Meta SDK"))
    }

    const first = document.getElementsByTagName("script")[0]
    if (first?.parentNode) {
      first.parentNode.insertBefore(script, first)
    } else {
      document.head.appendChild(script)
    }
  })

  return sdkPromise
}

export const launchEmbeddedSignup = (
  configId: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.location.protocol !== "https:") {
      reject(
        new Error(
          "Meta Login requires HTTPS. Please run the application using 'npm run dev-https' and access it via https://localhost:3000."
        )
      )
      return
    }

    if (!window.FB) {
      reject(new Error("Meta SDK not loaded"))
      return
    }

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== "https://www.facebook.com") return
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data
        if (data?.type === "WA_EMBEDDED_SIGNUP") {
          console.log("Meta session info received:", data)
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener("message", messageListener)

    try {
      window.FB.login(
        (response: any) => {
          window.removeEventListener("message", messageListener)
          if (response?.authResponse?.code) {
            resolve(response.authResponse.code)
          } else {
            reject(new Error("User cancelled or did not authorize"))
          }
        },
        {
          config_id: configId,
          response_type: "code",
          override_default_response_type: true,
          scope:
            "whatsapp_business_management,whatsapp_business_messaging",
          extras: {
            version: "v4",
            sessionInfoVersion: "3",
            feature: "whatsapp_embedded_signup",
          },
        }
      )
    } catch (e: any) {
      window.removeEventListener("message", messageListener)
      reject(e)
    }
  })
}
