import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Proxy to backend FastAPI for authentication
    const response = await fetch("http://backend:8001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const data = await response.json()

    // Create response with user data and token
    const nextResponse = NextResponse.json({
      user: data.user,
      token: data.token,
    })

    // Set the backend token as a cookie so it can be used for subsequent requests
    nextResponse.cookies.set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    })

    return nextResponse
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
