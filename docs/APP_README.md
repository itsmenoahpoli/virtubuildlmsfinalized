# VirtuBuild - Frontend Application Documentation

Complete documentation for the VirtuBuild Angular frontend application.

## 📋 Table of Contents

- [Overview](#overview)
- [Application Sitemap](#application-sitemap)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features](#features)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Configuration](#configuration)

## Overview

VirtuBuild Frontend is a modern Angular 19 application built with TypeScript, providing a comprehensive platform for virtual building and construction management. The application supports three user roles: **Student**, **Instructor**, and **Admin**, each with tailored interfaces and functionality.

### Key Technologies

- **Framework**: Angular 19.1.0
- **Language**: TypeScript 5.7.2
- **Build Tool**: Vite with Angular plugin
- **UI Libraries**: Angular Material 19.2.14, Taiga UI 4.38.0
- **State Management**: NgRx 19.2.0
- **Styling**: SCSS, Tailwind CSS 4.1.5
- **Icons**: FontAwesome 6.7.2
- **HTTP Client**: Axios 1.9.0

## Application Sitemap

Complete sitemap of all pages and features organized by user role and access level.

### Public Pages (Unauthenticated)

These pages are accessible without authentication:

#### Login Page
- **Route**: `/signin`
- **Component**: SigninComponent
- **Features**:
  - Sign-in form
  - Role selection (Student, Instructor, Admin)
  - Password recovery link
  - Navigation to About Us and Contact

#### Forgot Password
- **Route**: `/forgot-password`
- **Component**: ForgotPasswordComponent
- **Features**:
  - Password recovery form
  - Email submission
  - Reset link generation

#### Reset Password
- **Route**: `/reset-password`
- **Component**: ResetPasswordComponent
- **Features**:
  - Password reset form
  - Token validation
  - New password submission

#### Contact
- **Route**: `/contact`
- **Component**: ContactComponent
- **Features**:
  - Contact information
  - Contact form
  - Support details

#### About Us
- **Route**: `/about-us`
- **Component**: AboutUsComponent
- **Features**:
  - Company information
  - Platform overview
  - Team details

### Student Pages

Accessible to users with the **student** role:

#### Dashboard
- **Route**: `/student` or `/student/`
- **Component**: StudentDashboardComponent
- **Features**:
  - Overview of student progress
  - Quick access to activities, grades, and assessments
  - Recent activity feed
  - Performance metrics
  - **Actions Available**:
    - Share dashboard
    - Search dashboard content
    - Export dashboard data

#### All Activities
- **Route**: `/student/activities`
- **Component**: ActivitiesListComponent
- **Features**:
  - List of all available activities
  - Activity cards with details
  - Activity status indicators
  - **Actions Available**:
    - Search activities
    - Share activities
    - Export activity list
    - Filter by module

#### Activity Detail
- **Route**: `/student/activities/:id`
- **Component**: ActivityDetailComponent
- **Features**:
  - Detailed activity information
  - Activity instructions
  - Launch simulation button
  - Activity prerequisites

#### Simulation
- **Route**: `/student/simulation/:activityId`
- **Component**: PcAssemblySimulationComponent
- **Features**:
  - Interactive PC assembly simulation
  - Step-by-step guidance
  - Progress tracking
  - Real-time feedback

#### Assignments
- **Route**: `/student/assessments`
- **Component**: AssessmentSubmissionsComponent
- **Features**:
  - View assigned assessments
  - Assessment status (pending, completed)
  - **Actions Available**:
    - Launch Assessment
    - View assessment details
    - Submit assessment answers

#### Quizzes
- **Route**: `/student/assessments` (Quiz type)
- **Component**: AssessmentSubmissionsComponent
- **Features**:
  - View assigned quizzes
  - Quiz questions and answers
  - **Actions Available**:
    - Launch Quiz
    - Submit quiz answers
    - View quiz results

#### Grades
- **Route**: `/student/grades`
- **Component**: GradesPageComponent
- **Features**:
  - View all grades
  - Grade breakdown by activity
  - Performance statistics
  - Grade history
  - **Actions Available**:
    - Search grades
    - Share grades
    - Export grades

#### Analytics
- **Route**: `/student/analytics`
- **Component**: AnalyticsPageComponent
- **Features**:
  - Performance analytics
  - Progress charts and graphs
  - Visual performance metrics
  - Trend analysis
  - **Actions Available**:
    - Search analytics
    - Share analytics
    - Export analytics data

#### Progress
- **Route**: `/student/progress`
- **Component**: ProgressTrackingComponent
- **Features**:
  - Track learning progress
  - Module completion status
  - Activity completion timeline
  - Progress visualization
  - Completion percentages

#### Logout
- **Feature**: Available from all student pages
- **Action**: Sign out from the application

### Instructor Pages

Accessible to users with the **instructor** role:

#### Dashboard/Home
- **Route**: `/instructor` or `/instructor/`
- **Component**: InstructorHomeComponent
- **Features**:
  - Overview dashboard
  - **Key Metrics**:
    - Deployed Assignments count
    - Latest Deployed Assignments list
    - Student Count statistics
  - Quick access to key features
  - Recent activity summary

#### Laboratory Activities Management
- **Route**: `/instructor/laboratories` or `/instructor/manage-activities`
- **Component**: ManageActivitiesComponent
- **Features**:
  - Create and manage laboratory activities
  - **Deployment Features**:
    - Deploy Assignments
    - View Deployed Assignments
    - Topics/Deploy Assignment functionality
  - Activity configuration
  - Activity status management
  - Activity assignment to students

#### Modules Management
- **Route**: `/instructor/manage-modules`
- **Component**: ManageModulesComponent
- **Features**:
  - Create and manage modules
  - Organize activities by module
  - Module configuration
  - Module assignment to students
  - Module content management

#### Assessments Management
- **Route**: `/instructor/assessments`
- **Component**: InstructorManageAssessmentsComponent
- **Features**:
  - Create and manage assessments
  - **Assessment Features**:
    - Deployed Assessments list
    - Assessment configuration
    - Link assessments to activities
    - Assessment status tracking

#### Assessment Editor
- **Route**: `/instructor/assessments/:moduleId`
- **Component**: AssessmentEditorComponent
- **Features**:
  - Create/edit assessments
  - Question management
  - Assessment settings
  - Grading configuration
  - Question bank management

#### Student Grades Management
- **Route**: `/instructor/grades`
- **Component**: InstructorGradesComponent
- **Features**:
  - **Grade Management Features**:
    - Student List with Grades
    - Student Count overview
    - Student Specific Grade Profile
    - Overall Grade with Final Grade calculation
    - Activities/Quizzes Grades breakdown
  - Grade management by activity
  - Filter by module and activity
  - Grade statistics and analytics
  - **Actions Available**:
    - Search grades
    - Filter grades
    - Export grades
    - View detailed grade profiles

#### Student Groups
- **Route**: `/instructor/student-groups`
- **Component**: StudentGroupsManagementComponent
- **Features**:
  - Manage student groups
  - Assign students to groups
  - Group-based activity assignment
  - Group performance tracking

#### My Account
- **Route**: `/instructor/my-account`
- **Component**: MyAccountComponent
- **Features**:
  - Profile management
  - Account settings
  - Password change
  - **Actions Available**:
    - Logout functionality
    - Update profile
    - Manage preferences

### Admin Pages

Accessible to users with the **admin** role:

#### Dashboard
- **Route**: `/admin` or `/admin/`
- **Component**: AdminDashboardComponent
- **Features**:
  - System overview
  - User statistics
  - Content statistics
  - System health monitoring
  - Activity metrics

#### User Management
- **Route**: `/admin/users`
- **Component**: UserManagementComponent
- **Features**:
  - Manage all users
  - Create/edit user accounts
  - User role assignment
  - User status management
  - User activity tracking

#### Instructors Management
- **Route**: `/admin/instructors`
- **Component**: ManageInstructorsComponent
- **Features**:
  - Manage instructor accounts
  - Create/edit instructors
  - Assign permissions
  - Instructor activity tracking
  - Instructor performance metrics

#### Students Management
- **Route**: `/admin/students`
- **Component**: ManageStudentsComponent
- **Features**:
  - Manage student accounts
  - Create/edit students
  - Student enrollment
  - Student activity tracking
  - Student performance overview

#### Student Groups Management
- **Route**: `/admin/student-groups`
- **Component**: StudentGroupsManagementComponent
- **Features**:
  - Create and manage student groups
  - Assign students to groups
  - Group-based permissions
  - Group analytics

#### Modules Management
- **Route**: `/admin/modules`
- **Component**: AdminModulesComponent
- **Features**:
  - System-wide module management
  - Create/edit modules
  - Module assignment
  - Module configuration
  - Module analytics

#### Lab Activities Management
- **Route**: `/admin/lab-activities`
- **Component**: AdminLabActivitiesComponent
- **Features**:
  - System-wide activity management
  - Create/edit lab activities
  - Activity configuration
  - Activity assignment
  - Activity usage statistics

#### Assessments Management
- **Route**: `/admin/assessments`
- **Component**: AdminAssessmentsComponent
- **Features**:
  - System-wide assessment management
  - Create/edit assessments
  - Assessment configuration
  - Assessment assignment
  - Assessment analytics

#### Contents Management Hub
- **Route**: `/admin/contents`
- **Component**: ManageContentsComponent
- **Features**:
  - Central content management hub
  - Navigation to laboratories and assessments
  - Content overview

  ##### Laboratories
  - **Route**: `/admin/contents/laboratories`
  - **Component**: ManageLaboratoriesComponent
  - **Features**:
    - Manage all laboratories
    - Create/edit laboratories
    - Laboratory configuration
    - Laboratory assignment

  ##### Assessments
  - **Route**: `/admin/contents/assessments`
  - **Component**: ManageAssessmentsComponent
  - **Features**:
    - Manage all assessments
    - Assessment listing
    - Assessment overview
    - Assessment statistics

  ##### Create Assessment
  - **Route**: `/admin/contents/assessments/create`
  - **Component**: CreateAssessmentComponent
  - **Features**:
    - Create new assessment
    - Question builder
    - Assessment settings
    - Grading configuration

  ##### Edit Assessment
  - **Route**: `/admin/contents/assessments/edit/:id`
  - **Component**: CreateAssessmentComponent
  - **Features**:
    - Edit existing assessment
    - Update questions
    - Modify settings
    - Update grading configuration

#### Grades Management
- **Route**: `/admin/grades`
- **Component**: AdminGradesComponent
- **Features**:
  - System-wide grade management
  - View all grades
  - Grade overrides
  - Grade analytics
  - Grade statistics

#### User Roles Management
- **Route**: `/admin/user-roles`
- **Component**: UserRolesManagementComponent
- **Features**:
  - Manage user roles
  - Create/edit roles
  - Permission assignment
  - Role-based access control
  - Role hierarchy management

## Getting Started

### Prerequisites

- **Node.js**: v18+ (recommended: v20+)
- **npm**: v9+
- **Angular CLI**: v19.1.7+

### Installation

1. **Navigate to the app directory**:
   ```bash
   cd virtubuildapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp env.example .env
   ```

4. **Update `.env` file**:
   ```env
   VITE_API_BASE_URL=http://localhost:9000/api
   VITE_API_TIMEOUT_MS=10000
   ENVIRONMENT=development
   APP_TITLE=VirtuBuild Dashboard
   APP_VERSION=1.0.0
   ENABLE_ANALYTICS=false
   ENABLE_DEBUG=false
   ```

5. **Start development server**:
   ```bash
   npm start
   ```

6. **Access the application**:
   - Open http://localhost:4200 in your browser

## Project Structure

```
virtubuildapp/
├── src/
│   ├── app/
│   │   ├── core/                    # Core functionality
│   │   │   ├── api/                 # API client configuration
│   │   │   ├── guards/              # Route guards (Auth, Role)
│   │   │   ├── services/            # Core services
│   │   │   └── store/               # NgRx store
│   │   ├── features/                # Feature modules
│   │   │   ├── admin/               # Admin features
│   │   │   ├── auth/                # Authentication
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   ├── instructor/          # Instructor features
│   │   │   ├── public/              # Public pages
│   │   │   └── student/             # Student features
│   │   ├── shared/                  # Shared components
│   │   │   └── components/           # Reusable components
│   │   ├── app.component.ts         # Root component
│   │   ├── app.config.ts            # App configuration
│   │   └── app.routes.ts            # Route definitions
│   ├── environments/               # Environment configs
│   ├── styles/                      # Global styles
│   └── index.html                   # Entry HTML
├── angular.json                     # Angular CLI config
├── vite.config.ts                   # Vite configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript config
```

## Features

### Authentication & Authorization

- **JWT-based authentication**
- **Role-based access control** (Student, Instructor, Admin)
- **Route guards** for protected routes
- **Session management**
- **Password recovery**

### State Management

- **NgRx Store** for global state
- **NgRx Effects** for side effects
- **NgRx Entity** for entity management
- **DevTools** for debugging

### UI Components

- **Angular Material** components
- **Taiga UI** comprehensive UI kit
- **FontAwesome** icons
- **Responsive design** with Tailwind CSS
- **Custom components** in shared module

### API Integration

- **Axios** HTTP client
- **Centralized API service**
- **Error handling**
- **Request/Response interceptors**
- **Loading states**

## Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Build and watch for changes
npm run watch

# Run tests
npm test
```

### Development Workflow

1. **Make changes** to components, services, or routes
2. **Save files** - Angular CLI automatically refreshes
3. **Test changes** in browser at http://localhost:4200
4. **Check console** for errors or warnings

### Code Style

- Follow **Angular Style Guide**
- Use **TypeScript** strict mode
- Use **SCSS** for styling
- Use **Tailwind CSS** utility classes
- Follow **component-based architecture**

## Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output

- **Location**: `dist/virtubuild-dashboard/browser/`
- **Format**: Static HTML, CSS, and JavaScript files
- **Optimization**: Minified, tree-shaken, and optimized

### Deployment

The application can be deployed to:
- **Static hosting** (Netlify, Vercel, GitHub Pages)
- **Docker container** (see Docker setup)
- **Traditional web server** (Nginx, Apache)

### Environment Configuration

For production, update `.env`:

```env
VITE_API_BASE_URL=https://api.virtubuild.com/api
ENVIRONMENT=production
ENABLE_ANALYTICS=true
ENABLE_DEBUG=false
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:9000/api` |
| `VITE_API_TIMEOUT_MS` | API request timeout | `10000` |
| `ENVIRONMENT` | Environment mode | `development` |
| `APP_TITLE` | Application title | `VirtuBuild Dashboard` |
| `APP_VERSION` | Application version | `1.0.0` |
| `ENABLE_ANALYTICS` | Enable analytics | `false` |
| `ENABLE_DEBUG` | Enable debug mode | `false` |

### Route Configuration

Routes are defined in `src/app/app.routes.ts`. Each route can have:
- **Path**: URL path
- **Component**: Component to render
- **Guards**: Auth and role guards
- **Data**: Route metadata

### API Configuration

API configuration is in `src/app/core/api/`. The base URL is configured via environment variables.

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Taiga UI Documentation](https://taiga-ui.dev/)
- [NgRx Documentation](https://ngrx.io/)
- [Tailwind CSS](https://tailwindcss.com/)

