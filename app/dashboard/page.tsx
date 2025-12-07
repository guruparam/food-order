"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"

interface User {
  name: string
  email: string
  role: string
  country: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20"
      case "manager":
        return "bg-primary/10 text-primary dark:text-primary border border-primary/20"
      case "member":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Welcome, {user.name}!</h1>
              <p className="text-muted-foreground mt-2">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full font-bold ${getRoleColor(user.role)}`}>
              {user.role.toUpperCase()}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
              <p className="text-muted-foreground text-sm font-semibold mb-2">EMAIL</p>
              <p className="text-xl font-bold text-foreground">{user.email}</p>
            </div>
            <div className="bg-green-500/5 p-6 rounded-lg border-l-4 border-green-500">
              <p className="text-muted-foreground text-sm font-semibold mb-2">COUNTRY</p>
              <p className="text-xl font-bold text-foreground">{user.country}</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="/restaurants"
                className="bg-primary hover:bg-primary/90 text-primary-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <p className="text-lg font-bold mb-2">Browse Restaurants</p>
                <p className="text-sm text-primary-foreground/80">View and order from restaurants</p>
              </a>

              {user.role !== "member" && (
                <a
                  href="/orders"
                  className="bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <p className="text-lg font-bold mb-2">Manage Orders</p>
                  <p className="text-sm text-white/80">View and cancel orders</p>
                </a>
              )}

              {user.role === "admin" && (
                <a
                  href="/payment-methods"
                  className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <p className="text-lg font-bold mb-2">Payment Methods</p>
                  <p className="text-sm text-white/80">Manage user payment methods</p>
                </a>
              )}

              {user.role !== "member" && user.role !== "admin" && (
                <a
                  href="/payment-methods"
                  className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <p className="text-lg font-bold mb-2">My Payment Methods</p>
                  <p className="text-sm text-white/80">View your payment methods</p>
                </a>
              )}
            </div>
          </div>

          {user.role === "member" && (
            <div className="mt-12 bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-300">
                <span className="font-bold">Member Restrictions:</span> You can browse restaurants and add items to
                cart, but cannot checkout or manage orders. Contact your manager for order placement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
