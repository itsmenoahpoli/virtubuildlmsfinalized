# VirtuBuild

<div align="center">

## Tech Stack

<table align="center">
<tr>
<td align="center" width="120">
<img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="Angular" width="80" height="80" />
<br />
<strong>Angular</strong>
<br />
<sub>19.1.0</sub>
</td>
<td align="center" width="120">
<img src="https://nodejs.org/static/images/logo.svg" alt="Node.js" width="80" height="80" />
<br />
<strong>Node.js</strong>
<br />
<sub>20+</sub>
</td>
<td align="center" width="120">
<img src="https://www.typescriptlang.org/images/logos/typescript-logo-round.svg" alt="TypeScript" width="80" height="80" />
<br />
<strong>TypeScript</strong>
<br />
<sub>5.7</sub>
</td>
<td align="center" width="120">
<img src="https://www.postgresql.org/media/img/about/press/elephant.png" alt="PostgreSQL" width="80" height="80" />
<br />
<strong>PostgreSQL</strong>
<br />
<sub>15</sub>
</td>
<td align="center" width="120">
<img src="https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.svg" alt="Docker" width="80" height="80" />
<br />
<strong>Docker</strong>
<br />
<sub>20+</sub>
</td>
</tr>
</table>

**A comprehensive full-stack application for virtual building and construction management**

![Angular](https://img.shields.io/badge/Angular-19.1.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-20+-2496ED?style=for-the-badge&logo=docker&logoColor=white)

[Getting Started](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📚 Documentation Navigation

Welcome to the VirtuBuild documentation hub. This README serves as a central navigation point for all project documentation.

### 📖 Main Documentation

| Document | Description | Link |
|----------|-------------|------|
| **Tech Stack & Environment** | Complete guide to technologies, prerequisites, frameworks, libraries, and environment setup (Docker & Localhost) | [📘 TECH_STACK.md](./docs/TECH_STACK.md) |
| **Docker Setup Guide** | Comprehensive Docker-focused setup, management, and troubleshooting guide | [🐳 DOCKER_SETUP_GUIDE.md](./docs/DOCKER_SETUP_GUIDE.md) |
| **Frontend Application** | Angular application documentation with sitemap, features, and development guide | [📱 APP_README.md](./docs/APP_README.md) |
| **Backend API** | Node.js/Express API documentation with endpoints, database management, and configuration | [🔌 API_README.md](./docs/API_README.md) |
| **Docker Overview** | Basic Docker setup and deployment guide | [🐳 DOCKER_README.md](./DOCKER_README.md) |

### 🗺️ Application Sitemap

#### Public Pages
- **Sign In** (`/signin`) - User authentication
- **Forgot Password** (`/forgot-password`) - Password recovery
- **Reset Password** (`/reset-password`) - Password reset
- **About Us** (`/about-us`) - About information
- **Contact** (`/contact`) - Contact information

#### Student Pages
- **Dashboard** (`/student`) - Student overview
- **Activities** (`/student/activities`) - View and launch activities
- **Simulation** (`/student/simulation/:activityId`) - PC assembly simulation
- **Assessments** (`/student/assessments`) - View and submit assessments
- **Grades** (`/student/grades`) - View grades and performance
- **Analytics** (`/student/analytics`) - Performance analytics
- **Progress** (`/student/progress`) - Track learning progress

#### Instructor Pages
- **Dashboard** (`/instructor`) - Instructor overview
- **Laboratory Activities** (`/instructor/laboratories`) - Manage lab activities
- **Modules** (`/instructor/manage-modules`) - Manage learning modules
- **Assessments** (`/instructor/assessments`) - Manage assessments
- **Student Grades** (`/instructor/grades`) - Manage and view student grades
- **Student Groups** (`/instructor/student-groups`) - Manage student groups
- **My Account** (`/instructor/my-account`) - Account settings

#### Admin Pages
- **Dashboard** (`/admin`) - Admin overview
- **Users** (`/admin/users`) - User management
- **Instructors** (`/admin/instructors`) - Instructor management
- **Students** (`/admin/students`) - Student management
- **Student Groups** (`/admin/student-groups`) - Group management
- **Modules** (`/admin/modules`) - Module management
- **Lab Activities** (`/admin/lab-activities`) - Activity management
- **Assessments** (`/admin/assessments`) - Assessment management
- **Contents** (`/admin/contents`) - Content management hub
- **Grades** (`/admin/grades`) - Grade management
- **User Roles** (`/admin/user-roles`) - Role management

For detailed sitemap, see [APP_README.md - Application Sitemap](./docs/APP_README.md#application-sitemap).

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18+ (recommended: v20+)
- **npm**: v9+
- **Docker**: v20+ with Docker Compose (optional)
- **PostgreSQL**: v15+ (if running locally)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd virtubuildallapp-repo
   ```

2. **Setup environment files**:
   ```bash
   cp env.example .env
   cp virtubuild-api/env.example virtubuild-api/.env
   cp virtubuildapp/env.example virtubuildapp/.env
   ```

3. **Choose your setup method**:

   **Option A: Docker (Recommended)**
   ```bash
   docker-compose up --build
   ```

   **Option B: Local Development**
   ```bash
   # Start database (Docker)
   docker-compose up -d postgres pgadmin
   
   # Backend
   cd virtubuild-api
   npm install
   npm run db:setup
   npm run dev
   
   # Frontend (new terminal)
   cd virtubuildapp
   npm install
   npm start
   ```

4. **Access the application**:
   - **Frontend**: http://localhost:4200
   - **Backend API**: http://localhost:9000
   - **API Docs**: http://localhost:9000/api-docs
   - **pgAdmin**: http://localhost:5050

For detailed setup instructions, see:
- [TECH_STACK.md - Environment Setup](./docs/TECH_STACK.md#environment-setup)
- [DOCKER_README.md](./DOCKER_README.md)

## 🛠️ Tech Stack

### Frontend
- **Angular** 19.1.0 - Web framework
- **TypeScript** 5.7.2 - Type-safe JavaScript
- **Angular Material** 19.2.14 - UI components
- **Taiga UI** 4.38.0 - Comprehensive UI kit
- **NgRx** 19.2.0 - State management
- **Tailwind CSS** 4.1.5 - Utility-first CSS
- **Vite** - Build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** 4.21.2 - Web framework
- **TypeScript** 5.7.3 - Type-safe JavaScript
- **TypeORM** 0.3.20 - ORM
- **PostgreSQL** 15 - Database
- **JWT** - Authentication
- **Swagger** - API documentation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL** - Database
- **pgAdmin** - Database management

For complete tech stack details, see [TECH_STACK.md](./docs/TECH_STACK.md).

## 📁 Project Structure

```
virtubuildallapp-repo/
├── docs/                      # Documentation
│   ├── TECH_STACK.md         # Tech stack & environment guide
│   ├── APP_README.md         # Frontend application docs
│   └── API_README.md        # Backend API docs
├── virtubuildapp/            # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Core services & guards
│   │   │   ├── features/     # Feature modules
│   │   │   └── shared/        # Shared components
│   │   └── environments/     # Environment configs
│   └── package.json
├── virtubuild-api/           # Node.js Backend
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   ├── database/         # Database entities & migrations
│   │   ├── middlewares/      # Express middlewares
│   │   └── routers/          # Route definitions
│   └── package.json
├── init-scripts/             # Database initialization
├── scripts/                  # Utility scripts
├── docker-compose.yml        # Docker services
├── Dockerfile               # Main Docker image
└── README.md                # This file
```

## 🔧 Available Commands

### Docker Commands

```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Development Commands

**Backend**:
```bash
cd virtubuild-api
npm run dev        # Start development server
npm run build      # Build for production
npm run db:setup   # Setup database
```

**Frontend**:
```bash
cd virtubuildapp
npm start          # Start development server
npm run build      # Build for production
```

For more commands, see:
- [API_README.md - Available Scripts](./docs/API_README.md#available-scripts)
- [APP_README.md - Available Scripts](./docs/APP_README.md#available-scripts)

## 📖 Documentation Guide

### For Developers

1. **New to the project?** Start with [TECH_STACK.md](./docs/TECH_STACK.md) for environment setup
2. **Working on frontend?** See [APP_README.md](./docs/APP_README.md) for Angular app structure
3. **Working on backend?** See [API_README.md](./docs/API_README.md) for API endpoints
4. **Setting up Docker?** See [DOCKER_SETUP_GUIDE.md](./docs/DOCKER_SETUP_GUIDE.md) for a comprehensive container setup guide

### For Users

1. **Application Features**: See [APP_README.md - Features](./docs/APP_README.md#features)
2. **Application Sitemap**: See [APP_README.md - Application Sitemap](./docs/APP_README.md#application-sitemap)
3. **API Documentation**: Access Swagger UI at http://localhost:9000/api-docs

## 🔐 Authentication & Security

- **JWT-based authentication**
- **Role-based access control** (Student, Instructor, Admin)
- **Password hashing** with Argon2
- **Security headers** with Helmet
- **CORS** configuration
- **Rate limiting** protection

For security details, see [API_README.md - Authentication](./docs/API_README.md#authentication).

## 🗄️ Database

- **PostgreSQL** 15
- **TypeORM** for database management
- **Migrations** for schema versioning
- **Seeders** for initial data

For database commands, see [API_README.md - Database Management](./docs/API_README.md#database-management).

## 🧪 Testing

### Backend Tests
```bash
cd virtubuild-api
npm test              # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Frontend Tests
```bash
cd virtubuildapp
npm test              # Run tests
```

## 📦 Deployment

### Docker Deployment
```bash
docker-compose up --build -d
```

### Manual Deployment
1. Build backend: `cd virtubuild-api && npm run build`
2. Build frontend: `cd virtubuildapp && npm run build`
3. Configure production environment variables
4. Start services with PM2 or similar

For detailed deployment, see [TECH_STACK.md - Deployment](./docs/TECH_STACK.md#deployment).

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Use Prettier for code formatting
3. Write meaningful commit messages
4. Create feature branches from `develop`
5. Ensure all tests pass before submitting PR

### Code Style

- **Backend**: ESLint + Prettier
- **Frontend**: Angular Style Guide + Prettier
- **Commit Messages**: Conventional Commits format

## 📞 Support

- **Documentation**: Check the [docs](./docs/) directory
- **API Documentation**: http://localhost:9000/api-docs
- **Issues**: Create GitHub issues for bugs and feature requests

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">

**VirtuBuild** - Virtual Building and Construction Management Platform

Built with ❤️ using Angular, Node.js, TypeScript, PostgreSQL, and Docker

</div>
