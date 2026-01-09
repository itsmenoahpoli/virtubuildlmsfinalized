# 🐳 Docker Focused Setup Guide

This guide provides comprehensive instructions for setting up, managing, and deploying the VirtuBuild platform using Docker.

## 📋 Overview

VirtuBuild uses Docker and Docker Compose to orchestrate its multi-service architecture, ensuring consistent environments across development and production.

### Services
- **`virtubuild-frontend`**: Angular 19 application served via Nginx (Port 4200)
- **`virtubuild-api`**: Node.js/Express API (Port 9000)
- **`postgres`**: PostgreSQL 15 database (Port 5432)
- **`pgadmin`**: Web-based PostgreSQL administration tool (Port 5050)

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Docker**: v20.10.0+
- **Docker Compose**: v2.0.0+
- **Git**: For repository cloning

---

## 🚀 Quick Start

Follow these steps to get the entire platform running in minutes.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd virtubuildallapp-repo
```

### 2. Initialize Environment Variables
Run the setup script to copy all `.env.example` files to `.env`:
```bash
chmod +x setup-env.sh
./setup-env.sh
```
*Alternatively, manual copy:*
```bash
cp env.example .env
cp virtubuild-api/env.example virtubuild-api/.env
cp virtubuildapp/env.example virtubuildapp/.env
```

### 3. Launch the Platform
```bash
docker-compose up --build
```
Once the containers are healthy, access the services:
- **Frontend**: [http://localhost:4200](http://localhost:4200)
- **API**: [http://localhost:9000](http://localhost:9000)
- **API Docs**: [http://localhost:9000/api-docs](http://localhost:9000/api-docs)
- **pgAdmin**: [http://localhost:5050](http://localhost:5050)

---

## ⚙️ Environment Configuration

The setup uses three primary `.env` files for fine-grained control:

### 1. Root `.env`
Controls database credentials and pgAdmin access.
| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database username | `virtubuild` |
| `POSTGRES_PASSWORD` | Database password | `virtubuild123` |
| `POSTGRES_DB` | Database name | `virtubuild_db` |

### 2. API `.env` (`virtubuild-api/.env`)
Controls backend behavior and database connectivity.
| Variable | Description |
|----------|-------------|
| `APP_DB_HOST` | Set to `postgres` for Docker |
| `JWT_SECRET` | Secret key for token signing |
| `API_KEY` | Key for protected endpoints |

### 3. Frontend `.env` (`virtubuildapp/.env`)
Controls Angular application environment.
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | URL of the API (usually `http://localhost:9000/api`) |

---

## 🗄️ Database Management

### Connecting with pgAdmin
1. Open [http://localhost:5050](http://localhost:5050).
2. Login with `admin@virtubuild.com` / `admin123` (default).
3. Right-click 'Servers' -> 'Register' -> 'Server...'.
4. **General Tab**: Name it "VirtuBuild".
5. **Connection Tab**:
   - **Host**: `postgres` (internal Docker name)
   - **Port**: `5432`
   - **Username**: `virtubuild`
   - **Password**: `virtubuild123`

### Migrations & Seeding
To run database commands within the running container:
```bash
# Enter the API container
docker exec -it virtubuild-api sh

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

---

## 🛠️ Common Commands

| Task | Command |
|------|---------|
| Start all services (detached) | `docker-compose up -d` |
| Stop all services | `docker-compose down` |
| Stop and remove volumes | `docker-compose down -v` |
| View real-time logs | `docker-compose logs -f` |
| View specific service logs | `docker-compose logs -f virtubuild-api` |
| Rebuild after changes | `docker-compose up --build` |

---

## 🔍 Troubleshooting

### Port Conflicts
If you see `Bind for 0.0.0.0:5432 failed`, a local PostgreSQL instance is likely running.
- **Solution**: Stop your local service or change the host port in `docker-compose.yml`.

### Database Connection Refused
The API might start before the database is ready.
- **Solution**: We use `depends_on` with `service_healthy`, but if it fails, try restarting the API: `docker-compose restart virtubuild-api`.

### Permission Issues
On Linux, Docker volumes might have permission issues.
- **Solution**: Ensure your user is in the `docker` group or use `sudo`.

---

## 📦 Production Notes

For production deployments:
1. Change all default passwords in `.env` files.
2. Ensure `NODE_ENV=production` is set in the API.
3. Use a proper SSL certificate (e.g., via Nginx reverse proxy).
4. Remove the `pgadmin` service if not needed for production debugging.
