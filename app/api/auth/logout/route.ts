import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (token) {
    try {
      // Proxy to backend FastAPI to clear the session
      await fetch("http://backend:8001/api/auth/logout", {
        method: "POST",
        headers: {
          Cookie: `auth_token=${token}`,
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const response = NextResponse.json({ success: true })
  response.cookies.delete("auth_token")
  return response
}
