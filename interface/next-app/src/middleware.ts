import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authFlag = request.cookies.get("buddy_auth_flag")?.value

  // Protect all dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!authFlag) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect logged-in users away from login/signup
  if (pathname === "/login" || pathname === "/signup") {
    if (authFlag) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
