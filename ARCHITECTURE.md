# Slooze V2 - Architecture & Design Document

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [Security Design](#security-design)
7. [Database Schema](#database-schema)
8. [API Design](#api-design)
9. [Frontend Architecture](#frontend-architecture)
10. [Deployment Architecture](#deployment-architecture)

---

## 1. System Overview

**Slooze V2** is a full-stack food ordering system with Role-Based Access Control (RBAC) and country-based data isolation. The system supports three user roles (Admin, Manager, Member) with different permissions and access levels.

### Key Features
- **Role-Based Access Control (RBAC)** - Admin, Manager, Member roles
- **Country-Based Data Isolation** - India, USA, UK regions
- **Shopping Cart** - Backend-persisted cart with country validation
- **Order Management** - Create, view, cancel orders
- **Payment Integration** - Payment method selection and management
- **Theme System** - Light/dark mode with custom teal-cyan theme

### Design Principles
- **Separation of Concerns** - Frontend proxy layer, backend business logic, database persistence
- **Security First** - JWT authentication, HTTP-only cookies, role validation
- **Scalability** - Docker containerization, stateless API design
- **Maintainability** - Clear folder structure, type-safe code, comprehensive documentation

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│                    (Browser - Port 3000)                    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Login Page   │  │ Restaurants  │  │ Orders Page  │    │
│  │              │  │ & Checkout   │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│              Next.js 16 App Router (Port 3000)              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ API Routes (Proxy Layer)                             │ │
│  │ • /api/auth/*       • /api/restaurants               │ │
│  │ • /api/menus        • /api/orders                    │ │
│  │ • /api/cart         • /api/payment-methods           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Components                                           │ │
│  │ • Navbar with theme toggle                           │ │
│  │ • Shadcn UI components (Button, Card, Dialog, etc.)  │ │
│  │ • Theme Provider (next-themes)                       │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │ Docker Network
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                          │
│               Python Container (Port 8000/8001)             │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │ Django Admin     │         │ FastAPI REST API │        │
│  │ (Port 8000)      │         │ (Port 8001)      │        │
│  │                  │         │                  │        │
│  │ • User Mgmt      │         │ • 13 Endpoints   │        │
│  │ • Data Admin     │         │ • JWT Auth       │        │
│  │ • Migrations     │         │ • RBAC Logic     │        │
│  └──────────────────┘         └──────────────────┘        │
│           │                            │                    │
│           └────────────┬───────────────┘                    │
│                        │                                    │
│                  ┌─────▼─────┐                             │
│                  │  Django   │                             │
│                  │    ORM    │                             │
│                  └─────┬─────┘                             │
│                        │                                    │
│              Supervisord (Process Manager)                  │
└─────────────────────────────────────────────────────────────┘
                            │ SQL
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                          │
│              PostgreSQL 15 (Port 5432)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Tables:                                              │ │
│  │ • api_user (6 records)                               │ │
│  │ • api_restaurant (10 records: 4 India, 4 USA, 2 UK) │ │
│  │ • api_menu (45 records)                              │ │
│  │ • api_order (dynamic)                                │ │
│  │ • api_orderitem (dynamic)                            │ │
│  │ • api_paymentmethod (dynamic)                        │ │
│  │ • api_cartitem (dynamic)                             │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.7 | React framework with App Router |
| React | 19.0.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.0.0 | Styling framework |
| Shadcn UI | Latest | Component library |
| next-themes | 0.4.6 | Theme management |
| lucide-react | 0.454.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.12 | Programming language |
| FastAPI | 0.115.5 | REST API framework |
| Django | 5.1.2 | ORM & Admin panel |
| PostgreSQL | 15-alpine | Database |
| psycopg2 | 2.9.10 | PostgreSQL driver |
| pydantic | 2.x | Data validation |
| supervisord | Latest | Process manager |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Git | Version control |

---

## 4. Component Architecture

### 4.1 Frontend Components

```
app/
├── layout.tsx                 # Root layout with theme provider
├── page.tsx                   # Home/redirect page
├── login/
│   └── page.tsx              # Login form with email/password
├── dashboard/
│   └── page.tsx              # Dashboard with role-based navigation
├── restaurants/
│   └── page.tsx              # Browse restaurants, add to cart, checkout
├── orders/
│   └── page.tsx              # Order history and cancellation
├── payment-methods/
│   └── page.tsx              # Payment method management
└── api/                       # Proxy routes to backend
    ├── auth/
    │   ├── login/route.ts
    │   └── logout/route.ts
    ├── restaurants/route.ts
    ├── menus/route.ts
    ├── orders/
    │   ├── route.ts
    │   └── [id]/cancel/route.ts
    └── payment-methods/route.ts

components/
├── navbar.tsx                 # Navigation with theme toggle
├── theme-provider.tsx         # Theme context provider
└── ui/                        # Shadcn UI components
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    └── ... (30+ components)
```

### 4.2 Backend Components

```
backend/
├── django_project/            # Django configuration
│   ├── settings.py           # Database, CORS, installed apps
│   └── urls.py               # URL routing
├── api/                       # Django app
│   ├── models.py             # Database models
│   ├── admin.py              # Admin panel config
│   └── migrations/           # Database migrations
├── fastapi_app/
│   └── main.py               # FastAPI application (13 endpoints)
├── manage.py                  # Django management commands
├── supervisord.conf           # Process manager config
├── Dockerfile                 # Container build
└── requirements.txt           # Python dependencies
```

---

## 5. Data Flow

### 5.1 Authentication Flow

```
1. User enters email/password
   ↓
2. Frontend: POST /api/auth/login
   ↓
3. Next.js API Route: Forward to backend
   ↓
4. FastAPI: Validate credentials against Django ORM
   ↓
5. FastAPI: Generate JWT token (secrets.token_hex)
   ↓
6. FastAPI: Store session in memory (SESSIONS dict)
   ↓
7. Next.js: Set HTTP-only cookie with token
   ↓
8. Browser: Stores cookie, redirects to dashboard
```

### 5.2 Restaurant Browsing Flow

```
1. User opens restaurants page
   ↓
2. Frontend: GET /api/restaurants
   ↓
3. Next.js API Route: Forward with auth cookie
   ↓
4. FastAPI: Validate token from cookie
   ↓
5. FastAPI: Check user role and country
   ↓
6. Django ORM: Query restaurants
   - Admin: All restaurants (or filtered by country)
   - Manager/Member: Only restaurants from user's country
   ↓
7. FastAPI: Return restaurant list
   ↓
8. Frontend: Render restaurant cards
```

### 5.3 Order Creation Flow

```
1. User adds items to cart
   ↓
2. Frontend: POST /api/cart (per item)
   ↓
3. FastAPI: Validate country match
   ↓
4. Django ORM: Insert into api_cartitem table
   ↓
5. User clicks checkout
   ↓
6. Frontend: Show payment method selection
   ↓
7. User selects payment method
   ↓
8. Frontend: POST /api/orders
   ↓
9. FastAPI: Validate role (block members)
   ↓
10. FastAPI: Validate country match
    ↓
11. Django ORM: Create order + order items
    ↓
12. FastAPI: Clear cart (DELETE api_cartitem)
    ↓
13. Frontend: Redirect to orders page
```

### 5.4 Country-Based Access Control Flow

```
Request arrives with auth token
   ↓
Validate token → Extract user data (role, country)
   ↓
Check endpoint permission
   ↓
├─ Admin: Allow all countries (optional filter)
├─ Manager: Filter by user.country
└─ Member: Filter by user.country
   ↓
Apply country filter in Django ORM query
   ↓
Return filtered results
```

---

## 6. Security Design

### 6.1 Authentication

**Mechanism:** JWT-like token (secrets.token_hex)
- Token stored in HTTP-only cookie
- 24-hour expiration
- In-memory session store (SESSIONS dict)

**Login Endpoint:**
```python
@app.post("/api/auth/login")
def login(credentials: LoginRequest):
    user = User.objects.get(email=credentials.email, password=credentials.password)
    token = secrets.token_hex(32)
    SESSIONS[token] = {
        "user": user_data,
        "expires_at": datetime.now() + timedelta(hours=24)
    }
    return {"user": user_data, "token": token}
```

### 6.2 Authorization (RBAC)

**Role Hierarchy:**
```
Admin (highest privileges)
  └─ Global access to all countries
  └─ Can add payment methods for any user
  └─ Can view/cancel all orders

Manager (regional access)
  └─ Access limited to assigned country
  └─ Can create orders and manage their region
  └─ Cannot add payment methods

Member (minimal access)
  └─ Access limited to assigned country
  └─ Can only add to cart
  └─ Cannot checkout or view orders
```

**Permission Matrix:**

| Action | Admin | Manager | Member |
|--------|-------|---------|--------|
| View Restaurants | ✅ All | ✅ Own Country | ✅ Own Country |
| View Menus | ✅ All | ✅ Own Country | ✅ Own Country |
| Add to Cart | ✅ | ✅ | ✅ |
| Checkout | ✅ | ✅ | ❌ |
| View Orders | ✅ All | ✅ Own Country | ❌ |
| Cancel Orders | ✅ All | ✅ Own Country | ❌ |
| Add Payment Methods | ✅ | ❌ | ❌ |

### 6.3 Data Isolation

**Country-Based Filtering:**
```python
# Example: Get restaurants
if user["role"] == "admin":
    restaurants = Restaurant.objects.all()  # Or filter by country param
else:
    restaurants = Restaurant.objects.filter(country=user["country"])
```

**Validation on Writes:**
```python
# Example: Create order
if user["role"] != "admin":
    restaurant = Restaurant.objects.get(id=restaurantId)
    if restaurant.country != user["country"]:
        raise HTTPException(status_code=403, detail="Cannot order from other countries")
```

### 6.4 Security Considerations

**⚠️ Development Only (DO NOT USE IN PRODUCTION):**
- Passwords stored in plain text (use bcrypt/argon2)
- No HTTPS (enable SSL certificates)
- Sessions in memory (use Redis with persistence)
- No rate limiting (add middleware)
- CORS open to localhost (restrict origins)
- No CSRF protection (add tokens)
- No SQL injection protection on raw queries (using ORM is safe)

---

## 7. Database Schema

### 7.1 Entity Relationship Diagram

```
┌──────────────┐
│   api_user   │
│──────────────│
│ id (UUID)    │──┐
│ email        │  │
│ name         │  │
│ password     │  │
│ role         │  │
│ country      │  │
└──────────────┘  │
                  │
         ┌────────┴────────┬──────────────┬─────────────┐
         │                 │              │             │
         ▼                 ▼              ▼             ▼
┌─────────────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────────┐
│ api_restaurant  │  │  api_order   │  │api_payment │  │ api_cartitem  │
│─────────────────│  │──────────────│  │  method    │  │───────────────│
│ id (UUID)       │──┐│ id (UUID)    │  │────────────│  │ id (UUID)     │
│ name            │  ││ user_id      │──┤ id (UUID)  │  │ user_id       │──┐
│ country         │  ││ restaurant_id│  │ user_id    │  │ menu_id       │  │
│ description     │  ││ total_amount │  │ card_last4 │  │ restaurant_id │  │
└─────────────────┘  ││ status       │  │ type       │  │ quantity      │  │
         │           ││ created_at   │  └────────────┘  │ price         │  │
         │           │└──────────────┘                  │ created_at    │  │
         │           │       │                          └───────────────┘  │
         │           │       │                                  │           │
         ▼           │       ▼                                  │           │
┌─────────────────┐ │ ┌──────────────┐                        │           │
│   api_menu      │ │ │api_orderitem │                        │           │
│─────────────────│ │ │──────────────│                        │           │
│ id (UUID)       │─┼─┤ id (UUID)    │                        │           │
│ restaurant_id   │ │ │ order_id     │                        │           │
│ name            │ │ │ menu_id      │────────────────────────┘           │
│ price           │ │ │ quantity     │                                    │
│ description     │ │ │ price        │                                    │
└─────────────────┘ │ └──────────────┘                                    │
         │          │                                                      │
         └──────────┴──────────────────────────────────────────────────────┘
```

### 7.2 Table Definitions

#### api_user
```sql
CREATE TABLE api_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,  -- 'admin', 'manager', 'member'
    country VARCHAR(50) NOT NULL,  -- 'India', 'USA', 'UK'
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE
);
```

#### api_restaurant
```sql
CREATE TABLE api_restaurant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(50) NOT NULL,
    description TEXT
);
```

#### api_menu
```sql
CREATE TABLE api_menu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES api_restaurant(id),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);
```

#### api_order
```sql
CREATE TABLE api_order (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES api_user(id),
    restaurant_id UUID NOT NULL REFERENCES api_restaurant(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,  -- 'pending', 'confirmed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### api_orderitem
```sql
CREATE TABLE api_orderitem (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES api_order(id) ON DELETE CASCADE,
    menu_id UUID NOT NULL REFERENCES api_menu(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
```

#### api_paymentmethod
```sql
CREATE TABLE api_paymentmethod (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES api_user(id),
    card_last4 VARCHAR(4) NOT NULL,
    type VARCHAR(50) NOT NULL  -- 'credit', 'debit'
);
```

#### api_cartitem
```sql
CREATE TABLE api_cartitem (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES api_user(id),
    menu_id UUID NOT NULL REFERENCES api_menu(id),
    restaurant_id UUID NOT NULL REFERENCES api_restaurant(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7.3 Indexes

```sql
-- Performance indexes for frequent queries
CREATE INDEX idx_restaurant_country ON api_restaurant(country);
CREATE INDEX idx_menu_restaurant ON api_menu(restaurant_id);
CREATE INDEX idx_order_user ON api_order(user_id);
CREATE INDEX idx_order_restaurant ON api_order(restaurant_id);
CREATE INDEX idx_orderitem_order ON api_orderitem(order_id);
CREATE INDEX idx_cartitem_user ON api_cartitem(user_id);
CREATE INDEX idx_paymentmethod_user ON api_paymentmethod(user_id);
```

---

## 8. API Design

### 8.1 API Endpoints Summary

**Total Endpoints:** 13

**Authentication (2)**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Restaurants (1)**
- `GET /api/restaurants?country={country}` - List restaurants

**Menus (1)**
- `GET /api/menus?restaurantId={id}` - List menus

**Shopping Cart (4)**
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart?itemId={id}` - Remove item
- `POST /api/cart/clear` - Clear cart

**Orders (3)**
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `POST /api/orders/{id}/cancel` - Cancel order

**Payment Methods (2)**
- `GET /api/payment-methods` - List payment methods
- `POST /api/payment-methods` - Add payment method

### 8.2 Request/Response Examples

See `BACKEND_API.md` for detailed API documentation with examples.

### 8.3 Error Handling

**Standard Error Responses:**

```json
// 401 Unauthorized
{
  "detail": "Unauthorized"
}

// 403 Forbidden
{
  "detail": "Insufficient permissions"
}

// 404 Not Found
{
  "detail": "Resource not found"
}

// 422 Validation Error
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## 9. Frontend Architecture

### 9.1 Next.js App Router Structure

```
app/
├── layout.tsx              # Root layout with theme provider
├── page.tsx                # Home page (redirects to dashboard)
├── login/
│   └── page.tsx           # Client component with form
├── dashboard/
│   └── page.tsx           # Server component with role-based nav
├── restaurants/
│   └── page.tsx           # Server component with cart + checkout
├── orders/
│   └── page.tsx           # Server component with order list
├── payment-methods/
│   └── page.tsx           # Client component with forms
└── api/                    # Route handlers (proxy layer)
```

### 9.2 State Management

**No Global State Library** - Using React Server Components + Client Components

**Data Fetching:**
- Server Components: Direct fetch in component
- Client Components: useState + useEffect

**Authentication:**
- Token stored in HTTP-only cookie
- User data fetched on each page load
- No client-side JWT decoding

### 9.3 Theme System

**Implementation:**
- `next-themes` for theme persistence
- CSS variables in `app/globals.css`
- OKLCH color space for better color perception
- Dynamic theme switching without page reload

**Color Variables:**
```css
:root {
  --primary: oklch(0.6 0.15 195);  /* Teal-cyan */
  --background: oklch(0.99 0 0);    /* White */
  --foreground: oklch(0.2 0.01 270); /* Dark slate */
  /* ... more variables */
}

.dark {
  --primary: oklch(0.68 0.18 195);
  --background: oklch(0.15 0.01 270);
  --foreground: oklch(0.95 0.005 80);
  /* ... more variables */
}
```

### 9.4 Component Composition

**Shadcn UI Pattern:**
```tsx
// Base components in components/ui/
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Compose in page components
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## 10. Deployment Architecture

### 10.1 Docker Compose Services

```yaml
services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: foodorder_db
      POSTGRES_USER: foodadmin
      POSTGRES_PASSWORD: foodpass123

  # Backend (Django + FastAPI)
  backend:
    build: ./backend
    ports: ["8000:8000", "8001:8001"]
    depends_on: [postgres]
    environment:
      POSTGRES_DB: foodorder_db
      POSTGRES_USER: foodadmin
      POSTGRES_PASSWORD: foodpass123
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432

  # Frontend (Next.js)
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [backend]
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8001
```

### 10.2 Container Build Process

**Backend Container:**
1. Base image: `python:3.12-slim`
2. Install system dependencies (postgresql-client)
3. Copy requirements.txt and install packages
4. Copy application code
5. Run migrations on startup
6. Start Django + FastAPI via supervisord

**Frontend Container:**
1. Base image: `node:20-alpine`
2. Copy package files and install dependencies
3. Copy application code
4. Build Next.js app (`next build`)
5. Start production server (`next start`)

### 10.3 Network Communication

```
Browser ──HTTP──> Next.js (port 3000)
                    │
                    └──Docker Network──> FastAPI (port 8001)
                                            │
                                            └──SQL──> PostgreSQL (port 5432)
```

**Internal Hostnames:**
- `postgres` - Database container
- `backend` - Python container
- `app` - Next.js container

### 10.4 Volume Management

```yaml
volumes:
  postgres_data:  # Persistent database storage
```

**Data Persistence:**
- Database data persists across container restarts
- Application code mounted from host (development)
- Logs written to container stdout (Docker logs)

### 10.5 Startup Order

```
1. PostgreSQL starts → Wait for healthy
   ↓
2. Backend starts → Run migrations → Seed data → Start Django + FastAPI
   ↓
3. Frontend starts → Build (if needed) → Start Next.js server
```

---

## Appendices

### A. File Structure Overview

```
Slooze-V2/
├── app/                    # Next.js pages and API routes
├── backend/                # Python backend (Django + FastAPI)
├── components/             # React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
├── styles/                 # Global styles
├── docker-compose.yml      # Container orchestration
├── Dockerfile              # Frontend container build
├── package.json            # Node dependencies
├── tsconfig.json           # TypeScript config
├── next.config.mjs         # Next.js config
├── README.md               # Project documentation
├── BACKEND_API.md          # API reference
├── ARCHITECTURE.md         # This file
├── API_COLLECTION.md       # Postman collection
├── DEPLOYMENT.md           # Deployment guide
└── DATASET.md              # Seeded data reference
```

### B. Development Workflow

1. Clone repository
2. Run `docker compose up -d`
3. Access frontend at http://localhost:3000
4. Access Django admin at http://localhost:8000/admin
5. View API docs at http://localhost:8001/docs
6. Make changes to code (auto-reload enabled)
7. Test with provided user accounts
8. Commit changes with conventional commits

### C. Future Enhancements

**Security:**
- Add bcrypt password hashing
- Implement Redis session store
- Add rate limiting middleware
- Enable HTTPS with SSL certificates
- Add CSRF protection

**Features:**
- Real-time order tracking (WebSockets)
- Email notifications (order confirmation)
- Restaurant reviews and ratings
- Advanced search and filtering
- Multi-language support

**Performance:**
- Add Redis caching layer
- Implement CDN for static assets
- Database query optimization
- API response caching
- Load balancing with multiple backend instances

**DevOps:**
- CI/CD pipeline (GitHub Actions)
- Automated testing (Jest + Pytest)
- Monitoring and logging (Sentry, DataDog)
- Kubernetes deployment
- Automated backups

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Author:** Slooze Development Team
