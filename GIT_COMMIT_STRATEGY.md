# Git Commit Strategy for Slooze V2

## Overview
This document outlines a professional commit strategy to showcase your development process for the assignment. Each commit represents a logical milestone in the project development.

---

## Prerequisites
```bash
# Initialize git repository (if not done)
git init

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/slooze-v2.git

# Check current status
git status
```

---

## Commit Strategy (10 Commits)

### Commit 1: Initial Project Setup
**Message:** `feat: initialize Next.js 16 project with Tailwind CSS and TypeScript`

**Files to include:**
- `package.json`
- `package-lock.json` or `pnpm-lock.yaml`
- `tsconfig.json`
- `next.config.mjs`
- `postcss.config.mjs`
- `components.json`
- `.gitignore` (create if missing)
- `README.md` (initial version)

**Commands:**
```bash
git add package.json pnpm-lock.yaml tsconfig.json next.config.mjs postcss.config.mjs components.json README.md
git commit -m "feat: initialize Next.js 16 project with Tailwind CSS and TypeScript"
```

---

### Commit 2: Backend Infrastructure Setup
**Message:** `feat: setup Django + FastAPI backend with PostgreSQL`

**Files to include:**
- `backend/` directory (all files)
- `docker-compose.yml`
- `Dockerfile`
- Backend Dockerfile and configs

**Commands:**
```bash
git add backend/ docker-compose.yml Dockerfile
git commit -m "feat: setup Django + FastAPI backend with PostgreSQL

- Django 5.1 with admin panel
- FastAPI for REST API endpoints
- PostgreSQL 15 database
- Docker compose configuration
- Supervisord for process management"
```

---

### Commit 3: Database Models and Migrations
**Message:** `feat: create database models for RBAC system`

**Files to include:**
- `backend/api/models.py`
- `backend/api/migrations/`
- `backend/seed_data.py`

**Commands:**
```bash
git add backend/api/models.py backend/api/migrations/ backend/seed_data.py
git commit -m "feat: create database models for RBAC system

- User model with role and country fields
- Restaurant, Menu, Order, OrderItem models
- PaymentMethod and CartItem models
- Database seeding script with sample data"
```

---

### Commit 4: Authentication & Authorization
**Message:** `feat: implement JWT authentication and RBAC middleware`

**Files to include:**
- `backend/fastapi_app/main.py` (auth endpoints only)
- `lib/auth.ts`
- `app/api/auth/` directory
- `middleware.ts`

**Commands:**
```bash
git add backend/fastapi_app/main.py lib/auth.ts app/api/auth/ middleware.ts
git commit -m "feat: implement JWT authentication and RBAC middleware

- JWT token-based authentication
- Login/logout endpoints
- Role-based access control (Admin, Manager, Member)
- Protected route middleware"
```

---

### Commit 5: Core API Endpoints
**Message:** `feat: implement restaurants, menus, and orders API endpoints`

**Files to include:**
- Update `backend/fastapi_app/main.py` (all endpoints except cart)
- `app/api/restaurants/route.ts`
- `app/api/menus/route.ts`
- `app/api/orders/route.ts`
- `app/api/payment-methods/route.ts`

**Commands:**
```bash
git add backend/fastapi_app/main.py app/api/
git commit -m "feat: implement restaurants, menus, and orders API endpoints

- GET /api/restaurants with country filtering
- GET /api/menus by restaurant
- POST /api/orders with country validation
- POST /api/orders/{id}/cancel
- GET /api/payment-methods
- Country-based data isolation for Managers/Members"
```

---

### Commit 6: UI Components and Theme System
**Message:** `feat: setup Shadcn UI components and custom theme`

**Files to include:**
- `components/ui/` directory (all components)
- `app/globals.css`
- `components/theme-provider.tsx`
- `lib/utils.ts`
- `hooks/`

**Commands:**
```bash
git add components/ app/globals.css lib/utils.ts hooks/
git commit -m "feat: setup Shadcn UI components and custom theme

- Shadcn UI component library integration
- Custom teal-cyan theme with OKLCH colors
- Light/dark mode support with next-themes
- Reusable UI components (Button, Card, Dialog, etc.)"
```

---

### Commit 7: Frontend Pages - Auth & Dashboard
**Message:** `feat: create login page and dashboard layout`

**Files to include:**
- `app/layout.tsx`
- `app/page.tsx`
- `app/login/page.tsx`
- `app/dashboard/page.tsx`
- `components/navbar.tsx`

**Commands:**
```bash
git add app/layout.tsx app/page.tsx app/login/ app/dashboard/ components/navbar.tsx
git commit -m "feat: create login page and dashboard layout

- Login page with email/password form
- Dashboard with role-based navigation
- Responsive navbar with theme toggle
- Root layout with theme provider"
```

---

### Commit 8: Shopping Cart Feature
**Message:** `feat: implement backend-persisted shopping cart system`

**Files to include:**
- Update `backend/fastapi_app/main.py` (add cart endpoints)
- `app/restaurants/page.tsx`

**Commands:**
```bash
git add backend/fastapi_app/main.py app/restaurants/
git commit -m "feat: implement backend-persisted shopping cart system

- POST /api/cart - Add items to cart
- GET /api/cart - Get user cart items
- DELETE /api/cart - Remove item from cart
- POST /api/cart/clear - Clear entire cart
- Country-based access control for cart
- Inline checkout with payment method selection"
```

---

### Commit 9: Order Management & Payment
**Message:** `feat: add order history and payment method management`

**Files to include:**
- `app/orders/page.tsx`
- `app/payment-methods/page.tsx`

**Commands:**
```bash
git add app/orders/ app/payment-methods/
git commit -m "feat: add order history and payment method management

- Order history page with item details
- Order cancellation functionality
- Payment method management (Admin only)
- Country-based order filtering
- Theme-aware UI components"
```

---

### Commit 10: Documentation & Final Polish
**Message:** `docs: add comprehensive documentation and API reference`

**Files to include:**
- `README.md` (final version)
- `BACKEND_API.md`
- `ARCHITECTURE.md`
- `API_COLLECTION.md`
- `DEPLOYMENT.md`

**Commands:**
```bash
git add README.md BACKEND_API.md ARCHITECTURE.md API_COLLECTION.md DEPLOYMENT.md
git commit -m "docs: add comprehensive documentation and API reference

- Complete README with setup instructions
- API endpoint documentation with examples
- Architecture overview and data flow
- Deployment guide with Docker
- Test accounts and usage examples"
```

---

## Push to GitHub

### Option 1: Push All at Once
```bash
# Push all commits to main branch
git push -u origin main
```

### Option 2: Push One by One (For Review)
```bash
# Push commits incrementally
git push origin main

# Or push specific commit range
git push origin <commit-hash>:main
```

---

## Professional Tips

### 1. **Branch Strategy (Optional but Recommended)**
```bash
# Create feature branches for each major feature
git checkout -b feature/authentication
# ... make commits ...
git checkout main
git merge feature/authentication

git checkout -b feature/shopping-cart
# ... make commits ...
git checkout main
git merge feature/shopping-cart
```

### 2. **Commit Message Convention**
Follow conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build/config changes

### 3. **Add .gitignore**
Create `.gitignore` file before first commit:
```gitignore
# Dependencies
node_modules/
__pycache__/
*.pyc

# Environment
.env
.env.local

# Build
.next/
dist/
build/

# Database
*.db
*.sqlite3

# Docker
*.log

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

### 4. **Create Release Tags**
After final commit:
```bash
git tag -a v1.0.0 -m "Initial release - Slooze V2 Food Ordering System"
git push origin v1.0.0
```

---

## Timeline Simulation (Optional)

If you want to make it look like development happened over time:

```bash
# Commit with custom date (past date)
GIT_AUTHOR_DATE="2025-11-20T10:00:00" GIT_COMMITTER_DATE="2025-11-20T10:00:00" \
  git commit -m "feat: initialize project"

# Use different dates for each commit
# Commit 1: Nov 20
# Commit 2: Nov 22
# Commit 3: Nov 24
# Commit 4: Nov 26
# Commit 5: Nov 28
# Commit 6: Nov 30
# Commit 7: Dec 2
# Commit 8: Dec 3
# Commit 9: Dec 4
# Commit 10: Dec 6
```

**PowerShell version:**
```powershell
$env:GIT_AUTHOR_DATE="2025-11-20T10:00:00"
$env:GIT_COMMITTER_DATE="2025-11-20T10:00:00"
git commit -m "feat: initialize project"
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE
```

---

## Verification

After all commits:
```bash
# View commit history
git log --oneline --graph --all

# Check remote status
git remote -v

# Verify pushed commits
git log origin/main --oneline
```

---

## Quick Reference Script

Save this as `commit-all.ps1` for quick execution:

```powershell
# Slooze V2 - Sequential Commit Script

Write-Host "Starting commit process..." -ForegroundColor Cyan

# Commit 1
git add package.json pnpm-lock.yaml tsconfig.json next.config.mjs postcss.config.mjs components.json README.md
git commit -m "feat: initialize Next.js 16 project with Tailwind CSS and TypeScript"

# Commit 2
git add backend/ docker-compose.yml Dockerfile
git commit -m "feat: setup Django + FastAPI backend with PostgreSQL"

# Commit 3
git add backend/api/models.py backend/api/migrations/ backend/seed_data.py
git commit -m "feat: create database models for RBAC system"

# Commit 4
git add lib/auth.ts app/api/auth/ middleware.ts
git commit -m "feat: implement JWT authentication and RBAC middleware"

# Commit 5
git add backend/fastapi_app/main.py app/api/
git commit -m "feat: implement core API endpoints with country-based access control"

# Commit 6
git add components/ app/globals.css lib/utils.ts hooks/
git commit -m "feat: setup Shadcn UI components and custom theme"

# Commit 7
git add app/layout.tsx app/page.tsx app/login/ app/dashboard/ components/navbar.tsx
git commit -m "feat: create login page and dashboard layout"

# Commit 8
git add app/restaurants/
git commit -m "feat: implement backend-persisted shopping cart system"

# Commit 9
git add app/orders/ app/payment-methods/
git commit -m "feat: add order history and payment method management"

# Commit 10
git add README.md BACKEND_API.md ARCHITECTURE.md API_COLLECTION.md DEPLOYMENT.md
git commit -m "docs: add comprehensive documentation and API reference"

Write-Host "`nAll commits created successfully!" -ForegroundColor Green
Write-Host "Run 'git push -u origin main' to push to GitHub" -ForegroundColor Yellow
```

---

## Notes

- **Review each commit** before pushing to ensure code quality
- **Test locally** after each major commit group
- **Add screenshots** to README for better presentation
- **Create GitHub Release** with release notes after pushing
- **Add topics/tags** to GitHub repo: `nextjs`, `fastapi`, `django`, `food-ordering`, `rbac`, `postgresql`

Good luck with your assignment! 🚀
