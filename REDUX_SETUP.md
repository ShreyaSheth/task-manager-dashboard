# Redux Toolkit Setup Documentation

## 🎯 Overview

This application now uses **Redux Toolkit** for state management, providing a more scalable and maintainable approach to handling global state, especially for authentication.

## 📦 Architecture

### Store Structure
```
store/
├── index.ts              # Store configuration
├── hooks.ts              # Typed Redux hooks
├── StoreProvider.tsx     # Provider component
└── slices/
    └── authSlice.ts      # Authentication state slice
```

## 🔧 Core Components

### 1. Store Configuration (`store/index.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Key Features:**
- Single source of truth for application state
- Configured with Redux DevTools extension
- Type-safe store exports

### 2. Custom Hooks (`store/hooks.ts`)

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Why Custom Hooks?**
- Full TypeScript support
- Auto-completion for state and actions
- Type safety throughout the app

### 3. Store Provider (`store/StoreProvider.tsx`)

```typescript
'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { checkAuth } from './slices/authSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      store.dispatch(checkAuth());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
```

**Key Features:**
- Wraps the entire app with Redux store
- Auto-checks authentication on app load
- Client-side only (marked with 'use client')

## 🔐 Auth Slice (`store/slices/authSlice.ts`)

### State Structure

```typescript
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

### Async Thunks (Actions)

#### 1. **checkAuth**
Checks if the user is authenticated on app load.

```typescript
dispatch(checkAuth());
```

**Flow:**
1. Fetches `/api/auth/me`
2. If successful, sets user in state
3. If failed, clears user

#### 2. **login**
Authenticates a user with email and password.

```typescript
const result = await dispatch(login({ email, password })).unwrap();
```

**Flow:**
1. POST to `/api/auth/login`
2. On success, stores user in state
3. On error, sets error message
4. Component handles redirect

#### 3. **signup**
Creates a new user account.

```typescript
const result = await dispatch(signup({ email, password, name })).unwrap();
```

**Flow:**
1. POST to `/api/auth/signup`
2. On success, stores user in state
3. On error, sets error message
4. Component handles redirect

#### 4. **logout**
Logs out the current user.

```typescript
await dispatch(logout()).unwrap();
```

**Flow:**
1. POST to `/api/auth/logout`
2. Clears user from state
3. Component handles redirect to login

### Synchronous Actions

#### **clearError**
Clears any authentication error.

```typescript
dispatch(clearError());
```

## 🎨 Usage in Components

### Login Page Example

```typescript
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, clearError } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (result) {
        router.push('/dashboard');
      }
    } catch (err) {
      // Error is in Redux state
    }
  };

  // Access state
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Error:', error);
}
```

### Dashboard Example

```typescript
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Welcome, {user.name}!</div>;
}
```

## 🔄 State Flow Diagram

```
┌─────────────────┐
│   Component     │
│   Dispatches    │
│   Action        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Async Thunk   │
│   (API Call)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Reducer       │
│   Updates State │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Component     │
│   Re-renders    │
└─────────────────┘
```

## ✅ Benefits of Redux Toolkit

### 1. **Better State Management**
- Single source of truth
- Predictable state updates
- Time-travel debugging

### 2. **Type Safety**
- Full TypeScript support
- Auto-completion
- Compile-time error checking

### 3. **Developer Experience**
- Redux DevTools integration
- Less boilerplate code
- Built-in best practices

### 4. **Scalability**
- Easy to add new slices
- Organized code structure
- Separation of concerns

### 5. **Performance**
- Optimized re-renders
- Memoized selectors
- Efficient state updates

## 🚀 Adding New Features

### Step 1: Create a New Slice

```typescript
// store/slices/projectsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const response = await fetch('/api/projects');
    return response.json();
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { projects: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      });
  },
});

export default projectsSlice.reducer;
```

### Step 2: Add to Store

```typescript
// store/index.ts
import projectsReducer from './slices/projectsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer, // Add new slice
  },
});
```

### Step 3: Use in Components

```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/projectsSlice";

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return <div>{/* Render projects */}</div>;
}
```

## 🛠️ Debugging

### Redux DevTools

1. Install Redux DevTools extension in your browser
2. Open DevTools
3. Select "Redux" tab
4. You can now:
   - Inspect state
   - View actions
   - Time-travel debug
   - Export/import state

### Console Logging

```typescript
// In any component
const state = useAppSelector((state) => state);
console.log('Full Redux State:', state);
```

## 📚 Best Practices

1. **Always use typed hooks** (`useAppDispatch`, `useAppSelector`)
2. **Use `unwrap()` for async thunks** to handle errors
3. **Keep slices focused** - one feature per slice
4. **Use selectors** for computed values
5. **Clear errors** when appropriate
6. **Handle loading states** in UI

## 🔗 Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Documentation](https://react-redux.js.org/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

## 🎉 Summary

Redux Toolkit provides:
- ✅ Centralized state management
- ✅ Type-safe actions and state
- ✅ Better developer experience
- ✅ Scalable architecture
- ✅ Easy debugging
- ✅ Performance optimizations

Your app is now ready for production-level state management!

