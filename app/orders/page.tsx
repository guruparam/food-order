"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"

interface Order {
  id: string
  userId: string
  restaurantId: string
  totalAmount: number
  items: { itemId: string; name: string; qty: number }[]
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<{ role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) {
        console.log("Not authorized to view orders")
        setOrders([])
        setLoading(false)
        // Redirect to login if unauthorized
        if (response.status === 401) {
          window.location.href = "/login"
        }
        return
      }
      const data = await response.json()
      console.log("Orders data:", data)
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        console.log("First order ID:", data[0]?.id)
        setOrders(data)
      } else {
        setOrders([])
      }
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      setOrders([])
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      })

      if (response.ok) {
        alert("Order cancelled successfully")
        fetchOrders()
      }
    } catch (error) {
      console.error("Failed to cancel order:", error)
    }
  }

  if (user?.role === "member") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-8 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-lg">Members cannot view orders. Please contact your manager.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-foreground">Loading orders...</div></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-lg shadow p-8 text-center">
            <p className="text-muted-foreground text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="text-lg font-bold text-foreground">{order.id}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded font-bold ${
                      order.status === "confirmed" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Restaurant ID</p>
                    <p className="font-semibold text-foreground">{order.restaurantId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-primary">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-bold text-foreground mb-3">Items:</p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.itemId} className="flex justify-between text-foreground">
                        <span>
                          {item.name} x {item.qty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === "confirmed" && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
