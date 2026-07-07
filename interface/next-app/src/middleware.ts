import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authFlag = request.cookies.get("buddy_auth_flag")?.value

  if (pathname.startsWith("/dashboard")) {
    if (!authFlag) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      )
    }
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (authFlag) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
