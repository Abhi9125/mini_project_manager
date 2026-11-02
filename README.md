# Mini Project Manager

A full-stack, responsive project and task management web application built with **Next.js 14 (App Router)**, **TypeScript**, **Redux Toolkit (RTK Query)**, **Node.js/Express**, and **MongoDB**.

---

## Features

- **Authentication & Security**
  - User signup and login with email and password.
  - Salted password hashing with `bcryptjs`.
  - Stateless authentication via JSON Web Tokens (JWT) transmitted as Bearer tokens.
  - Client-side route protection (`ProtectedRoute`) and Express authentication middleware (`protect`).

- **Project Management**
  - Full CRUD operations for projects (`title`, `description`).
  - Scoped data ownership: users only access their own projects.
  - Project progress tracking and aggregate task status metrics.
  - Cascading deletion: deleting a project automatically cleans up all its associated tasks.

- **Task Management & Dual-View UX**
  - Tasks contain: `title`, `description`, `status` (`todo`, `in-progress`, `done`), and `dueDate`.
  - Full task CRUD (create, view, edit, delete).
  - **Interactive Kanban Board**: 3 status columns with one-click status transitions and live counter badges.
  - **Structured Data Table View**: Tabular layout with inline status dropdowns and overdue date indicators.
  - **Real-Time Filtering & Sorting**:
    - Filter by status pills (`All`, `To Do`, `In Progress`, `Done`).
    - Real-time search across task titles and descriptions.
    - Multi-option sorting by due date (soonest / latest), created date, and title.

- **Developer & Evaluator Experience**
  - Single-command seed script populating demo user and sample projects.
  - Ready-to-use Docker Compose for local MongoDB and Mongo Express administration.
  - Strict TypeScript across client and server.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons |
| **State Management** | Redux Toolkit, RTK Query (caching, tag-based invalidation) |
| **Backend** | Node.js, Express.js, TypeScript |
| **Validation** | Zod (schema validation middleware) |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |

---

## Project Structure

```
project-management/
├── client/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router pages (login, register, dashboard, projects)
│   │   ├── components/         # Common, project, and task UI components
│   │   ├── lib/                # Utilities and helpers
│   │   ├── store/              # Redux store, authSlice, and RTK Query API
│   │   └── types/              # TypeScript interfaces
│   ├── .env.example
│   └── package.json
│
├── server/                     # Express REST API (Modular 3-Tier Architecture)
│   ├── src/
│   │   ├── config/             # MongoDB connection config
│   │   ├── middleware/         # Auth, validation, and error middlewares
│   │   ├── models/             # User, Project, and Task Mongoose schemas
│   │   ├── modules/            # Feature modules (Controller, Service, Repository, Routes, Validation)
│   │   │   ├── auth/           # authController, authService, authRepository, authRoutes, authValidation
│   │   │   ├── projects/       # projectController, projectService, projectRepository, projectRoutes, projectValidation
│   │   │   └── tasks/          # taskController, taskService, taskRepository, taskRoutes, taskValidation
│   │   ├── scripts/            # Database seed script
│   │   ├── utils/              # Custom AppError and helper utilities
│   │   ├── types/              # Express typings and interfaces
│   │   ├── app.ts              # Express application bootstrap
│   │   └── server.ts           # Server entry point
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml          # Local MongoDB & Mongo Express services
├── package.json                # Root orchestration scripts
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance, MongoDB Atlas URI, or Docker.

---

### Option 1: Quickstart with Local MongoDB / Atlas

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd project-management
```

#### 2. Configure Backend Environment
```bash
cd server
cp .env.example .env
```
Default `server/.env`:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```
*(Port 5001 is used by default to prevent conflicts with macOS ControlCenter/AirPlay Receiver on port 5000).*

#### 3. Install Server Dependencies & Seed Database
```bash
# In server/
npm install

# (Optional) Seed demo data (admin@example.com / password123)
npm run seed

# Start Express server in development mode
npm run dev
```
The server will start on `http://localhost:5001`.

#### 4. Configure & Start Frontend
In a new terminal window:
```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```
The frontend will start on `http://localhost:3000`.

---

### Option 2: Run MongoDB via Docker Compose

If you do not have MongoDB installed locally, you can start MongoDB with Docker:

```bash
# From project root
docker compose up -d
```
- MongoDB runs on `mongodb://localhost:27017`

---

## Evaluator Demo Account

To test the application quickly with pre-loaded projects and tasks, run:
```bash
npm --prefix server run seed
```
Then log in on the web app or click **"Autofill Evaluator Demo Credentials"** on the login screen:
- **Email:** `admin@example.com`
- **Password:** `password123`

---

## API Endpoints Reference

### Auth (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Authenticate & return token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user | Yes |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/projects` | Get all projects with task statistics | Yes |
| `POST` | `/api/projects` | Create a new project | Yes |
| `GET` | `/api/projects/:id` | Get single project detail | Yes |
| `PUT` | `/api/projects/:id` | Update project title / description | Yes |
| `DELETE`| `/api/projects/:id` | Delete project and cascade tasks | Yes |

### Tasks (`/api/projects/:projectId/tasks` & `/api/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/projects/:projectId/tasks` | Get project tasks (supports `?status=&sortBy=&order=&search=`) | Yes |
| `POST` | `/api/projects/:projectId/tasks` | Create task within a project | Yes |
| `GET` | `/api/tasks/:id` | Get single task detail | Yes |
| `PUT` | `/api/tasks/:id` | Update task title, description, status, due date | Yes |
| `DELETE`| `/api/tasks/:id` | Delete task | Yes |

---

## Free Cloud Deployment Guide

### 1. Database (MongoDB Atlas — Free M0)
1. Sign up for a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Sandbox** cluster (no credit card required).
3. Under **Database Access**, create a database user and password.
4. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
5. Copy your connection string into `MONGODB_URI`.

### 2. Frontend (Vercel — Free Hobby Tier)
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. Set **Root Directory** to `client`.
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL + `/api` (or serverless proxy).
5. Click **Deploy**.

### 3. Backend (Render / Railway / Vercel Serverless)
- Deploy `server/` as a free Web Service on [Render](https://render.com) with build command `npm install && npm run build` and start command `npm start`, providing your MongoDB Atlas connection string.

---

## License

MIT License.
