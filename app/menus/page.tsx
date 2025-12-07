"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"

interface Restaurant {
  id: string
  name: string
  country: string
  description: string
}

interface MenuItem {
  id: string
  restaurantId: string
  name: string
  price: number
  description: string
}

interface CartItem {
  id: string
  menuId: string
  name: string
  quantity: number
  price: number
  restaurantId: string
}

export default function MenusPage() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurantId")
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantAndMenus()
    }
    fetchCart()
  }, [restaurantId])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        console.log("Menus: Cart data received:", data)
        if (Array.isArray(data)) {
          setCart(data)
          console.log("Menus: Cart updated:", data.length, "items")
          // Auto-show cart if it has items
          if (data.length > 0) {
            setShowCart(true)
          }
        }
      } else {
        console.error("Menus: Failed to fetch cart:", response.status)
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    }
  }

  const fetchRestaurantAndMenus = async () => {
    try {
      // Fetch all restaurants to find the current one
      const restaurantsResponse = await fetch("/api/restaurants")
      if (restaurantsResponse.ok) {
        const restaurants = await restaurantsResponse.json()
        const currentRestaurant = restaurants.find((r: Restaurant) => r.id === restaurantId)
        if (currentRestaurant) {
          setRestaurant(currentRestaurant)
        }
      }

      // Fetch menus for this restaurant
      const menusResponse = await fetch(`/api/menus?restaurantId=${restaurantId}`)
      if (menusResponse.ok) {
        const data = await menusResponse.json()
        if (Array.isArray(data)) {
          setMenus(data)
        }
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setLoading(false)
    }
  }

  const toggleDescription = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId)
  }

  const addToCart = async (item: MenuItem) => {
    try {
      console.log("Menus: Adding to cart:", item)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuId: item.id,
          quantity: 1,
          price: item.price,
          restaurantId: item.restaurantId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Menus: Item added to cart:", result)
        await fetchCart() // Refresh cart
        setShowCart(true) // Show cart sidebar
      } else {
        const error = await response.json()
        console.error("Menus: Add to cart failed:", error)
        alert(error.error || "Failed to add item to cart")
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      alert("Failed to add item to cart")
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart?itemId=${cartItemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCart() // Refresh cart
      } else {
        const error = await response.json()
        alert(error.error || "Failed to remove item from cart")
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error)
      alert("Failed to remove item from cart")
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleViewCart = () => {
    window.location.href = "/restaurants"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading menu...</div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">Restaurant not found</p>
            <a href="/restaurants" className="text-primary hover:underline mt-4 inline-block">
              Back to Restaurants
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Restaurant Header */}
        <div className="mb-8">
          <a 
            href="/restaurants" 
            className="text-primary hover:underline mb-4 inline-flex items-center"
          >
            ← Back to Restaurants
          </a>
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-8 mt-4">
            <h1 className="text-4xl font-bold text-foreground mb-2">{restaurant.name}</h1>
            <p className="text-lg text-muted-foreground mb-2">{restaurant.description}</p>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold">
              📍 {restaurant.country}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Menu Items</h2>
        </div>

        {menus.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">No menu items available for this restaurant</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div 
                key={menu.id} 
                className="bg-card border border-border rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-foreground">{menu.name}</h3>
                    <span className="text-2xl font-bold text-primary ml-2">
                      ${menu.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p 
                      className={`text-muted-foreground text-sm transition-all ${
                        expandedMenu === menu.id ? "" : "line-clamp-2"
                      }`}
                    >
                      {menu.description}
                    </p>
                    {menu.description && menu.description.length > 80 && (
                      <button
                        onClick={() => toggleDescription(menu.id)}
                        className="text-primary hover:text-primary/80 text-sm font-semibold mt-2"
                      >
                        {expandedMenu === menu.id ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(menu)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Sidebar */}
        {showCart && cart.length > 0 && (
          <div className="fixed right-0 top-0 h-screen w-80 bg-card border-l border-border shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">Shopping Cart</h3>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-destructive hover:text-destructive/80 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-foreground">Total:</span>
                  <span className="text-xl font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
                </div>

                <button
                  onClick={handleViewCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Go to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Toggle Button (floating) */}
        {cart.length > 0 && (
          <button
            onClick={() => setShowCart(!showCart)}
            className="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-6 rounded-full shadow-2xl z-40 flex items-center gap-2"
          >
            🛒 Cart ({cart.length})
          </button>
        )}
      </div>
    </div>
  )
}
