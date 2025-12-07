"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"

interface PaymentMethod {
  id: string
  userId: string
  cardLast4: string
  type: string
}

interface User {
  id: string
  role: string
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    userId: "",
    cardLast4: "",
    type: "credit_card",
  })

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const userData = JSON.parse(userStr)
      setUser(userData)
      setFormData((prev) => ({ ...prev, userId: userData.id }))
    }
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/payment-methods")
      const data = await response.json()
      
      // Check if response is valid
      if (!response.ok || !Array.isArray(data)) {
        console.error("Failed to fetch payment methods:", data)
        setMethods([])
        setLoading(false)
        // Redirect to login if unauthorized
        if (response.status === 401) {
          window.location.href = "/login"
        }
        return
      }
      
      setMethods(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch payment methods:", error)
      setMethods([])
      setLoading(false)
    }
  }

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user?.role !== "admin") {
      alert("Only admins can add payment methods")
      return
    }

    try {
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Payment method added successfully")
        setShowForm(false)
        setFormData({ userId: user?.id || "", cardLast4: "", type: "credit_card" })
        fetchPaymentMethods()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add payment method")
      }
    } catch (error) {
      console.error("Failed to add payment method:", error)
      alert("Failed to add payment method")
    }
  }

  if (user?.role === "member") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-8 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-lg">Members cannot manage payment methods.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-foreground">Loading payment methods...</div></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
          {user?.role === "admin" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-all"
            >
              {showForm ? "Cancel" : "Add Payment Method"}
            </button>
          )}
        </div>

        {showForm && user?.role === "admin" && (
          <div className="bg-card border border-border rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleAddMethod} className="space-y-4">
              {user?.role === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">User ID</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last 4 Digits</label>
                <input
                  type="text"
                  maxLength={4}
                  value={formData.cardLast4}
                  onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Card Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Add Payment Method
              </button>
            </form>
          </div>
        )}

        {methods.length === 0 ? (
          <div className="bg-card border border-border rounded-lg shadow p-8 text-center">
            <p className="text-muted-foreground text-lg">No payment methods found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {methods.map((method) => (
              <div key={method.id} className="bg-card border border-border rounded-lg shadow p-6 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Card</p>
                    <p className="text-lg font-bold text-foreground">•••• {method.cardLast4}</p>
                    <p className="text-sm text-muted-foreground mt-2">{method.type.replace("_", " ").toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Method ID</p>
                    <p className="font-mono text-sm text-foreground">{method.id.substring(0, 8)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
