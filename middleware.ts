import { type NextRequest, NextResponse } from "next/server"

// Note: Middleware runs in Edge Runtime which doesn't support Node.js crypto module
// Authentication is handled by API routes and client-side checks

export function middleware(request: NextRequest) {
  // Simple redirect for login page if user has token cookie
  const token = request.cookies.get("auth_token")?.value
  const pathname = request.nextUrl.pathname

  // Basic redirect: if on login page and has token cookie, go to dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
