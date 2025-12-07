import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Proxy to backend FastAPI
    const response = await fetch("http://backend:8001/api/payment-methods", {
      method: "GET",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Payment methods API error:", error)
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Proxy to backend FastAPI
    const response = await fetch("http://backend:8001/api/payment-methods", {
      method: "POST",
      headers: {
        Cookie: `auth_token=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Create payment method API error:", error)
    return NextResponse.json({ error: "Failed to create payment method" }, { status: 500 })
  }
}
