"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

interface User {
  name: string
  role: string
  country: string
}

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="bg-gradient-to-r from-primary via-primary to-orange-600 text-primary-foreground shadow-lg border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div onClick={() => router.push("/dashboard")} className="cursor-pointer font-bold text-2xl tracking-tight flex items-center gap-2">
              <span className="text-white">Slooze</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => router.push("/restaurants")} 
                className="hover:text-white/80 transition-colors font-medium"
              >
                Restaurants
              </button>
              {user?.role !== "member" && (
                <button 
                  onClick={() => router.push("/orders")} 
                  className="hover:text-white/80 transition-colors font-medium"
                >
                  Orders
                </button>
              )}
              {user?.role === "admin" && (
                <button 
                  onClick={() => router.push("/payment-methods")} 
                  className="hover:text-white/80 transition-colors font-medium"
                >
                  Payments
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-white" />
                ) : (
                  <Moon className="h-5 w-5 text-white" />
                )}
              </button>
            )}

            {user && (
              <>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-white/80">
                    {user.role.toUpperCase()} • {user.country}
                  </p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="bg-[#919191] hover:bg-red-600 px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
