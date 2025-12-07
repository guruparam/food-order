"use client"

import { useState, useEffect } from "react"
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

interface PaymentMethod {
  id: string
  userId: string
  cardLast4: string
  type: string
}

interface CartItem {
  id: string
  menuId: string
  name: string
  quantity: number
  price: number
  restaurantId: string
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<{ role: string; country: string; id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [availableCountries, setAvailableCountries] = useState<string[]>([])

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const parsedUser = JSON.parse(userStr)
      setUser(parsedUser)
      // For admin, default to "all" to show all restaurants
      if (parsedUser.role === "admin") {
        setSelectedCountry("all")
      }
    }
    fetchPaymentMethods()
    fetchCart()
  }, [])

  useEffect(() => {
    if (user) {
      fetchRestaurants()
    }
  }, [user, selectedCountry])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        console.log("Cart data received:", data)
        if (Array.isArray(data)) {
          setCart(data)
          console.log("Cart updated:", data.length, "items")
        }
      } else {
        console.error("Failed to fetch cart:", response.status)
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/payment-methods")
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setPaymentMethods(data)
          // Auto-select first payment method if available
          if (data.length > 0) {
            setSelectedPaymentMethod(data[0].id)
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error)
    }
  }

  const fetchRestaurants = async () => {
    try {
      let url = "/api/restaurants"
      
      // For admin, first fetch all to get countries list, then apply filter if not "all"
      if (user?.role === "admin") {
        // Always fetch all restaurants first to populate country filter
        const allResponse = await fetch("/api/restaurants")
        if (allResponse.ok) {
          const allData = await allResponse.json()
          if (Array.isArray(allData)) {
            const countries = Array.from(new Set(allData.map((r: Restaurant) => r.country)))
            setAvailableCountries(countries.sort())
            
            // If a specific country is selected, filter the data
            if (selectedCountry && selectedCountry !== "all") {
              const filtered = allData.filter((r: Restaurant) => r.country === selectedCountry)
              setRestaurants(filtered)
            } else {
              // Show all restaurants
              setRestaurants(allData)
            }
            setLoading(false)
            return
          }
        }
      }
      
      // For managers/members, fetch only their country's restaurants
      const response = await fetch(url)
      const data = await response.json()
      
      // Check if response is an error or not an array
      if (!response.ok || !Array.isArray(data)) {
        console.error("Failed to fetch restaurants:", data)
        setRestaurants([])
        setLoading(false)
        // Redirect to login if unauthorized
        if (response.status === 401) {
          window.location.href = "/login"
        }
        return
      }
      
      setRestaurants(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch restaurants:", error)
      setRestaurants([])
      setLoading(false)
    }
  }

  const handleRestaurantSelect = async (restaurantId: string) => {
    setSelectedRestaurant(restaurantId)
    try {
      const response = await fetch(`/api/menus?restaurantId=${restaurantId}`)
      const data = await response.json()
      
      // Check if response is valid
      if (!response.ok || !Array.isArray(data)) {
        console.error("Failed to fetch menus:", data)
        setMenus([])
        return
      }
      
      setMenus(data)
    } catch (error) {
      console.error("Failed to fetch menus:", error)
      setMenus([])
    }
  }

  const addToCart = async (item: MenuItem) => {
    try {
      console.log("Adding to cart:", item)
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
        console.log("Item added to cart:", result)
        await fetchCart() // Refresh cart
      } else {
        const error = await response.json()
        console.error("Add to cart failed:", error)
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

  const openCheckoutModal = () => {
    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }

    if (user?.role === "member") {
      alert("Members cannot checkout. Please contact your manager.")
      return
    }

    if (paymentMethods.length === 0) {
      alert("No payment methods available. Please contact an admin to add a payment method.")
      return
    }

    setShowCheckoutModal(true)
  }

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method")
      return
    }

    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }

    // Get restaurant ID from first cart item
    const restaurantId = cart[0].restaurantId

    try {
      // Transform cart items to match backend expected format
      const orderItems = cart.map(item => ({
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.price
      }))

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          items: orderItems,
          totalAmount: getTotalPrice(),
          paymentMethodId: selectedPaymentMethod,
        }),
      })

      if (response.ok) {
        alert("Order placed and paid successfully!")
        // Clear cart on backend
        await fetch("/api/cart", { method: "PUT" })
        await fetchCart() // Refresh cart
        setSelectedRestaurant(null)
        setShowCheckoutModal(false)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to place order")
      }
    } catch (error) {
      console.error("Checkout failed:", error)
      alert("Failed to place order")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading restaurants...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Restaurants & Menus</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
              {user?.role === "admin" && selectedCountry !== "all" && ` in ${selectedCountry}`}
            </p>
          </div>
          
          {/* Country Filter for Admin */}
          {user?.role === "admin" && availableCountries.length > 0 && (
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <label htmlFor="country-filter" className="text-sm font-semibold text-foreground whitespace-nowrap">
                Filter:
              </label>
              <select
                id="country-filter"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-1.5 border border-border rounded-md bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
              >
                <option value="all">🌍 All Countries</option>
                {availableCountries.map((country) => (
                  <option key={country} value={country}>
                    {country === "India" ? "🇮🇳" : country === "USA" ? "🇺🇸" : country === "UK" ? "🇬🇧" : "🌏"} {country}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="grid gap-6">
              {restaurants.length === 0 ? (
                <p className="text-muted-foreground">No restaurants available.</p>
              ) : (
                restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-card border border-border rounded-xl shadow-md p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                  >
                    <h3 className="text-xl font-bold text-foreground">{restaurant.name}</h3>
                    <p className="text-muted-foreground mt-2">{restaurant.description}</p>
                    <p className="text-sm text-primary font-semibold mt-2">📍 {restaurant.country}</p>
                    
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleRestaurantSelect(restaurant.id)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-all"
                      >
                        Add to Cart
                      </button>
                      <a
                        href={`/menus?restaurantId=${restaurant.id}`}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-2 px-4 rounded-lg transition-all text-center"
                      >
                        View Menu
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedRestaurant && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Menu Items</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {menus.map((menu) => (
                    <div key={menu.id} className="bg-card border border-border rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-foreground">{menu.name}</h4>
                        <span className="text-lg font-bold text-primary">${menu.price.toFixed(2)}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{menu.description}</p>
                      <button
                        onClick={() => addToCart(menu)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-card border border-border rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Shopping Cart</h3>

              {cart.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
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

                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-foreground">Total:</span>
                      <span className="text-xl font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
                    </div>

                    <button
                      onClick={openCheckoutModal}
                      disabled={user?.role === "member"}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                    >
                      {user?.role === "member" ? "Members Can't Checkout" : "Proceed to Payment"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Complete Payment</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                    <span className="text-foreground font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-bold text-foreground">Total:</span>
                <span className="text-xl font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Select Payment Method</h3>
              {paymentMethods.length === 0 ? (
                <p className="text-muted-foreground text-sm">No payment methods available</p>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedPaymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{method.type}</p>
                        <p className="text-sm text-muted-foreground">**** **** **** {method.cardLast4}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3 px-4 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={!selectedPaymentMethod}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground text-white font-bold py-3 px-4 rounded-lg transition-all disabled:cursor-not-allowed"
              >
                Pay & Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
