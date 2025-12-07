import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Proxy to backend FastAPI
    const response = await fetch("http://backend:8001/api/cart", {
      method: "GET",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
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
    const response = await fetch("http://backend:8001/api/cart", {
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
    console.error("Add to cart API error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get itemId from query parameter
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "itemId is required" }, { status: 400 })
    }

    // Proxy to backend FastAPI with query parameter
    const response = await fetch(`http://backend:8001/api/cart?itemId=${itemId}`, {
      method: "DELETE",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Remove from cart API error:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Clear cart
    const response = await fetch("http://backend:8001/api/cart/clear", {
      method: "POST",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Clear cart API error:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
