import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const restaurantId = request.nextUrl.searchParams.get("restaurantId")
    const url = restaurantId 
      ? `http://backend:8001/api/menus?restaurantId=${restaurantId}`
      : "http://backend:8001/api/menus"

    // Proxy to backend FastAPI
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Menus API error:", error)
    return NextResponse.json({ error: "Failed to fetch menus" }, { status: 500 })
  }
}
