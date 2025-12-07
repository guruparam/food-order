# Slooze V2 - Dataset Documentation

## Overview
This document details all seeded data in the Slooze V2 database, including users, restaurants, menus, and their relationships. This data is automatically created when the application starts for the first time.

---

## Table of Contents
1. [Users](#users)
2. [Restaurants](#restaurants)
3. [Menu Items](#menu-items)
4. [Data Relationships](#data-relationships)
5. [Access Control Matrix](#access-control-matrix)
6. [Test Scenarios](#test-scenarios)

---

## 1. Users

### Total Users: 6

| # | Name | Email | Password | Role | Country | Purpose |
|---|------|-------|----------|------|---------|---------|
| 1 | Nick Fury | nickfury@admin.com | admin123 | admin | USA | Global administrator |
| 2 | Captain Marvel | captainmarvel@manager.com | manager123 | manager | India | India region manager |
| 3 | Captain America | captainamerica@manager.com | manager123 | manager | USA | USA region manager |
| 4 | Thanos | thanos@member.com | member123 | member | India | India regular member |
| 5 | Thor | thor@member.com | member123 | member | India | India regular member |
| 6 | Travis | travis@member.com | member123 | member | USA | USA regular member |

### User Details

#### Admin User
```json
{
  "id": "uuid-generated",
  "email": "nickfury@admin.com",
  "name": "Nick Fury",
  "password": "admin123",
  "role": "admin",
  "country": "USA",
  "is_staff": true,
  "is_superuser": true
}
```

**Capabilities:**
- Access all restaurants globally
- View and manage all orders
- Add payment methods for any user
- Filter restaurants by country
- Full system access

#### Manager Users

**India Manager:**
```json
{
  "id": "uuid-generated",
  "email": "captainmarvel@manager.com",
  "name": "Captain Marvel",
  "password": "manager123",
  "role": "manager",
  "country": "India",
  "is_staff": false
}
```

**USA Manager:**
```json
{
  "id": "uuid-generated",
  "email": "captainamerica@manager.com",
  "name": "Captain America",
  "password": "manager123",
  "role": "manager",
  "country": "USA",
  "is_staff": false
}
```

**Capabilities:**
- Access only restaurants in their country
- Create and cancel orders in their country
- View orders in their country only
- Cannot add payment methods
- Country-restricted access

#### Member Users

**India Members:**
```json
[
  {
    "email": "thanos@member.com",
    "name": "Thanos",
    "password": "member123",
    "role": "member",
    "country": "India"
  },
  {
    "email": "thor@member.com",
    "name": "Thor",
    "password": "member123",
    "role": "member",
    "country": "India"
  }
]
```

**USA Member:**
```json
{
  "email": "travis@member.com",
  "name": "Travis",
  "password": "member123",
  "role": "member",
  "country": "USA"
}
```

**Capabilities:**
- Access only restaurants in their country
- Add items to cart (country-restricted)
- Cannot checkout or place orders
- Cannot view orders page
- Read-only access to payment methods

---

## 2. Restaurants

### Total Restaurants: 10 (4 India, 4 USA, 2 UK)

### India Restaurants (4)

#### 1. Mumbai Masala
```json
{
  "id": "uuid-generated",
  "name": "Mumbai Masala",
  "country": "India",
  "description": "Authentic Indian cuisine with aromatic spices and traditional recipes from Mumbai"
}
```

#### 2. Delhi Delights
```json
{
  "id": "uuid-generated",
  "name": "Delhi Delights",
  "country": "India",
  "description": "North Indian delicacies featuring tandoori specialties and rich curries"
}
```

#### 3. Bangalore Bistro
```json
{
  "id": "uuid-generated",
  "name": "Bangalore Bistro",
  "country": "India",
  "description": "South Indian fusion food combining traditional flavors with modern presentation"
}
```

#### 4. Kolkata Kitchen
```json
{
  "id": "uuid-generated",
  "name": "Kolkata Kitchen",
  "country": "India",
  "description": "Bengali street food favorites including rolls, cutlets, and sweets"
}
```

---

### USA Restaurants (4)

#### 5. New York Pizza
```json
{
  "id": "uuid-generated",
  "name": "New York Pizza",
  "country": "USA",
  "description": "New York style pizza with hand-tossed dough and fresh toppings"
}
```

#### 6. Texas Burger House
```json
{
  "id": "uuid-generated",
  "name": "Texas Burger House",
  "country": "USA",
  "description": "Authentic Texas-style burgers with premium beef and homemade sauces"
}
```

#### 7. California Grill
```json
{
  "id": "uuid-generated",
  "name": "California Grill",
  "country": "USA",
  "description": "Fresh California-style salads, wraps, and healthy bowls"
}
```

#### 8. Chicago Steakhouse
```json
{
  "id": "uuid-generated",
  "name": "Chicago Steakhouse",
  "country": "USA",
  "description": "Premium steaks and classic American comfort food"
}
```

---

### UK Restaurants (2)

#### 9. London Fish & Chips
```json
{
  "id": "uuid-generated",
  "name": "London Fish & Chips",
  "country": "UK",
  "description": "Traditional British fish and chips with mushy peas and tartar sauce"
}
```

#### 10. Edinburgh Pub
```json
{
  "id": "uuid-generated",
  "name": "Edinburgh Pub",
  "country": "UK",
  "description": "Scottish pub classics including haggis, shepherd's pie, and scotch eggs"
}
```

---

## 3. Menu Items

### Total Menu Items: 45 (4-5 items per restaurant)

### Mumbai Masala Menu (4 items)

```json
[
  {
    "name": "Butter Chicken",
    "price": 320.00,
    "description": "Creamy tomato-based chicken curry with aromatic spices"
  },
  {
    "name": "Paneer Tikka",
    "price": 280.00,
    "description": "Grilled cottage cheese marinated in spices"
  },
  {
    "name": "Garlic Naan",
    "price": 60.00,
    "description": "Soft flatbread brushed with garlic butter"
  },
  {
    "name": "Chicken Biryani",
    "price": 350.00,
    "description": "Fragrant basmati rice with spiced chicken"
  }
]
```

---

### Delhi Delights Menu (5 items)

```json
[
  {
    "name": "Tandoori Chicken",
    "price": 380.00,
    "description": "Clay oven roasted chicken with Indian spices"
  },
  {
    "name": "Dal Makhani",
    "price": 220.00,
    "description": "Creamy black lentils slow-cooked overnight"
  },
  {
    "name": "Aloo Paratha",
    "price": 80.00,
    "description": "Potato-stuffed whole wheat flatbread"
  },
  {
    "name": "Palak Paneer",
    "price": 260.00,
    "description": "Cottage cheese in spinach gravy"
  },
  {
    "name": "Chole Bhature",
    "price": 180.00,
    "description": "Spiced chickpeas with fried bread"
  }
]
```

---

### Bangalore Bistro Menu (5 items)

```json
[
  {
    "name": "Masala Dosa",
    "price": 120.00,
    "description": "Crispy rice crepe with potato filling"
  },
  {
    "name": "Idli Sambar",
    "price": 100.00,
    "description": "Steamed rice cakes with lentil soup"
  },
  {
    "name": "Rava Upma",
    "price": 90.00,
    "description": "Semolina porridge with vegetables"
  },
  {
    "name": "Bisi Bele Bath",
    "price": 140.00,
    "description": "Spicy rice and lentil dish"
  },
  {
    "name": "Filter Coffee",
    "price": 50.00,
    "description": "Traditional South Indian filter coffee"
  }
]
```

---

### Kolkata Kitchen Menu (4 items)

```json
[
  {
    "name": "Kathi Roll",
    "price": 150.00,
    "description": "Wrap with spiced meat or paneer"
  },
  {
    "name": "Fish Fry",
    "price": 280.00,
    "description": "Bengali-style fried fish with mustard"
  },
  {
    "name": "Mishti Doi",
    "price": 70.00,
    "description": "Sweet yogurt dessert"
  },
  {
    "name": "Luchi Aloo Dum",
    "price": 120.00,
    "description": "Fried bread with spicy potatoes"
  }
]
```

---

### New York Pizza Menu (5 items)

```json
[
  {
    "name": "Pepperoni Pizza",
    "price": 18.99,
    "description": "Classic pizza with pepperoni slices"
  },
  {
    "name": "Margherita Pizza",
    "price": 16.99,
    "description": "Fresh mozzarella, basil, and tomato sauce"
  },
  {
    "name": "BBQ Chicken Pizza",
    "price": 19.99,
    "description": "BBQ sauce, chicken, red onions, cilantro"
  },
  {
    "name": "Garlic Knots",
    "price": 6.99,
    "description": "Twisted dough with garlic and parmesan"
  },
  {
    "name": "Caesar Salad",
    "price": 8.99,
    "description": "Romaine lettuce with Caesar dressing"
  }
]
```

---

### Texas Burger House Menu (5 items)

```json
[
  {
    "name": "Texas BBQ Burger",
    "price": 14.99,
    "description": "Beef patty with BBQ sauce and onion rings"
  },
  {
    "name": "Bacon Cheeseburger",
    "price": 13.99,
    "description": "Double patty with bacon and cheddar"
  },
  {
    "name": "Loaded Fries",
    "price": 7.99,
    "description": "Fries topped with cheese, bacon, jalapeños"
  },
  {
    "name": "Chicken Wings",
    "price": 11.99,
    "description": "Spicy buffalo wings with ranch"
  },
  {
    "name": "Milkshake",
    "price": 5.99,
    "description": "Chocolate, vanilla, or strawberry"
  }
]
```

---

### California Grill Menu (4 items)

```json
[
  {
    "name": "Buddha Bowl",
    "price": 15.99,
    "description": "Quinoa, avocado, chickpeas, and vegetables"
  },
  {
    "name": "Greek Salad",
    "price": 12.99,
    "description": "Fresh vegetables with feta and olives"
  },
  {
    "name": "Veggie Wrap",
    "price": 10.99,
    "description": "Grilled vegetables in whole wheat wrap"
  },
  {
    "name": "Acai Bowl",
    "price": 13.99,
    "description": "Acai with granola, berries, and honey"
  }
]
```

---

### Chicago Steakhouse Menu (5 items)

```json
[
  {
    "name": "Ribeye Steak",
    "price": 32.99,
    "description": "16oz ribeye with garlic butter"
  },
  {
    "name": "Filet Mignon",
    "price": 38.99,
    "description": "8oz tenderloin with red wine reduction"
  },
  {
    "name": "Grilled Salmon",
    "price": 26.99,
    "description": "Atlantic salmon with lemon herb butter"
  },
  {
    "name": "Mac & Cheese",
    "price": 9.99,
    "description": "Creamy three-cheese macaroni"
  },
  {
    "name": "Cheesecake",
    "price": 8.99,
    "description": "New York style cheesecake"
  }
]
```

---

### London Fish & Chips Menu (4 items)

```json
[
  {
    "name": "Fish & Chips",
    "price": 12.99,
    "description": "Beer-battered cod with thick-cut chips"
  },
  {
    "name": "Mushy Peas",
    "price": 3.99,
    "description": "Traditional British side dish"
  },
  {
    "name": "Pickled Eggs",
    "price": 2.99,
    "description": "Classic pub snack"
  },
  {
    "name": "Apple Crumble",
    "price": 6.99,
    "description": "Warm dessert with custard"
  }
]
```

---

### Edinburgh Pub Menu (5 items)

```json
[
  {
    "name": "Haggis & Neeps",
    "price": 14.99,
    "description": "Traditional haggis with turnips and potatoes"
  },
  {
    "name": "Shepherd's Pie",
    "price": 13.99,
    "description": "Ground lamb with mashed potato topping"
  },
  {
    "name": "Scotch Eggs",
    "price": 7.99,
    "description": "Hard-boiled eggs wrapped in sausage"
  },
  {
    "name": "Cullen Skink",
    "price": 9.99,
    "description": "Smoked haddock soup"
  },
  {
    "name": "Sticky Toffee Pudding",
    "price": 7.99,
    "description": "Moist sponge cake with toffee sauce"
  }
]
```

---

## 4. Data Relationships

### Entity Relationship Summary

```
Users (6)
  └─ Orders (dynamic) ──→ Restaurants (10)
  └─ CartItems (dynamic) ──→ Menus (45) ──→ Restaurants (10)
  └─ PaymentMethods (dynamic)

OrderItems (dynamic) ──→ Orders (dynamic)
                     └──→ Menus (45)
```

### Country Distribution

| Country | Restaurants | Menu Items | Users |
|---------|-------------|------------|-------|
| India | 4 | 18 | 3 (1 manager, 2 members) |
| USA | 4 | 19 | 3 (1 admin, 1 manager, 1 member) |
| UK | 2 | 8 | 0 |

### Price Ranges

| Country | Min Price | Max Price | Avg Price |
|---------|-----------|-----------|-----------|
| India | ₹50 | ₹380 | ₹170 |
| USA | $5.99 | $38.99 | $15.50 |
| UK | £2.99 | £14.99 | £9.07 |

---

## 5. Access Control Matrix

### What Each User Can See

| User Type | Restaurants Visible | Example Count |
|-----------|-------------------|---------------|
| Nick Fury (Admin, USA) | All 10 restaurants | 10 |
| Captain Marvel (Manager, India) | Only India restaurants | 4 |
| Captain America (Manager, USA) | Only USA restaurants | 4 |
| Thanos (Member, India) | Only India restaurants | 4 |
| Thor (Member, India) | Only India restaurants | 4 |
| Travis (Member, USA) | Only USA restaurants | 4 |

### Menu Item Access

| User Type | Menu Items Visible |
|-----------|-------------------|
| Admin | All 45 items |
| Manager (India) | 18 items (from 4 India restaurants) |
| Manager (USA) | 19 items (from 4 USA restaurants) |
| Member (India) | 18 items (from 4 India restaurants) |
| Member (USA) | 19 items (from 4 USA restaurants) |

---

## 6. Test Scenarios

### Scenario 1: Cross-Country Access Prevention

**Test Case:**
1. Login as Captain Marvel (India Manager)
2. Try to order from New York Pizza (USA)

**Expected Result:**
```json
{
  "error": "Cannot order from restaurants in other countries",
  "status": 403
}
```

---

### Scenario 2: Member Checkout Block

**Test Case:**
1. Login as Thanos (India Member)
2. Add items to cart from Mumbai Masala
3. Try to checkout

**Expected Result:**
```json
{
  "error": "Members cannot place orders",
  "status": 403
}
```

---

### Scenario 3: Admin Global Access

**Test Case:**
1. Login as Nick Fury (Admin)
2. Get all restaurants
3. Filter by country=UK
4. Order from London Fish & Chips

**Expected Result:**
- Step 2: Returns all 10 restaurants
- Step 3: Returns 2 UK restaurants
- Step 4: Order successful

---

### Scenario 4: Manager Regional Orders

**Test Case:**
1. Login as Captain America (USA Manager)
2. Get restaurants (auto-filtered to USA)
3. Get menus from Texas Burger House
4. Add to cart
5. Checkout

**Expected Result:**
- Step 2: Returns 4 USA restaurants only
- Step 3: Returns 5 menu items
- Step 4: Cart item added
- Step 5: Order created successfully

---

### Scenario 5: Cart Country Validation

**Test Case:**
1. Login as Captain Marvel (India Manager)
2. Get cart (empty)
3. Try to add menu item from Chicago Steakhouse (USA)

**Expected Result:**
```json
{
  "error": "Cannot add items from other countries",
  "status": 403
}
```

---

## Data Seeding Script

The data is seeded automatically on first run via Django migrations. The seeding logic:

1. Checks if users already exist
2. If not, creates all 6 users
3. Creates 10 restaurants (4 India, 4 USA, 2 UK)
4. Creates 45 menu items distributed across restaurants
5. Sets up relationships between entities

**Location:** `backend/api/migrations/0002_seed_data.py` (or similar)

---

## Database Queries

### Get all India restaurants:
```sql
SELECT * FROM api_restaurant WHERE country = 'India';
```

### Get menu items for Mumbai Masala:
```sql
SELECT m.* FROM api_menu m
JOIN api_restaurant r ON m.restaurant_id = r.id
WHERE r.name = 'Mumbai Masala';
```

### Get all orders by Captain Marvel:
```sql
SELECT o.* FROM api_order o
JOIN api_user u ON o.user_id = u.id
WHERE u.email = 'captainmarvel@manager.com';
```

### Count menu items by country:
```sql
SELECT r.country, COUNT(m.id) as menu_count
FROM api_menu m
JOIN api_restaurant r ON m.restaurant_id = r.id
GROUP BY r.country;
```

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Author:** Slooze Development Team
