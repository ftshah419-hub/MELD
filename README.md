# MELD — Bridge Two Worlds
> **Tagline:** Different Worlds. One Connected Future.  
> **Theme:** Minimal Premium Startup | **Design Palette:** Fresh Connection

MELD is a unified community platform connecting people, skills, resources and opportunities across five core initiatives:
1. **Wisdom Loop** — Mentorship and knowledge sharing.
2. **Craft to Cart** — Traditional artisans and modern customers.
3. **ReConnect** — Electronics reuse, repair and recycling.
4. **Book Bridge** — Book donation and exchange.
5. **Second Serve** — Surplus food donation and distribution.

---

## 1. Final Folder Structure

```text
MELD/
├── .gitignore
├── package.json
├── README.md
└── frontend/
    ├── .env
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        │   ├── icons/
        │   └── images/
        │       ├── login-reference.png
        │       └── meld-logo.jpg
        ├── components/
        │   └── common/
        │       ├── Button.jsx
        │       ├── CloudinaryImage.jsx
        │       ├── ErrorMessage.jsx
        │       ├── Footer.jsx
        │       ├── InputField.jsx
        │       ├── LoadingSpinner.jsx
        │       ├── MeldLogo.jsx
        │       ├── ModuleCard.jsx
        │       ├── Navbar.jsx
        │       ├── PageTransition.jsx
        │       ├── ProtectedRoute.jsx
        │       └── RoleRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   └── useAuth.js
        ├── layouts/
        │   ├── AuthLayout.jsx
        │   └── MainLayout.jsx
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   └── common/
        │       ├── About.jsx
        │       ├── Contact.jsx
        │       ├── Explore.jsx
        │       ├── Home.jsx
        │       ├── HowItWorks.jsx
        │       ├── Impact.jsx
        │       └── NotFound.jsx
        ├── routes/
        │   └── AppRoutes.jsx
        ├── services/
        │   ├── api.js
        │   └── authService.js
        └── styles/
            ├── animations.css
            ├── global.css
            └── theme.css
```

---

## 2. Files Created and Modified

### A. Created Files (Person 1 — Shared Foundation)
- `frontend/src/styles/theme.css` — Complete MELD Design System tokens (exact hex colors, module accents, typography, elevations, border radii).
- `frontend/src/styles/animations.css` — Custom keyframe animations, staggered delays, hover lift, reduced-motion accessibility.
- `frontend/src/styles/global.css` — Modern reset, typography presets, custom scrollbars, layout containers, badge system.
- `frontend/src/services/api.js` — Centralized fetch API client with HttpOnly cookie support (`credentials: 'include'`), Authorization token injection, and friendly error normalization.
- `frontend/src/services/authService.js` — Authentication interface (`register`, `login`, `getCurrentUser`, `logout`).
- `frontend/src/context/AuthContext.jsx` — State management for authenticated user, loading states, errors, role extraction, session restoration.
- `frontend/src/hooks/useAuth.js` — Easy-to-use custom hook for consuming `AuthContext`.
- `frontend/src/components/common/MeldLogo.jsx` — Crisp vector SVG of the 3-squircle MELD emblem with responsive scaling.
- `frontend/src/components/common/Button.jsx` — Multi-variant buttons (`primary`, `secondary`, `accent`, `ghost`, `outline`, `danger`), sizes, loading spinner, and icon slots.
- `frontend/src/components/common/InputField.jsx` — Form input with leading icons, trailing password visibility toggles, accessibility aria attributes, focus glow.
- `frontend/src/components/common/ModuleCard.jsx` — Interactive card component for the 5 initiatives with custom accent colors.
- `frontend/src/components/common/LoadingSpinner.jsx` — MELD branded dual-arc loading spinner (inline and fullscreen overlay).
- `frontend/src/components/common/ErrorMessage.jsx` — Accessible alert banner with retry and dismiss handlers.
- `frontend/src/components/common/PageTransition.jsx` — Smooth route entrance wrapper.
- `frontend/src/components/common/ProtectedRoute.jsx` — Route guard redirecting guests to `/login` preserving intended destination.
- `frontend/src/components/common/RoleRoute.jsx` — Role-based authorization guard (`USER` vs `ADMIN`) with clear Access Restricted UI.
- `frontend/src/components/common/CloudinaryImage.jsx` — Image loader with Cloudinary transformations, lazy loading, and error fallbacks.
- `frontend/src/components/common/Navbar.jsx` — Glassmorphism sticky header, navigation links, user session pill, mobile drawer.
- `frontend/src/components/common/Footer.jsx` — Deep forest green footer with module directory, platform links, live metrics, SSL/privacy badges.
- `frontend/src/layouts/MainLayout.jsx` — Public pages wrapper with Navbar and Footer.
- `frontend/src/layouts/AuthLayout.jsx` — Split-screen authentication layout matching the design reference image and `code.html`.
- `frontend/src/pages/auth/Login.jsx` — Full-featured login screen matching the reference mockup.
- `frontend/src/pages/auth/Register.jsx` — Client-validated registration strictly creating `USER` accounts.
- `frontend/src/pages/common/Home.jsx` — Complete landing page with hero, module cards, 4-step workflow, impact metrics, testimonials, and CTA.
- `frontend/src/pages/common/About.jsx` — Mission, vision, Bridge Two Worlds philosophy, and guiding pillars.
- `frontend/src/pages/common/Explore.jsx` — Comprehensive catalog of all 5 modules with category filters and participation details.
- `frontend/src/pages/common/HowItWorks.jsx` — Step-by-step 4-phase framework and FAQ accordion.
- `frontend/src/pages/common/Impact.jsx` — Transparent platform metrics and UN Sustainable Development Goal alignment.
- `frontend/src/pages/common/Contact.jsx` — Responsive contact form with clear staging feedback and direct channels.
- `frontend/src/pages/common/NotFound.jsx` — Custom 404 page in MELD style.
- `frontend/src/routes/AppRoutes.jsx` — React Router DOM configuration connecting public, auth, and protected user/admin routes.
- `frontend/.env` & `frontend/.env.example` — Environment configuration for backend API and Cloudinary.
- `package.json` (Root) — Monorepo convenience scripts for `npm run dev` and `npm run build`.

### B. Modified Files
- `frontend/index.html` — Updated fonts (Plus Jakarta Sans, Inter, Material Symbols Outlined), page title, and meta tags.
- `frontend/src/App.jsx` — Wired with `BrowserRouter`, `AuthProvider`, and `AppRoutes`.
- `frontend/src/index.css` — Replaced Vite default styling with `@import './styles/global.css'`.
- `frontend/src/App.css` — Reset boilerplate.

### C. Protected Files Left Untouched
- `src/pages/user/` (Owned exclusively by Person 2) — **UNTOUCHED**
- `src/features/user/` (Owned exclusively by Person 2) — **UNTOUCHED**
- `src/components/user/` (Owned exclusively by Person 2) — **UNTOUCHED**
- `src/pages/admin/` (Owned exclusively by Person 3) — **UNTOUCHED**
- `src/features/admin/` (Owned exclusively by Person 3) — **UNTOUCHED**
- `src/components/admin/` (Owned exclusively by Person 3) — **UNTOUCHED**

---

## 3. Frontend Run Instructions

### Step 1: Install Dependencies
```bash
# In the root folder:
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
# The application runs at http://localhost:5173
```

### Step 3: Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 4. Environment Variables

Create a `.env` file in the `frontend/` directory (or use the provided `.env`):
```env
# Backend API Base URL (Express.js REST API)
VITE_API_URL=http://localhost:5000/api

# Cloudinary Public Cloud Name
VITE_CLOUDINARY_CLOUD_NAME=meld-community
```

---

## 5. Authentication API Contract

The frontend connects to the following Express.js REST endpoints:

### 1. User Registration
- **Method:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "_id": "673b8e...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    },
    "token": "optional-jwt-token"
  }
  ```
- **Role Policy:** Public registrations always receive `role: "USER"`.

### 2. User Login
- **Method:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "user": {
      "_id": "673b8e...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    },
    "token": "jwt-token-if-using-bearer-mode"
  }
  ```
  *(Or sets an HttpOnly cookie named `token` / `session`)*

### 3. Session Restoration
- **Method:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>` or automatic HttpOnly cookie
- **Response (200 OK):**
  ```json
  {
    "user": {
      "_id": "673b8e...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    }
  }
  ```

### 4. Logout
- **Method:** `POST /api/auth/logout`
- **Response (200 OK):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## 6. Authentication Feature Checklist

- [x] Full-featured registration page with live client validation.
- [x] Email format and minimum strength verification.
- [x] Password matching confirmation.
- [x] Show / Hide password toggles.
- [x] Pixel-perfect login page matching the reference image and `code.html`.
- [x] Loading spinners on submission with disabled submit button.
- [x] Centralized `AuthContext.jsx` and `useAuth()` hook.
- [x] Automatic session restoration on app reload (`/api/auth/me`).
- [x] Role-based redirection (`ADMIN` -> `/admin/dashboard`, `USER` -> `/user/dashboard`).
- [x] `ProtectedRoute` guard redirecting unauthenticated visitors to `/login`.
- [x] `RoleRoute` guard restricting ADMIN routes with Access Restricted UI.
- [x] Clean logout clearing cookies/tokens and auth context.
- [x] Graceful network failure handling with user-friendly error banners.

---

## 7. Teammate Handoff & Integration Instructions

### For Person 2 — User Module Owner
1. **Your Protected Workspace:** `src/pages/user/`, `src/features/user/`, `src/components/user/`.
2. **Dashboard Destination:** `/user/dashboard`.
3. **Integration Point:**
   - In `src/routes/AppRoutes.jsx`, replace `<UserDashboardIntegration />` with your exported component:
   ```jsx
   import UserDashboard from '../pages/user/UserDashboard';
   // In route definition:
   <Route path="/user/dashboard" element={<ProtectedRoute><RoleRoute allowedRoles={['USER', 'ADMIN']}><UserDashboard /></RoleRoute></ProtectedRoute>} />
   ```
4. **Accessing Current User:**
   ```jsx
   import { useAuth } from '../../hooks/useAuth';
   const { user, userId, userName, userEmail, userRole, logout } = useAuth();
   ```
5. **Making Authenticated API Calls:**
   ```jsx
   import apiClient from '../../services/api';
   const myData = await apiClient('/user/profile');
   ```

### For Person 3 — Admin Module Owner
1. **Your Protected Workspace:** `src/pages/admin/`, `src/features/admin/`, `src/components/admin/`.
2. **Dashboard Destination:** `/admin/dashboard`.
3. **Integration Point:**
   - In `src/routes/AppRoutes.jsx`, replace `<AdminDashboardIntegration />` with your exported component:
   ```jsx
   import AdminDashboard from '../pages/admin/AdminDashboard';
   // In route definition:
   <Route path="/admin/dashboard" element={<ProtectedRoute><RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute></ProtectedRoute>} />
   ```
4. **Accessing Admin Session:**
   ```jsx
   import { useAuth } from '../../hooks/useAuth';
   const { user, userRole, logout } = useAuth();
   ```

---

## 8. Pending Backend Integration Work

1. **Express.js Auth Routes:**
   - Implement `POST /api/auth/register` (hashing password via bcrypt/Argon2, defaulting role to `USER`).
   - Implement `POST /api/auth/login` (verifying credentials and returning user identity).
   - Implement `GET /api/auth/me` (decoding JWT from cookie/header).
   - Implement `POST /api/auth/logout` (clearing session cookie).
2. **CORS Configuration:**
   - Ensure `cors({ origin: 'http://localhost:5173', credentials: true })` is enabled in Express.
3. **Cloudinary Upload Preset (Optional):**
   - Provide public upload preset or backend upload signature endpoint for avatar and module asset uploads.
