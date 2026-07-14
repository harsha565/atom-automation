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

export interface EmbeddedSignupSession {
  business_id?: string
  waba_id?: string
  phone_number_id?: string
}

let latestSession: EmbeddedSignupSession | null = null

export const getLatestEmbeddedSignupSession = (): EmbeddedSignupSession | null => {
  return latestSession
}

export const clearLatestEmbeddedSignupSession = (): void => {
  latestSession = null
}

if (typeof window !== "undefined") {
  window.addEventListener("message", (event: MessageEvent) => {
    if (event.origin !== "https://www.facebook.com") return
    try {
      const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data
      if (data?.type === "WA_EMBEDDED_SIGNUP") {
        const eventType = data?.event
        const eventData = data?.data
        
        if (eventType === "FINISH") {
          const business_id = eventData?.business_id
          const waba_id = eventData?.waba_id || (eventData?.waba_ids && eventData?.waba_ids[0])
          const phone_number_id = eventData?.phone_number_id || (eventData?.phone_number_ids && eventData?.phone_number_ids[0])
          
          latestSession = {
            business_id,
            waba_id,
            phone_number_id,
          }
          console.log("Embedded Signup FINISH:", latestSession)
        } else if (eventType === "CANCEL") {
          console.log("Embedded Signup CANCEL")
        } else if (eventType === "ERROR") {
          console.error("Embedded Signup ERROR:", eventData)
        }
      }
    } catch {
      // ignore
    }
  })
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

    try {
      window.FB.login(
        (response: any) => {
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
            featureType: "whatsapp_business_app_onboarding",
          },
        }
      )
    } catch (e: any) {
      reject(e)
    }
  })
}
