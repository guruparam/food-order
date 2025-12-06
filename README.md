# Slooze - Food Ordering System

A complete full-stack food ordering application with Role-Based Access Control (RBAC) and country-based data isolation.

## 🏗️ Architecture

**Frontend:** Next.js 16 (React 19) → **Backend:** Django 5.1 + FastAPI → **Database:** PostgreSQL 15

```
Browser (localhost:3000)
    ↓ HTTP
Next.js Frontend (Proxy Layer)
    ↓ Docker Network
FastAPI Backend (port 8001) + Django Admin (port 8000)
    ↓ SQL
PostgreSQL Database (port 5432)
```

## ✨ Features

### Role-Based Access Control (RBAC)

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| View Restaurants | All (with filter) | Own Country Only | Own Country Only |
| View Menus | All | Own Country Only | Own Country Only |
| Shopping Cart | All Countries | Own Country Only | Own Country Only |
| Add to Cart | ✅ | ✅ (Country restricted) | ✅ (Country restricted) |
| Checkout & Pay | ✅ | ✅ (Country restricted) | ❌ Blocked |
| View Orders | All | Own Country Only | ❌ Blocked |
| Cancel Orders | ✅ | ✅ (Country restricted) | ❌ Blocked |
| Manage Payment Methods | All Users | ❌ View Only | ❌ View Only |

### Country-Based Data Isolation
- **India:** 4 restaurants (Mumbai Masala, Delhi Delights, Bangalore Bistro, Kolkata Kitchen)
- **USA:** 4 restaurants (New York Pizza, Texas Burger House, California Grill, Chicago Steakhouse)
- **UK:** 2 restaurants (London Fish & Chips, Edinburgh Pub)
- Managers/Members can only access data from their assigned country
- Admins have global access with optional country filtering

### Shopping Cart (Backend Persistence)
- Cart stored in database (persists across sessions)
- Add/remove items with quantity management
- Country-based access control (Managers/Members restricted to their country)
- Clear cart after checkout

### Payment & Checkout
- Select payment method before checkout
- Only Admin can add/update payment methods
- Payment required to place order
- Order history with item details

### Theme System
- **Light Mode:** Orange/coral primary color (Slooze brand)
- **Dark Mode:** Darker orange with adjusted contrast
- Theme toggle in navbar (Sun/Moon icon)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Ports available: 3000 (Frontend), 8000 (Django), 8001 (FastAPI), 5432 (Postgres)

### Run with Docker

```bash
# Clone repository
git clone <repo-url>
cd Slooze-V2

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

**Access:**
- Frontend: http://localhost:3000
- Django Admin: http://localhost:8000/admin
- FastAPI Docs: http://localhost:8001/docs

### Test Accounts

| Email | Password | Role | Country |
|-------|----------|------|------|
| nickfury@admin.com | admin123 | Admin | USA |
| captainmarvel@manager.com | manager123 | Manager | India |
| captainamerica@manager.com | manager123 | Manager | USA |
| thanos@member.com | member123 | Member | India |
| thor@member.com | member123 | Member | India |
| travis@member.com | member123 | Member | USA |

## 📁 Project Structure

```
Slooze-V2/
├── app/                          # Next.js Frontend
│   ├── api/                      # API Routes (Proxy to Backend)
│   │   ├── auth/                 # Login, Logout
│   │   ├── restaurants/          # Get Restaurants
│   │   ├── menus/                # Get Menus
│   │   ├── orders/               # Create, Get, Cancel Orders
│   │   └── payment-methods/      # Payment Methods
│   ├── dashboard/                # Dashboard Page
│   ├── restaurants/              # Browse & Checkout
│   ├── orders/                   # Order History
│   ├── payment-methods/          # Payment Management
│   └── login/                    # Login Page
├── backend/                      # Python Backend
│   ├── django_project/           # Django Settings
│   ├── api/                      # Django Models & Migrations
│   │   └── migrations/           # Database Migrations
│   ├── fastapi_app/              # FastAPI Application
│   │   └── main.py               # 9 API Endpoints with RBAC
│   ├── seed_data.py              # Database Seeding Script
│   ├── Dockerfile                # Single Container Build
│   └── supervisord.conf          # Process Manager (Django + FastAPI)
├── components/                   # React Components
│   ├── navbar.tsx                # Navigation with Theme Toggle
│   └── ui/                       # Shadcn UI Components
├── docker-compose.yml            # 3 Services (app, backend, postgres)
├── Dockerfile                    # Frontend Build
└── README.md                     # This File
```

## 🔧 Backend API Endpoints (13 Total)

### Authentication
- `POST /api/auth/login` - User login (returns token)
- `POST /api/auth/logout` - User logout

### Restaurants
- `GET /api/restaurants?country={country}` - List restaurants (Admin can filter by country)

### Menus
- `GET /api/menus?restaurantId={id}` - List menus for restaurant

### Orders
- `GET /api/orders` - List orders (Admin: all, Manager: own country only)
- `POST /api/orders` - Create order (Admin: any country, Manager: own country only)
- `POST /api/orders/{id}/cancel` - Cancel order (Admin: any, Manager: own country only)

### Payment Methods
- `GET /api/payment-methods` - List payment methods (Admin: all, Manager/Member: own)
- `POST /api/payment-methods` - Add payment method (Admin only)

### Shopping Cart (Backend Persistence)
- `GET /api/cart` - Get cart items (filtered by country for Manager/Member)
- `POST /api/cart` - Add item to cart (country validation applied)
- `DELETE /api/cart?itemId={id}` - Remove item from cart
- `POST /api/cart/clear` - Clear entire cart

**All endpoints require authentication via `auth_token` cookie.**
**All endpoints use Django ORM (no raw SQL).**

## 🗄️ Database Schema

```sql
-- Users (6 seeded)
api_user (id, email, name, password, role, country, is_staff)

-- Restaurants (10 seeded: 4 India, 4 USA, 2 UK)
api_restaurant (id, name, country, description)

-- Menus (45 seeded: 4-5 per restaurant)
api_menu (id, restaurant_id, name, price, description)

-- Orders (dynamic)
api_order (id, user_id, restaurant_id, total_amount, status, created_at)

-- Order Items (dynamic)
api_orderitem (id, order_id, menu_id, quantity, price)

-- Payment Methods (dynamic)
api_paymentmethod (id, user_id, card_last4, type)

-- Shopping Cart (dynamic - backend persistence)
api_cartitem (id, user_id, menu_id, restaurant_id, quantity, price, created_at)
```

## 🧪 Testing

### Manual Testing

1. **Admin Flow:**
```bash
# Login as admin
http://localhost:3000/login
Email: nickfury@admin.com | Password: admin123

# Should see:
- All restaurants (India + USA)
- Can checkout and place orders
- Can view all orders
- Can add payment methods for any user
```

2. **Manager Flow:**
```bash
# Login as India manager
Email: captainmarvel@manager.com | Password: manager123

# Should see:
- Only India restaurants (Mumbai Masala, Delhi Dhaba)
- Can checkout and place orders
- Can view only India orders
- Cannot add payment methods (view only)
```

3. **Member Flow:**
```bash
# Login as member
Email: thanos@member.com | Password: member123

# Should see:
- Only India restaurants
- Can add items to cart
- "Members Can't Checkout" button (disabled)
- Cannot view orders page (redirected)
- Cannot view payment methods
```

### API Testing (PowerShell)

```powershell
# Login and get token
$login = Invoke-RestMethod -Uri 'http://localhost:8001/api/auth/login' `
  -Method POST `
  -Body (@{email='nickfury@admin.com'; password='admin123'} | ConvertTo-Json) `
  -ContentType 'application/json'

# Create session with token
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.Cookies.Add((New-Object System.Net.Cookie('auth_token', $login.token, '/', 'localhost')))

# Get restaurants
Invoke-RestMethod -Uri 'http://localhost:8001/api/restaurants' -WebSession $session

# Get menus
Invoke-RestMethod -Uri 'http://localhost:8001/api/menus' -WebSession $session

# Create order
$orderData = @{
  restaurantId = 'rest-id-here'
  items = @(@{menuId='menu-id-here'; quantity=2; price=320})
  totalAmount = 640
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri 'http://localhost:8001/api/orders' `
  -Method POST `
  -Body $orderData `
  -ContentType 'application/json' `
  -WebSession $session
```

## 🐛 Troubleshooting

### Frontend not loading
```bash
docker compose logs app --tail=50
docker compose restart app
```

### Backend errors
```bash
docker compose logs backend --tail=50
docker compose restart backend
```

### Database connection issues
```bash
docker compose logs postgres --tail=50
# Check if postgres is healthy
docker compose ps
```

### Reset everything
```bash
docker compose down -v
docker compose up -d --build
```

## 📝 Development Notes

### Key Implementation Details

1. **Authentication Flow:**
   - Frontend login → Backend FastAPI → Token stored in HTTP-only cookie
   - All subsequent requests include cookie → Backend validates token
   - Frontend acts as proxy layer between browser and backend

2. **Next.js 16 Breaking Changes:**
   - `params` in API routes is now a Promise (must await)
   - Fixed in cancel order route: `const { id } = await params`

3. **Data Flow:**
   - Frontend fetches from `/api/*` routes (localhost:3000)
   - API routes proxy to `http://backend:8001/api/*`
   - Backend queries PostgreSQL and applies RBAC filters
   - Response flows back through proxy to browser

4. **RBAC Implementation:**
   - Backend validates role on every endpoint
   - Country filtering in SQL queries for managers/members
   - Frontend hides/disables UI elements based on role

5. **Payment Workflow:**
   - Fetch payment methods on restaurants page load
   - Show modal on checkout with payment selection
   - Include `paymentMethodId` in order creation
   - Only admin can add payment methods

6. **Shopping Cart:**
   - Backend persistence using `CartItem` model
   - Country-based access control (Managers/Members restricted)
   - Cart items filtered by restaurant country
   - Auto-clear after successful checkout
   - Uses Django ORM with `select_related()` for optimization

7. **Country-Based Access Control:**
   - All database queries filtered by user's country for Managers/Members
   - Restaurants, Menus, Orders, Cart all respect country boundaries
   - Admin has global access with optional filtering
   - 403 Forbidden returned for cross-country access attempts

## 🔐 Security Notes

**⚠️ For Development Only:**
- Passwords stored in plain text (use bcrypt in production)
- No HTTPS (enable SSL certificates in production)
- Sessions in memory (use Redis in production)
- No rate limiting (add middleware in production)
- CORS not configured (restrict origins in production)

## 📦 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js | 16.0.7 |
| React | React | 19.0.0 |
| Styling | Tailwind CSS | 4.0.0 |
| UI Components | Shadcn UI | Latest |
| Theme | next-themes | 0.4.6 |
| Icons | lucide-react | 0.454.0 |
| Backend API | FastAPI | 0.115.5 |
| Admin Panel | Django | 5.1.2 |
| Database | PostgreSQL | 15-alpine |
| ORM | Django ORM | 5.1.2 |
| DB Driver | psycopg2 | 2.9.10 |
| Process Manager | supervisord | Latest |
| Container | Docker | Latest |

## 🎯 Assignment Compliance

✅ **All Requirements Met:**

1. **RBAC System** - Admin, Manager, Member roles with proper restrictions
2. **Country-Based Isolation** - India/USA data segregation
3. **Checkout Restrictions** - Members cannot place orders
4. **Payment Integration** - Payment method selection required
5. **Order Management** - Create, view, cancel with role checks
6. **Complete Flow** - Browse → Cart → Payment → Order → History
7. **Docker Deployment** - Single command startup
8. **Full Stack** - Next.js frontend + Python backend + PostgreSQL
9. **Theme Support** - Light/dark mode with Slooze branding

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contact

For questions or issues, please contact the development team.

---

**Built with ❤️ using Next.js, FastAPI, Django, and PostgreSQL**
