# 📝 Task Manager Dashboard

A modern, full-stack task management application built with Next.js 16, featuring JWT-based authentication, project management, and task tracking capabilities.

## ✨ Features

- **Authentication** – JWT sign up/login, middleware protection, and secure HTTP-only cookies; session state hydrated via Redux.
- **Tasks & Projects** – Create, edit, delete tasks and projects via Next.js API routes; tasks can belong to projects, include due dates, priorities, and statuses (and filterable from the UI).
- **UI Stack** – TailwindCSS layout, Material-UI components, responsive dashboard, task dialog, project dialog, and badge chips with hover effects.
- **Client State** – Redux Toolkit slices for `auth`, `tasks`, and `projects`, plus Axios instance with centralized 401 handling and storage helpers for persisted JSON-backed data.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd task-manager-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```env
# JWT Secret - MUST be changed in production
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Environment
NODE_ENV=development
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
task-manager-dashboard/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── signup/route.ts      # Signup API endpoint
│   │       ├── login/route.ts       # Login API endpoint
│   │       ├── logout/route.ts      # Logout API endpoint
│   │       └── me/route.ts          # Get current user
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard page
│   ├── login/
│   │   └── page.tsx                 # Login page
│   ├── signup/
│   │   └── page.tsx                 # Signup page
│   ├── layout.tsx                   # Root layout with Redux Provider
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
├── store/
│   ├── index.ts                     # Redux store configuration
│   ├── hooks.ts                     # Typed Redux hooks
│   ├── StoreProvider.tsx            # Redux Provider component
│   └── slices/
│       └── authSlice.ts             # Authentication state slice
├── lib/
│   ├── auth.ts                      # Authentication service
│   ├── jwt.ts                       # JWT utilities
│   └── users.ts                     # In-memory user storage
├── middleware.ts                    # Route protection middleware
├── REDUX_SETUP.md                   # Redux documentation
└── package.json
```

## 🔧 Tech Stack

### Frontend

- **Next.js 16.1** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript** - Type-safe code
- **Material-UI (MUI) 7.3** - Component library
- **TailwindCSS 4** - Utility-first CSS

### Backend (API Routes)

- **Next.js API Routes** - Serverless API endpoints
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **jose** - JWT operations

### Development

- **ESLint** - Code linting
- **TypeScript** - Static typing

## 🔐 Authentication Flow

### 1. **Signup**

```
User fills form → POST /api/auth/signup → Hash password → Create user →
Generate JWT → Set HTTP-only cookie → Redirect to dashboard
```

### 2. **Login**

```
User enters credentials → POST /api/auth/login → Verify password →
Generate JWT → Set HTTP-only cookie → Redirect to dashboard
```

### 3. **Protected Routes**

```
User accesses /dashboard → Middleware checks cookie → Verify JWT →
Allow access OR Redirect to /login
```

### 4. **Logout**

```
User clicks logout → POST /api/auth/logout → Clear cookie →
Redirect to /login
```

## 🛡️ Security Features

- ✅ **Password Hashing** - bcryptjs with 10 salt rounds
- ✅ **HTTP-only Cookies** - Prevents XSS attacks
- ✅ **JWT Tokens** - Stateless authentication
- ✅ **Middleware Protection** - Server-side route guards
- ✅ **Secure Cookies** - HTTPS in production
- ✅ **SameSite Strict** - CSRF protection

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "1234567890",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "1234567890",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/logout`

Logout current user.

**Response:**

```json
{
  "message": "Logout successful"
}
```

#### GET `/api/auth/me`

Get current authenticated user.

**Response:**

```json
{
  "user": {
    "id": "1234567890",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

## 🎯 Usage

### Creating an Account

1. Navigate to the homepage
2. Click "Sign Up" button
3. Fill in your name, email, and password
4. Click "Sign Up"
5. You'll be automatically logged in and redirected to the dashboard

### Logging In

1. Click "Sign In" from the homepage or navigate to `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to your dashboard

### Logging Out

1. From the dashboard, click the "Logout" button in the top-right corner
2. You'll be logged out and redirected to the login page

## 🚧 Roadmap

### Phase 1: Authentication ✅

- [x] User signup
- [x] User login
- [x] JWT authentication
- [x] Middleware protection
- [x] Dashboard UI

### Phase 2: Projects

- [x] Create projects
- [x] Edit projects
- [x] Delete projects
- [x] Project listing

### Phase 3: Tasks

- [x] Create tasks within projects
- [x] Edit tasks
- [x] Delete tasks
- [x] Filter tasks by project/status
- [x] Task priority levels, due dates, completion toggles

## ⚠️ Important Notes

### Development vs Production

**This application uses a JSON-backed file store (`.task-manager-store.json`).** This keeps authentication/tasks/projects shared across Next.js workers while remaining lightweight for local development.

- ✅ No DB setup required
- ✅ Tokens stored in secure cookies and refreshed from Redux
- ✅ Works well for prototyping and demos

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using Next.js, MUI, and TailwindCSS

---

**Need Help?** Feel free to open an issue on GitHub!
