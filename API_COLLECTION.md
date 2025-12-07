# Slooze V2 - API Collection (Postman/Insomnia/cURL)

## Overview
This document provides ready-to-use API requests for testing all endpoints in the Slooze V2 system. Use these with Postman, Insomnia, cURL, or PowerShell.

---

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Restaurant Endpoints](#restaurant-endpoints)
4. [Menu Endpoints](#menu-endpoints)
5. [Shopping Cart Endpoints](#shopping-cart-endpoints)
6. [Order Endpoints](#order-endpoints)
7. [Payment Method Endpoints](#payment-method-endpoints)
8. [Postman Collection JSON](#postman-collection-json)

---

## Setup Instructions

### Base URL
```
http://localhost:8001
```

### Authentication
All endpoints (except login) require authentication via `auth_token` cookie.

**Steps:**
1. Call `POST /api/auth/login` to get token
2. Store token in cookie for subsequent requests
3. Include cookie in all requests

---

## Authentication Endpoints

### 1. Login (Admin)

**cURL:**
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nickfury@admin.com",
    "password": "admin123"
  }' \
  -c cookies.txt
```

**PowerShell:**
```powershell
$response = Invoke-RestMethod -Uri 'http://localhost:8001/api/auth/login' `
  -Method POST `
  -Body (@{
    email = 'nickfury@admin.com'
    password = 'admin123'
  } | ConvertTo-Json) `
  -ContentType 'application/json' `
  -SessionVariable session

# Save session for later
$global:session = $session

# Display user info
$response.user
```

**Request Body:**
```json
{
  "email": "nickfury@admin.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "nickfury@admin.com",
    "name": "Nick Fury",
    "role": "admin",
    "country": "USA"
  },
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

---

### 2. Login (Manager - India)

**Request Body:**
```json
{
  "email": "captainmarvel@manager.com",
  "password": "manager123"
}
```

**PowerShell:**
```powershell
$response = Invoke-RestMethod -Uri 'http://localhost:8001/api/auth/login' `
  -Method POST `
  -Body (@{
    email = 'captainmarvel@manager.com'
    password = 'manager123'
  } | ConvertTo-Json) `
  -ContentType 'application/json' `
  -SessionVariable session
```

---

### 3. Login (Manager - USA)

**Request Body:**
```json
{
  "email": "captainamerica@manager.com",
  "password": "manager123"
}
```

---

### 4. Login (Member - India)

**Request Body:**
```json
{
  "email": "thanos@member.com",
  "password": "member123"
}
```

---

### 5. Login (Member - India)

**Request Body:**
```json
{
  "email": "thor@member.com",
  "password": "member123"
}
```

---

### 6. Login (Member - USA)

**Request Body:**
```json
{
  "email": "travis@member.com",
  "password": "member123"
}
```

---

### 7. Logout

**cURL:**
```bash
curl -X POST http://localhost:8001/api/auth/logout \
  -b cookies.txt
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri 'http://localhost:8001/api/auth/logout' `
  -Method POST `
  -WebSession $session
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## Restaurant Endpoints

### 8. Get All Restaurants (Admin)

**cURL:**
```bash
curl -X GET http://localhost:8001/api/restaurants \
  -b cookies.txt
```

**PowerShell:**
```powershell
$restaurants = Invoke-RestMethod -Uri 'http://localhost:8001/api/restaurants' `
  -WebSession $session

# Display count and names
Write-Host "Total: $($restaurants.Count)"
$restaurants | Select-Object name, country
```

**Response (200 OK):**
```json
[
  {
    "id": "rest-001-uuid",
    "name": "Mumbai Masala",
    "country": "India",
    "description": "Authentic Indian cuisine with aromatic spices"
  },
  {
    "id": "rest-002-uuid",
    "name": "New York Pizza",
    "country": "USA",
    "description": "New York style pizza with fresh toppings"
  },
  {
    "id": "rest-010-uuid",
    "name": "London Fish & Chips",
    "country": "UK",
    "description": "Traditional British fish and chips"
  }
  // ... 10 total restaurants
]
```

---

### 9. Get Restaurants by Country (Admin with Filter)

**cURL:**
```bash
curl -X GET "http://localhost:8001/api/restaurants?country=India" \
  -b cookies.txt
```

**PowerShell:**
```powershell
$restaurants = Invoke-RestMethod -Uri 'http://localhost:8001/api/restaurants?country=India' `
  -WebSession $session
```

**Response (200 OK):**
```json
[
  {
    "id": "rest-001-uuid",
    "name": "Mumbai Masala",
    "country": "India",
    "description": "Authentic Indian cuisine with aromatic spices"
  },
  {
    "id": "rest-002-uuid",
    "name": "Delhi Delights",
    "country": "India",
    "description": "North Indian delicacies"
  },
  {
    "id": "rest-003-uuid",
    "name": "Bangalore Bistro",
    "country": "India",
    "description": "South Indian fusion food"
  },
  {
    "id": "rest-004-uuid",
    "name": "Kolkata Kitchen",
    "country": "India",
    "description": "Bengali street food favorites"
  }
]
```

---

### 10. Get Restaurants (Manager - Auto-Filtered by Country)

**PowerShell (India Manager):**
```powershell
# Login as India manager
$response = Invoke-RestMethod -Uri 'http://localhost:8001/api/auth/login' `
  -Method POST `
  -Body (@{email='captainmarvel@manager.com'; password='manager123'} | ConvertTo-Json) `
  -ContentType 'application/json' `
  -SessionVariable session

# Get restaurants (automatically filtered to India)
$restaurants = Invoke-RestMethod -Uri 'http://localhost:8001/api/restaurants' `
  -WebSession $session

# Will only see India restaurants (4 total)
$restaurants | Select-Object name, country
```

---

## Menu Endpoints

### 11. Get All Menus (Admin)

**cURL:**
```bash
curl -X GET http://localhost:8001/api/menus \
  -b cookies.txt
```

**PowerShell:**
```powershell
$menus = Invoke-RestMethod -Uri 'http://localhost:8001/api/menus' `
  -WebSession $session

# Display count
Write-Host "Total menus: $($menus.Count)"
$menus | Select-Object name, price, restaurantId | Format-Table
```

**Response (200 OK):**
```json
[
  {
    "id": "menu-001-uuid",
    "restaurantId": "rest-001-uuid",
    "name": "Butter Chicken",
    "price": 320.00,
    "description": "Creamy tomato-based chicken curry"
  },
  {
    "id": "menu-002-uuid",
    "restaurantId": "rest-001-uuid",
    "name": "Paneer Tikka",
    "price": 280.00,
    "description": "Grilled cottage cheese with spices"
  }
  // ... 45 total menu items
]
```

---

### 12. Get Menus by Restaurant ID

**cURL:**
```bash
curl -X GET "http://localhost:8001/api/menus?restaurantId=rest-001-uuid" \
  -b cookies.txt
```

**PowerShell:**
```powershell
# Get first restaurant
$restaurants = Invoke-RestMethod -Uri 'http://localhost:8001/api/restaurants' `
  -WebSession $session
$firstRestaurant = $restaurants[0]

# Get menus for that restaurant
$menus = Invoke-RestMethod -Uri "http://localhost:8001/api/menus?restaurantId=$($firstRestaurant.id)" `
  -WebSession $session

Write-Host "Menus for $($firstRestaurant.name):"
$menus | Select-Object name, price
```

**Response (200 OK):**
```json
[
  {
    "id": "menu-001-uuid",
    "restaurantId": "rest-001-uuid",
    "name": "Butter Chicken",
    "price": 320.00,
    "description": "Creamy tomato-based chicken curry"
  },
  {
    "id": "menu-002-uuid",
    "restaurantId": "rest-001-uuid",
    "name": "Paneer Tikka",
    "price": 280.00,
    "description": "Grilled cottage cheese with spices"
  },
  {
    "id": "menu-003-uuid",
    "restaurantId": "rest-001-uuid",
    "name": "Garlic Naan",
    "price": 60.00,
    "description": "Soft flatbread with garlic"
  },
  {
    "id": "menu-004-uuid",
    "restaurantId": "rest-001-uuid",
    "name": "Biryani",
    "price": 350.00,
    "description": "Fragrant rice with spices and meat"
  }
]
```

---

## Shopping Cart Endpoints

### 13. Add Item to Cart

**cURL:**
```bash
curl -X POST http://localhost:8001/api/cart \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "menuId": "menu-001-uuid",
    "quantity": 2,
    "price": 320.00,
    "restaurantId": "rest-001-uuid"
  }'
```

**PowerShell:**
```powershell
$cartItem = Invoke-RestMethod -Uri 'http://localhost:8001/api/cart' `
  -Method POST `
  -Body (@{
    menuId = 'menu-001-uuid'
    quantity = 2
    price = 320.00
    restaurantId = 'rest-001-uuid'
  } | ConvertTo-Json) `
  -ContentType 'application/json' `
  -WebSession $session
```

**Request Body:**
```json
{
  "menuId": "menu-001-uuid",
  "quantity": 2,
  "price": 320.00,
  "restaurantId": "rest-001-uuid"
}
```

**Response (200 OK):**
```json
{
  "id": "cart-001-uuid",
  "menuId": "menu-001-uuid",
  "name": "Butter Chicken",
  "quantity": 2,
  "price": 320.00,
  "restaurantId": "rest-001-uuid"
}
```

**Error Response (403 Forbidden - Cross-country attempt):**
```json
{
  "detail": "Cannot add items from other countries"
}
```

---

### 14. Get Cart Items

**cURL:**
```bash
curl -X GET http://localhost:8001/api/cart \
  -b cookies.txt
```

**PowerShell:**
```powershell
$cart = Invoke-RestMethod -Uri 'http://localhost:8001/api/cart' `
  -WebSession $session

# Display cart
Write-Host "Cart Items: $($cart.Count)"
$cart | Select-Object name, quantity, price | Format-Table
```

**Response (200 OK):**
```json
[
  {
    "id": "cart-001-uuid",
    "menuId": "menu-001-uuid",
    "name": "Butter Chicken",
    "quantity": 2,
    "price": 320.00,
    "restaurantId": "rest-001-uuid"
  },
  {
    "id": "cart-002-uuid",
    "menuId": "menu-003-uuid",
    "name": "Garlic Naan",
    "quantity": 3,
    "price": 60.00,
    "restaurantId": "rest-001-uuid"
  }
]
```

---

### 15. Remove Item from Cart

**cURL:**
```bash
curl -X DELETE "http://localhost:8001/api/cart?itemId=cart-001-uuid" \
  -b cookies.txt
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri 'http://localhost:8001/api/cart?itemId=cart-001-uuid' `
  -Method DELETE `
  -WebSession $session
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

### 16. Clear Entire Cart

**cURL:**
```bash
curl -X POST http://localhost:8001/api/cart/clear \
  -b cookies.txt
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri 'http://localhost:8001/api/cart/clear' `
  -Method POST `
  -WebSession $session
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## Order Endpoints

### 17. Create Order

**cURL:**
```bash
curl -X POST http://localhost:8001/api/orders \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "restaurantId": "rest-001-uuid",
    "items": [
      {
        "menuId": "menu-001-uuid",
        "quantity": 2,
        "price": 320.00
      },
      {
        "menuId": "menu-003-uuid",
        "quantity": 3,
        "price": 60.00
      }
    ],
    "totalAmount": 820.00
  }'
```

**PowerShell (Complete Flow):**
```powershell
# Get restaurants and menus
$restaurants = Invoke-RestMethod -Uri 'http://localhost:8001/api/restaurants' -WebSession $session
$menus = Invoke-RestMethod -Uri 'http://localhost:8001/api/menus' -WebSession $session

# Create order
$orderData = @{
  restaurantId = $restaurants[0].id
  items = @(
    @{
      menuId = $menus[0].id
      quantity = 2
      price = $menus[0].price
    },
    @{
      menuId = $menus[1].id
      quantity = 1
      price = $menus[1].price
    }
  )
  totalAmount = ($menus[0].price * 2) + $menus[1].price
} | ConvertTo-Json -Depth 3

$order = Invoke-RestMethod -Uri 'http://localhost:8001/api/orders' `
  -Method POST `
  -Body $orderData `
  -ContentType 'application/json' `
  -WebSession $session

Write-Host "Order created: $($order.id)"
```

**Request Body:**
```json
{
  "restaurantId": "rest-001-uuid",
  "items": [
    {
      "menuId": "menu-001-uuid",
      "quantity": 2,
      "price": 320.00
    },
    {
      "menuId": "menu-003-uuid",
      "quantity": 3,
      "price": 60.00
    }
  ],
  "totalAmount": 820.00
}
```

**Response (200 OK):**
```json
{
  "id": "order-001-uuid",
  "userId": "user-001-uuid",
  "restaurantId": "rest-001-uuid",
  "totalAmount": 820.00,
  "status": "pending",
  "createdAt": "2025-12-06T10:30:00Z"
}
```

**Error Response (403 Forbidden - Member attempting checkout):**
```json
{
  "detail": "Members cannot place orders"
}
```

**Error Response (403 Forbidden - Cross-country attempt):**
```json
{
  "detail": "Cannot order from restaurants in other countries"
}
```

---

### 18. Get All Orders

**cURL:**
```bash
curl -X GET http://localhost:8001/api/orders \
  -b cookies.txt
```

**PowerShell:**
```powershell
$orders = Invoke-RestMethod -Uri 'http://localhost:8001/api/orders' `
  -WebSession $session

Write-Host "Total orders: $($orders.Count)"
$orders | Select-Object @{N='OrderID';E={$_.id.Substring(0,8)}}, status, totalAmount, createdAt | Format-Table
```

**Response (200 OK):**
```json
[
  {
    "id": "order-001-uuid",
    "userId": "user-001-uuid",
    "restaurantId": "rest-001-uuid",
    "totalAmount": 820.00,
    "status": "pending",
    "createdAt": "2025-12-06T10:30:00Z",
    "items": [
      {
        "menuId": "menu-001-uuid",
        "menuName": "Butter Chicken",
        "quantity": 2,
        "price": 320.00
      },
      {
        "menuId": "menu-003-uuid",
        "menuName": "Garlic Naan",
        "quantity": 3,
        "price": 60.00
      }
    ]
  }
]
```

---

### 19. Cancel Order

**cURL:**
```bash
curl -X POST http://localhost:8001/api/orders/order-001-uuid/cancel \
  -b cookies.txt
```

**PowerShell:**
```powershell
$cancelledOrder = Invoke-RestMethod -Uri "http://localhost:8001/api/orders/$($order.id)/cancel" `
  -Method POST `
  -WebSession $session

Write-Host "Order cancelled. Status: $($cancelledOrder.status)"
```

**Response (200 OK):**
```json
{
  "id": "order-001-uuid",
  "userId": "user-001-uuid",
  "restaurantId": "rest-001-uuid",
  "totalAmount": 820.00,
  "status": "cancelled",
  "createdAt": "2025-12-06T10:30:00Z"
}
```

**Error Response (403 Forbidden - Cross-country attempt):**
```json
{
  "detail": "Cannot cancel orders from other countries"
}
```

---

## Payment Method Endpoints

### 20. Get Payment Methods

**cURL:**
```bash
curl -X GET http://localhost:8001/api/payment-methods \
  -b cookies.txt
```

**PowerShell:**
```powershell
$paymentMethods = Invoke-RestMethod -Uri 'http://localhost:8001/api/payment-methods' `
  -WebSession $session

$paymentMethods | Select-Object type, cardLast4 | Format-Table
```

**Response (200 OK):**
```json
[
  {
    "id": "payment-001-uuid",
    "userId": "user-001-uuid",
    "cardLast4": "1234",
    "type": "credit"
  },
  {
    "id": "payment-002-uuid",
    "userId": "user-001-uuid",
    "cardLast4": "5678",
    "type": "debit"
  }
]
```

---

### 21. Add Payment Method (Admin Only)

**cURL:**
```bash
curl -X POST http://localhost:8001/api/payment-methods \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "userId": "user-001-uuid",
    "cardLast4": "9876",
    "type": "credit"
  }'
```

**PowerShell:**
```powershell
$paymentMethod = Invoke-RestMethod -Uri 'http://localhost:8001/api/payment-methods' `
  -Method POST `
  -Body (@{
    userId = 'user-001-uuid'
    cardLast4 = '9876'
    type = 'credit'
  } | ConvertTo-Json) `
  -ContentType 'application/json' `
  -WebSession $session
```

**Request Body:**
```json
{
  "userId": "user-001-uuid",
  "cardLast4": "9876",
  "type": "credit"
}
```

**Response (200 OK):**
```json
{
  "id": "payment-003-uuid",
  "userId": "user-001-uuid",
  "cardLast4": "9876",
  "type": "credit"
}
```

**Error Response (403 Forbidden - Non-admin attempt):**
```json
{
  "detail": "Only admins can add payment methods"
}
```

---

## Postman Collection JSON

Save this as `Slooze-V2-API.postman_collection.json`:

```json
{
  "info": {
    "name": "Slooze V2 API",
    "description": "Complete API collection for Slooze food ordering system",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login (Admin)",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"nickfury@admin.com\",\n  \"password\": \"admin123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Login (Manager - India)",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"captainmarvel@manager.com\",\n  \"password\": \"manager123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{baseUrl}}/api/auth/logout",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "logout"]
            }
          }
        }
      ]
    },
    {
      "name": "Restaurants",
      "item": [
        {
          "name": "Get All Restaurants",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/restaurants",
              "host": ["{{baseUrl}}"],
              "path": ["api", "restaurants"]
            }
          }
        },
        {
          "name": "Get Restaurants by Country",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/restaurants?country=India",
              "host": ["{{baseUrl}}"],
              "path": ["api", "restaurants"],
              "query": [{"key": "country", "value": "India"}]
            }
          }
        }
      ]
    },
    {
      "name": "Menus",
      "item": [
        {
          "name": "Get All Menus",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/menus",
              "host": ["{{baseUrl}}"],
              "path": ["api", "menus"]
            }
          }
        },
        {
          "name": "Get Menus by Restaurant",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/menus?restaurantId={{restaurantId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "menus"],
              "query": [{"key": "restaurantId", "value": "{{restaurantId}}"}]
            }
          }
        }
      ]
    },
    {
      "name": "Shopping Cart",
      "item": [
        {
          "name": "Add Item to Cart",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"menuId\": \"{{menuId}}\",\n  \"quantity\": 2,\n  \"price\": 320.00,\n  \"restaurantId\": \"{{restaurantId}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/cart",
              "host": ["{{baseUrl}}"],
              "path": ["api", "cart"]
            }
          }
        },
        {
          "name": "Get Cart Items",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/cart",
              "host": ["{{baseUrl}}"],
              "path": ["api", "cart"]
            }
          }
        },
        {
          "name": "Remove Cart Item",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/api/cart?itemId={{cartItemId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "cart"],
              "query": [{"key": "itemId", "value": "{{cartItemId}}"}]
            }
          }
        },
        {
          "name": "Clear Cart",
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{baseUrl}}/api/cart/clear",
              "host": ["{{baseUrl}}"],
              "path": ["api", "cart", "clear"]
            }
          }
        }
      ]
    },
    {
      "name": "Orders",
      "item": [
        {
          "name": "Create Order",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"restaurantId\": \"{{restaurantId}}\",\n  \"items\": [\n    {\n      \"menuId\": \"{{menuId}}\",\n      \"quantity\": 2,\n      \"price\": 320.00\n    }\n  ],\n  \"totalAmount\": 640.00\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/orders",
              "host": ["{{baseUrl}}"],
              "path": ["api", "orders"]
            }
          }
        },
        {
          "name": "Get Orders",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/orders",
              "host": ["{{baseUrl}}"],
              "path": ["api", "orders"]
            }
          }
        },
        {
          "name": "Cancel Order",
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{baseUrl}}/api/orders/{{orderId}}/cancel",
              "host": ["{{baseUrl}}"],
              "path": ["api", "orders", "{{orderId}}", "cancel"]
            }
          }
        }
      ]
    },
    {
      "name": "Payment Methods",
      "item": [
        {
          "name": "Get Payment Methods",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/payment-methods",
              "host": ["{{baseUrl}}"],
              "path": ["api", "payment-methods"]
            }
          }
        },
        {
          "name": "Add Payment Method",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"cardLast4\": \"1234\",\n  \"type\": \"credit\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/payment-methods",
              "host": ["{{baseUrl}}"],
              "path": ["api", "payment-methods"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8001",
      "type": "string"
    }
  ]
}
```

---

## Complete Test Script (PowerShell)

Save this as `test-api.ps1`:

```powershell
# Slooze V2 - Complete API Test Script

Write-Host "=== Slooze V2 API Test ===" -ForegroundColor Cyan

# 1. Login as Admin
Write-Host "`n1. Login as Admin..." -ForegroundColor Yellow
$login = Invoke-RestMethod -Uri 'http://localhost:8001/api/auth/login' `
  -Method POST `
  -Body (@{email='nickfury@admin.com'; password='admin123'} | ConvertTo-Json) `
  -ContentType 'application/json' `
  -SessionVariable session

Write-Host "   Logged in as: $($login.user.name) ($($login.user.role))" -ForegroundColor Green

# 2. Get Restaurants
Write-Host "`n2. Get Restaurants..." -ForegroundColor Yellow
$restaurants = Invoke-RestMethod -Uri 'http://localhost:8001/api/restaurants' -WebSession $session
Write-Host "   Found $($restaurants.Count) restaurants" -ForegroundColor Green

# 3. Get Menus
Write-Host "`n3. Get Menus..." -ForegroundColor Yellow
$menus = Invoke-RestMethod -Uri 'http://localhost:8001/api/menus' -WebSession $session
Write-Host "   Found $($menus.Count) menu items" -ForegroundColor Green

# 4. Add to Cart
Write-Host "`n4. Add to Cart..." -ForegroundColor Yellow
$cartItem = Invoke-RestMethod -Uri 'http://localhost:8001/api/cart' `
  -Method POST `
  -Body (@{
    menuId = $menus[0].id
    quantity = 2
    price = $menus[0].price
    restaurantId = $restaurants[0].id
  } | ConvertTo-Json) `
  -ContentType 'application/json' `
  -WebSession $session
Write-Host "   Added: $($menus[0].name) x2" -ForegroundColor Green

# 5. Get Cart
Write-Host "`n5. Get Cart..." -ForegroundColor Yellow
$cart = Invoke-RestMethod -Uri 'http://localhost:8001/api/cart' -WebSession $session
Write-Host "   Cart has $($cart.Count) items" -ForegroundColor Green

# 6. Create Order
Write-Host "`n6. Create Order..." -ForegroundColor Yellow
$orderData = @{
  restaurantId = $restaurants[0].id
  items = @(@{menuId=$menus[0].id; quantity=2; price=$menus[0].price})
  totalAmount = $menus[0].price * 2
} | ConvertTo-Json -Depth 3

$order = Invoke-RestMethod -Uri 'http://localhost:8001/api/orders' `
  -Method POST `
  -Body $orderData `
  -ContentType 'application/json' `
  -WebSession $session
Write-Host "   Order created: $($order.id.Substring(0,13))..." -ForegroundColor Green

# 7. Get Orders
Write-Host "`n7. Get Orders..." -ForegroundColor Yellow
$orders = Invoke-RestMethod -Uri 'http://localhost:8001/api/orders' -WebSession $session
Write-Host "   Found $($orders.Count) orders" -ForegroundColor Green

# 8. Cancel Order
Write-Host "`n8. Cancel Order..." -ForegroundColor Yellow
$cancelled = Invoke-RestMethod -Uri "http://localhost:8001/api/orders/$($order.id)/cancel" `
  -Method POST `
  -WebSession $session
Write-Host "   Order cancelled. Status: $($cancelled.status)" -ForegroundColor Green

# 9. Get Payment Methods
Write-Host "`n9. Get Payment Methods..." -ForegroundColor Yellow
$paymentMethods = Invoke-RestMethod -Uri 'http://localhost:8001/api/payment-methods' -WebSession $session
Write-Host "   Found $($paymentMethods.Count) payment methods" -ForegroundColor Green

Write-Host "`n=== All Tests Passed! ===" -ForegroundColor Green
```

---

## Environment Variables (Postman)

Add these to your Postman environment:

```json
{
  "name": "Slooze V2 Local",
  "values": [
    {"key": "baseUrl", "value": "http://localhost:8001", "enabled": true},
    {"key": "restaurantId", "value": "", "enabled": true},
    {"key": "menuId", "value": "", "enabled": true},
    {"key": "orderId", "value": "", "enabled": true},
    {"key": "cartItemId", "value": "", "enabled": true},
    {"key": "userId", "value": "", "enabled": true}
  ]
}
```

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Author:** Slooze Development Team
