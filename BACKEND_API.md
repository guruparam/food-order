# Backend API Documentation

FastAPI Backend - Port 8001

## Base URL
`http://localhost:8001`

## Authentication
All endpoints (except login) require `auth_token` cookie.

---

## Endpoints

### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "nickfury@admin.com",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "nickfury@admin.com",
    "name": "Nick Fury",
    "role": "admin",
    "country": "USA"
  },
  "token": "64-char-hex-token"
}
```

---

### 2. Logout
```http
POST /api/auth/logout
Cookie: auth_token={token}
```

**Response 200:**
```json
{
  "success": true
}
```

---

### 3. Get Restaurants
```http
GET /api/restaurants?country={country}
Cookie: auth_token={token}
```

**Query Parameters:**
- `country` (optional): Filter by country (Admin only)
  - Example: `?country=India`
  - Omit for all restaurants

**Response 200:**
```json
[
  {
    "id": "uuid",
    "name": "Mumbai Masala",
    "country": "India",
    "description": "Authentic Indian Cuisine"
  }
]
```

**Country-Based Access Control:**
- **Admin:** All restaurants (can filter by country parameter)
- **Manager/Member:** Only restaurants from their country (parameter ignored)

---

### 4. Get Menus
```http
GET /api/menus?restaurantId={uuid}
Cookie: auth_token={token}
```

**Response 200:**
```json
[
  {
    "id": "uuid",
    "restaurantId": "uuid",
    "name": "Butter Chicken",
    "price": 320.0,
    "description": "Creamy tomato-based curry"
  }
]
```

**Filtering:**
- Admin: All menus
- Manager/Member: Only menus from restaurants in their country

---

### 5. Get Orders
```http
GET /api/orders
Cookie: auth_token={token}
```

**Response 200:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "restaurantId": "uuid",
    "totalAmount": 640.0,
    "status": "confirmed",
    "createdAt": "2025-12-06 10:00:00+00",
    "items": [
      {
        "itemId": "uuid",
        "name": "Butter Chicken",
        "qty": 2,
        "price": 320.0
      }
    ]
  }
]
```

**Response 403:** Members cannot view orders
```json
{
  "detail": "Members cannot view orders"
}
```

**Filtering:**
- Admin: All orders
- Manager: Only orders from their country

---

### 6. Create Order
```http
POST /api/orders
Content-Type: application/json
Cookie: auth_token={token}

{
  "restaurantId": "uuid",
  "items": [
    {
      "menuId": "uuid",
      "quantity": 2,
      "price": 320
    }
  ],
  "totalAmount": 640
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "restaurantId": "uuid",
  "totalAmount": 640.0,
  "status": "confirmed",
  "createdAt": "2025-12-06 10:00:00+00"
}
```

**Response 403:** Members cannot place orders
```json
{
  "detail": "Members cannot place orders"
}
```

**Response 403:** Managers cannot order from other countries
```json
{
  "detail": "Cannot create orders for restaurants outside your country"
}
```

---

### 7. Cancel Order
```http
POST /api/orders/{orderId}/cancel
Cookie: auth_token={token}
```

**Response 200:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "restaurantId": "uuid",
  "totalAmount": 640.0,
  "status": "cancelled",
  "createdAt": "2025-12-06 10:00:00+00"
}
```

**Response 403:** Members cannot cancel orders
```json
{
  "detail": "Members cannot cancel orders"
}
```

**Response 403:** Managers cannot cancel orders from other countries
```json
{
  "detail": "Cannot cancel orders for restaurants outside your country"
}
```

**Response 404:** Order not found
```json
{
  "detail": "Order not found"
}
```

---

### 8. Get Payment Methods
```http
GET /api/payment-methods
Cookie: auth_token={token}
```

**Response 200:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "cardLast4": "4242",
    "type": "credit_card"
  }
]
```

**Filtering:**
- Admin: All payment methods
- Manager/Member: Only their own payment methods

---

### 9. Add Payment Method
```http
POST /api/payment-methods
Content-Type: application/json
Cookie: auth_token={token}

{
  "userId": "uuid",
  "cardLast4": "5555",
  "type": "credit_card"
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "cardLast4": "5555",
  "type": "credit_card"
}
```

**Response 403:** Members cannot update payment methods
```json
{
  "detail": "Members cannot update payment methods"
}
```

**Response 403:** Only admins can update other users' payment methods
```json
{
  "detail": "Cannot update other users' payment methods"
}
```

---

### 10. Get Shopping Cart
```http
GET /api/cart
Cookie: auth_token={token}
```

**Response 200:**
```json
[
  {
    "id": "uuid",
    "menuId": "uuid",
    "name": "Butter Chicken",
    "quantity": 2,
    "price": 320.0,
    "restaurantId": "uuid"
  }
]
```

**Country Filtering:**
- Admin: All cart items
- Manager/Member: Only cart items from restaurants in their country

---

### 11. Add Item to Cart
```http
POST /api/cart
Content-Type: application/json
Cookie: auth_token={token}

{
  "menuId": "uuid",
  "quantity": 1,
  "price": 320.0,
  "restaurantId": "uuid"
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "menuId": "uuid",
  "name": "Butter Chicken",
  "quantity": 1,
  "price": 320.0,
  "restaurantId": "uuid"
}
```

**Response 403:** Managers/Members cannot add items from other countries
```json
{
  "detail": "Cannot add items from restaurants outside your country"
}
```

**Response 404:** Menu or restaurant not found
```json
{
  "detail": "Menu or restaurant not found"
}
```

---

### 12. Remove Item from Cart
```http
DELETE /api/cart?itemId={uuid}
Cookie: auth_token={token}
```

**Response 200:**
```json
{
  "success": true
}
```

**Response 404:** Cart item not found
```json
{
  "detail": "Cart item not found"
}
```

---

### 13. Clear Cart
```http
POST /api/cart/clear
Cookie: auth_token={token}
```

**Response 200:**
```json
{
  "success": true
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "detail": "Insufficient permissions"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal Server Error"
}
```

---

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nickfury@admin.com","password":"admin123"}' \
  -c cookies.txt

# Get restaurants (uses saved cookie)
curl http://localhost:8001/api/restaurants -b cookies.txt

# Create order
curl -X POST http://localhost:8001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"uuid","items":[{"menuId":"uuid","quantity":2,"price":320}],"totalAmount":640}' \
  -b cookies.txt
```

---

## RBAC Summary

| Endpoint | Admin | Manager | Member |
|----------|-------|---------|--------|
| Login/Logout | ✅ | ✅ | ✅ |
| Get Restaurants | All (with filter) | Country Only | Country Only |
| Get Menus | All | Country Only | Country Only |
| Get Orders | All | Country Only | ❌ 403 |
| Create Order | ✅ | Country Only | ❌ 403 |
| Cancel Order | ✅ | Country Only | ❌ 403 |
| Get Payment Methods | All | Own | Own |
| Add Payment Method | All Users | ❌ 403 | ❌ 403 |
| Get Cart | All | Country Only | Country Only |
| Add to Cart | ✅ | Country Only | Country Only |
| Remove from Cart | ✅ | ✅ | ✅ |
| Clear Cart | ✅ | ✅ | ✅ |

## Country-Based Access Control

**All operations are restricted by country for Managers and Members:**

- **Restaurants:** Can only view/access restaurants in their country
- **Menus:** Can only view menus from restaurants in their country
- **Cart:** Can only add items from restaurants in their country
- **Orders:** Managers can only create/cancel orders for restaurants in their country
- **Members:** Cannot place orders or view order history

**Admins have unrestricted access to all countries.**
