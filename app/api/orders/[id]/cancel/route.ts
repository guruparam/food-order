import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // In Next.js 15+, params is a Promise
  const { id: orderId } = await params

  console.log("Cancel order - Order ID:", orderId)

  try {
    // Proxy to backend FastAPI
    const response = await fetch(`http://backend:8001/api/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to cancel order:", error)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
