# Slooze V2 - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 1. Prerequisites

### Required Software
| Software | Version | Purpose |
|----------|---------|---------|
| Docker | 20.10+ | Container runtime |
| Docker Compose | 2.0+ | Multi-container orchestration |
| Git | 2.0+ | Version control |
| Node.js | 20+ (optional) | Local development |
| pnpm/npm | Latest (optional) | Frontend package manager |

### System Requirements
- **CPU:** 2+ cores
- **RAM:** 4GB minimum, 8GB recommended
- **Disk:** 10GB free space
- **OS:** Windows 10/11, macOS, or Linux
- **Ports Required:** 3000, 8000, 8001, 5432

### Network Requirements
- Internet access for pulling Docker images
- Localhost access for development
- Firewall: Allow ports 3000, 8000, 8001, 5432

---

## 2. Local Development Setup

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/slooze-v2.git
cd slooze-v2
```

### Step 2: Verify Docker Installation

**Windows (PowerShell):**
```powershell
docker --version
docker compose version

# Should output:
# Docker version 24.0.0+
# Docker Compose version v2.20.0+
```

**macOS/Linux:**
```bash
docker --version
docker-compose --version
```

### Step 3: Check Port Availability

**Windows (PowerShell):**
```powershell
# Check if ports are in use
Test-NetConnection -ComputerName localhost -Port 3000
Test-NetConnection -ComputerName localhost -Port 8000
Test-NetConnection -ComputerName localhost -Port 8001
Test-NetConnection -ComputerName localhost -Port 5432

# If any port is in use, stop the conflicting service
```

**macOS/Linux:**
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :8000
lsof -i :8001
lsof -i :5432
```

---

## 3. Docker Deployment

### Quick Start (Recommended)

**Windows (PowerShell):**
```powershell
# Navigate to project directory
cd "d:\Parama Pri\Slooze-V2"

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop services (when done)
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

**macOS/Linux:**
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Fresh start
docker-compose down -v
```

### Step-by-Step Deployment

#### 1. Build Containers

```powershell
# Build without cache (fresh build)
docker compose build --no-cache

# Build with cache (faster)
docker compose build
```

#### 2. Start Services in Order

```powershell
# Start database first
docker compose up -d postgres

# Wait 10 seconds for database to initialize
Start-Sleep -Seconds 10

# Start backend (will run migrations)
docker compose up -d backend

# Wait for backend to be ready
Start-Sleep -Seconds 15

# Start frontend
docker compose up -d app
```

#### 3. Verify Services

```powershell
# Check all containers are running
docker compose ps

# Should show:
# NAME                IMAGE               STATUS
# slooze-postgres     postgres:15-alpine  Up
# slooze-backend      slooze-backend      Up
# slooze-app          slooze-app          Up

# Check logs for errors
docker compose logs backend --tail=50
docker compose logs app --tail=50
```

#### 4. Access Application

Open your browser:
- **Frontend:** http://localhost:3000
- **Django Admin:** http://localhost:8000/admin
- **FastAPI Docs:** http://localhost:8001/docs
- **FastAPI Health:** http://localhost:8001/health

---

## 4. Database Setup

### Automatic Setup (Default)

The backend container automatically:
1. Waits for PostgreSQL to be ready
2. Runs Django migrations
3. Seeds initial data (users, restaurants, menus)

### Manual Migration (if needed)

```powershell
# Access backend container
docker compose exec backend bash

# Inside container:
cd /app
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Exit container
exit
```

### Database Inspection

```powershell
# Access PostgreSQL
docker compose exec postgres psql -U foodadmin -d foodorder_db

# Inside psql:
\dt                          # List tables
SELECT * FROM api_user;      # View users
SELECT * FROM api_restaurant; # View restaurants
\q                           # Quit
```

### Reset Database

```powershell
# Stop all services
docker compose down

# Remove database volume
docker volume rm slooze-v2_postgres_data

# Restart services (will recreate database)
docker compose up -d
```

---

## 5. Environment Configuration

### Docker Compose Environment Variables

Edit `docker-compose.yml`:

```yaml
services:
  postgres:
    environment:
      POSTGRES_DB: foodorder_db       # Database name
      POSTGRES_USER: foodadmin         # Database user
      POSTGRES_PASSWORD: foodpass123   # Database password

  backend:
    environment:
      POSTGRES_DB: foodorder_db
      POSTGRES_USER: foodadmin
      POSTGRES_PASSWORD: foodpass123
      POSTGRES_HOST: postgres          # Container hostname
      POSTGRES_PORT: 5432
      DEBUG: "True"                    # Django debug mode

  app:
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8001  # Backend URL
      NODE_ENV: production
```

### Backend Environment (Django Settings)

Edit `backend/django_project/settings.py`:

```python
# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'foodorder_db'),
        'USER': os.environ.get('POSTGRES_USER', 'foodadmin'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'foodpass123'),
        'HOST': os.environ.get('POSTGRES_HOST', 'postgres'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    # Add production domain
]

# Security settings (PRODUCTION ONLY)
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-secret-key')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'backend']
```

### Frontend Environment (Next.js)

Create `.env.local` (optional):

```bash
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8001

# Enable debug mode
NEXT_PUBLIC_DEBUG=true
```

---

## 6. Troubleshooting

### Common Issues

#### Issue 1: Port Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solution (Windows):**
```powershell
# Find process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill process (replace PID)
Stop-Process -Id <PID> -Force

# Or change port in docker-compose.yml
```

**Solution (macOS/Linux):**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

#### Issue 2: Database Connection Failed

**Error:**
```
django.db.utils.OperationalError: could not connect to server
```

**Solution:**
```powershell
# Check if postgres is running
docker compose ps postgres

# View postgres logs
docker compose logs postgres

# Restart postgres
docker compose restart postgres

# Wait 10 seconds before restarting backend
Start-Sleep -Seconds 10
docker compose restart backend
```

---

#### Issue 3: Frontend Build Failed

**Error:**
```
Error: Cannot find module 'next'
```

**Solution:**
```powershell
# Rebuild frontend container
docker compose build --no-cache app

# Or install dependencies locally
cd "d:\Parama Pri\Slooze-V2"
pnpm install

# Then rebuild
docker compose up -d --build app
```

---

#### Issue 4: Migrations Not Applied

**Error:**
```
django.db.utils.ProgrammingError: relation "api_user" does not exist
```

**Solution:**
```powershell
# Access backend container
docker compose exec backend bash

# Run migrations manually
python manage.py migrate

# Verify tables exist
python manage.py dbshell
\dt
\q
exit
```

---

#### Issue 5: CORS Errors

**Error:**
```
Access to fetch at 'http://localhost:8001' blocked by CORS policy
```

**Solution:**
1. Check `backend/fastapi_app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. Restart backend:
```powershell
docker compose restart backend
```

---

### Viewing Logs

```powershell
# View all logs
docker compose logs

# View specific service logs
docker compose logs backend
docker compose logs app
docker compose logs postgres

# Follow logs in real-time
docker compose logs -f backend

# View last 100 lines
docker compose logs backend --tail=100

# View logs with timestamps
docker compose logs backend --timestamps
```

---

### Container Shell Access

```powershell
# Access backend container
docker compose exec backend bash

# Access frontend container
docker compose exec app sh

# Access postgres container
docker compose exec postgres bash

# Inside container, check environment
env | grep POSTGRES
```

---

## 7. Production Deployment

### ⚠️ Security Checklist

**BEFORE deploying to production:**

- [ ] Change all default passwords
- [ ] Enable HTTPS (SSL certificates)
- [ ] Use environment variables for secrets
- [ ] Disable Django DEBUG mode
- [ ] Use Redis for session storage (replace in-memory)
- [ ] Add rate limiting middleware
- [ ] Configure CORS for production domain only
- [ ] Use bcrypt for password hashing
- [ ] Add CSRF protection
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Use secrets management (AWS Secrets Manager, etc.)

### Environment Variables (Production)

Create `.env` file:

```bash
# Database
POSTGRES_DB=foodorder_prod
POSTGRES_USER=foodadmin_prod
POSTGRES_PASSWORD=CHANGE_THIS_STRONG_PASSWORD
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Django
DJANGO_SECRET_KEY=CHANGE_THIS_LONG_RANDOM_SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# FastAPI
API_SECRET_KEY=CHANGE_THIS_SECRET_KEY

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Docker Compose (Production)

Edit `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups  # Backup location
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    networks:
      - backend

  redis:
    image: redis:7-alpine
    restart: always
    networks:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    depends_on:
      - postgres
      - redis
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_HOST: postgres
      REDIS_URL: redis://redis:6379
      DJANGO_SECRET_KEY: ${DJANGO_SECRET_KEY}
      DEBUG: ${DEBUG}
      ALLOWED_HOSTS: ${ALLOWED_HOSTS}
    networks:
      - backend

  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    restart: always
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NODE_ENV: production
    networks:
      - backend

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl  # SSL certificates
    depends_on:
      - app
      - backend
    networks:
      - backend

networks:
  backend:
    driver: bridge

volumes:
  postgres_data:
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server app:3000;
    }

    upstream backend {
        server backend:8001;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Deploy to Production

```bash
# Load environment variables
export $(cat .env | xargs)

# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Collect static files
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

# Create superuser
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## 8. Monitoring & Maintenance

### Health Checks

```powershell
# Check API health
Invoke-RestMethod -Uri 'http://localhost:8001/health'

# Check all services
docker compose ps

# Check resource usage
docker stats

# Check disk usage
docker system df
```

### Database Backups

```powershell
# Create backup
docker compose exec postgres pg_dump -U foodadmin foodorder_db > backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql

# Restore from backup
Get-Content backup_20251206_103000.sql | docker compose exec -T postgres psql -U foodadmin -d foodorder_db
```

### Log Rotation

```powershell
# View log sizes
docker compose logs --tail=0 2>&1 | Measure-Object -Line

# Clear logs (be careful!)
docker compose down
docker system prune -a --volumes
docker compose up -d
```

### Container Updates

```powershell
# Pull latest images
docker compose pull

# Rebuild and restart
docker compose up -d --build

# Remove old images
docker image prune -a
```

### Performance Monitoring

```powershell
# Real-time stats
docker stats --no-stream

# Container resource limits
docker compose exec backend cat /sys/fs/cgroup/memory/memory.limit_in_bytes
```

---

## Quick Reference

### Common Commands

| Action | Command |
|--------|---------|
| Start services | `docker compose up -d` |
| Stop services | `docker compose down` |
| Restart service | `docker compose restart <service>` |
| View logs | `docker compose logs -f <service>` |
| Shell access | `docker compose exec <service> bash` |
| Rebuild container | `docker compose up -d --build <service>` |
| Check status | `docker compose ps` |
| Remove volumes | `docker compose down -v` |

### Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Django Admin | http://localhost:8000/admin |
| FastAPI Docs | http://localhost:8001/docs |
| API Health | http://localhost:8001/health |
| PostgreSQL | localhost:5432 |

### Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| PostgreSQL | foodadmin | foodpass123 |
| Admin User | nickfury@admin.com | admin123 |
| Manager (India) | captainmarvel@manager.com | manager123 |
| Manager (USA) | captainamerica@manager.com | manager123 |
| Member (India) | thanos@member.com | member123 |

---

## Support

For issues or questions:
1. Check logs: `docker compose logs -f`
2. Review troubleshooting section above
3. Check GitHub issues
4. Contact development team

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Author:** Slooze Development Team
