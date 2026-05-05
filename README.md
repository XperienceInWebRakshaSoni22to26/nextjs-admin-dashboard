# Next.js Admin Dashboard

A fully-featured admin dashboard built as a **frontend technical assessment**. The application authenticates against the [DummyJSON](https://dummyjson.com/) REST API and provides protected CRUD-style views for Users and Products with pagination, search, filtering, and detail pages.

---

## Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| **Framework**      | Next.js 16 (App Router, TypeScript)             |
| **UI Library**     | Material UI (MUI) v9 + Emotion                  |
| **State**          | Zustand v5 (with `persist` middleware)           |
| **Auth**           | NextAuth v4 (Credentials provider + JWT)        |
| **HTTP Client**    | Axios                                           |
| **API**            | DummyJSON public REST API                       |
| **Fonts**          | Geist & Geist Mono (via `next/font/google`)     |

---

## Features

### Authentication

- **NextAuth Credentials flow** — authenticates against `https://dummyjson.com/auth/login`
- JWT session strategy with custom `accessToken` and `username` propagated through callbacks
- NextAuth type augmentation (`types/next-auth.d.ts`) for type-safe session access
- Zustand auth store with `persist` middleware keeps token in `localStorage`
- Logout clears both NextAuth session and Zustand auth state

### Protected Routes

- `proxy.ts` exports a `withAuth` middleware configuration from `next-auth/middleware`
- Route matcher protects `/dashboard/*`, `/users/*`, and `/products/*`
- Root page (`/`) performs a server-side session check and redirects to `/dashboard` or `/login`
- Unauthenticated users are redirected to `/login`

### Users Module

- **List view** — paginated table (10 per page) showing name, email, gender, phone, company
- **Search** — real-time text search against DummyJSON `/users/search` endpoint
- **Detail page** (`/users/[id]`) — avatar, personal info, company, and full address
- Back-navigation link to users list

### Products Module

- **List view** — responsive card grid (10 per page) with thumbnail, category, price, and star rating
- **Search** — real-time text search against `/products/search`
- **Category filter** — dropdown populated from `/products/categories`; filters via `/products/category/{slug}`
- **Detail page** (`/products/[id]`) — full product info with:
  - Image gallery with numbered switcher buttons
  - Rating, price, stock, brand
  - Warranty and shipping information
- Back-navigation link to products list

### Dashboard

- Welcome screen with the authenticated user's name
- Summary cards for Users, Products, and Protected Routes
- Shared `DashboardShell` layout with AppBar navigation and logout button

---

## Zustand State Management

Three stores power the application, each with clearly defined async actions:

| Store              | Key Actions                                    | Notes                                          |
| ------------------ | ---------------------------------------------- | ---------------------------------------------- |
| `authStore`        | `setAuth`, `clearAuth`                         | Uses `persist` middleware → `localStorage`     |
| `usersStore`       | `fetchUsers`, `fetchUserById`                  | Includes in-memory TTL cache                   |
| `productsStore`    | `fetchProducts`, `fetchCategories`, `fetchProductById` | Includes in-memory TTL cache          |

**Why Zustand over Redux?**
Zustand has a minimal API surface, supports async actions natively inside the store (no middleware like `redux-thunk`), and eliminates boilerplate. This keeps the codebase concise and readable — ideal for an assessment-scoped project.

---

## Caching Strategy

Both `usersStore` and `productsStore` implement a **client-side in-memory cache**:

- **Cache key** — derived from query string + pagination params (e.g., `search:john:10:0`)
- **TTL** — 5 minutes (`300,000 ms`); stale entries are refetched automatically
- **Storage** — `Record<string, { data, timestamp }>` inside the Zustand store
- **Benefit** — revisiting a previously-viewed page/filter returns instantly without a network request
- **Category list** — fetched once and never refetched while categories array is populated

---

## Performance Optimizations

| Technique         | Where Used                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `React.memo`      | `PaginationControls` — prevents re-render when parent state unrelated to pagination changes          |
| `useCallback`     | `handleSearch` (Users, Products), `handleLogout` (DashboardShell) — stable function references       |
| `useMemo`         | `skip`, `pageCount` (Users, Products), `currentImage` (Product detail), `theme` (AppProviders)       |
| `next/image`      | Product thumbnails and detail images — automatic lazy loading, format optimization, and CDN caching   |
| Zustand selectors | Components select only the slices they need, minimizing unnecessary re-renders                       |

---

## Folder Structure

```
venture-frontend/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts              # NextAuth API route handler
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard home (protected)
│   ├── login/
│   │   └── page.tsx              # Login form
│   ├── products/
│   │   ├── [id]/page.tsx         # Product detail page
│   │   └── page.tsx              # Products list (search, filter, paginate)
│   ├── users/
│   │   ├── [id]/page.tsx         # User detail page
│   │   └── page.tsx              # Users list (search, paginate)
│   ├── layout.tsx                # Root layout (AppProviders, fonts, metadata)
│   ├── page.tsx                  # Root redirect (session check)
│   └── globals.css
├── components/
│   ├── layout/
│   │   └── DashboardShell.tsx    # AppBar + nav + logout wrapper
│   ├── providers/
│   │   └── AppProviders.tsx      # SessionProvider + MUI ThemeProvider
│   └── shared/
│       └── PaginationControls.tsx # Memoized pagination component
├── lib/
│   ├── api.ts                    # Axios instance (baseURL: dummyjson.com)
│   └── auth.ts                   # NextAuth config (credentials, JWT, callbacks)
├── store/
│   ├── authStore.ts              # Auth state + persist
│   ├── productsStore.ts          # Products state + cache + async actions
│   └── usersStore.ts             # Users state + cache + async actions
├── types/
│   ├── dummyjson.ts              # API response & entity types
│   └── next-auth.d.ts            # Session/JWT type augmentation
├── proxy.ts                      # NextAuth middleware (route protection)
├── next.config.ts                # Image remote patterns for dummyjson CDN
├── package.json
└── tsconfig.json
```

---

## Environment Variables

| Variable           | Description                          | Required |
| ------------------ | ------------------------------------ | -------- |
| `NEXTAUTH_URL`     | Application base URL                 | Yes      |
| `NEXTAUTH_SECRET`  | Random secret for JWT signing        | Yes      |

Reference: `.env.example`

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-random-secret
```

---

## Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/XperienceInWebRakshaSoni22to26/nextjs-admin-dashboard.git
cd nextjs-admin-dashboard

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Set NEXTAUTH_SECRET to a secure random value in .env.local

# 5. Start development server
npm run dev

# 6. Open in browser
# http://localhost:3000
```

---

## Demo Flow

1. **Login** → visit `/login` (or get redirected from `/`)
2. Enter DummyJSON credentials → NextAuth authenticates via `/auth/login`
3. **Dashboard** → welcome screen with summary cards
4. **Users** → browse paginated table, search by name/email, click a name to view user detail
5. **Products** → browse card grid, search or filter by category, click title for detail with image gallery
6. **Logout** → clears session + Zustand state, redirects to `/login`

### Demo Credentials

| Username | Password     |
| -------- | ------------ |
| `emilys` | `emilyspass` |

> Any valid [DummyJSON user](https://dummyjson.com/users) works.

---

## Assessment Checklist

All requirements from the assessment have been implemented:

### Part 1a — Authentication ✅

| Requirement                                  | Status |
| -------------------------------------------- | ------ |
| Admin login page using MUI                   | ✅     |
| Authenticate via DummyJSON `/auth/login`     | ✅     |
| Use NextAuth for login                       | ✅     |
| Store token in Zustand (+ localStorage)      | ✅     |
| Redirect authenticated users to dashboard    | ✅     |
| Protect dashboard routes from unauth access  | ✅     |

### Part 1b — Users Module ✅

| Requirement                                  | Status |
| -------------------------------------------- | ------ |
| Users list with MUI table                    | ✅     |
| Pagination via `limit` & `skip`              | ✅     |
| Search filter                                | ✅     |
| Show name, email, gender, phone, company     | ✅     |
| Single user detail page                      | ✅     |
| "Back to Users" link                         | ✅     |

### Part 1c — Products Module ✅

| Requirement                                  | Status |
| -------------------------------------------- | ------ |
| Products list with MUI grid layout           | ✅     |
| Pagination                                   | ✅     |
| Search bar                                   | ✅     |
| Category filter dropdown                     | ✅     |
| Show image, title, price, category, rating   | ✅     |
| Single product detail page with images       | ✅     |
| "Back to Products" link                      | ✅     |

### Part 2 — Zustand State Management ✅

| Requirement                                  | Status |
| -------------------------------------------- | ------ |
| Auth state in Zustand                        | ✅     |
| Users data state in Zustand                  | ✅     |
| Products data state in Zustand               | ✅     |
| Async actions inside stores for API calls    | ✅     |
| Explanation of why Zustand was chosen        | ✅     |

### Part 3 — UI/UX & Optimization ✅

| Requirement                                  | Status |
| -------------------------------------------- | ------ |
| All UI uses Material-UI                      | ✅     |
| Responsive layouts on all pages              | ✅     |
| `React.memo` used where beneficial           | ✅     |
| `useCallback` / `useMemo` to reduce re-renders | ✅  |
| API-side pagination (not client-side)        | ✅     |
| Client-side caching with comments            | ✅     |

---

## Possible Improvements (Beyond Scope)

These were **not required** by the assessment but could enhance the project further:

- **Debounced search** (300–500 ms) to reduce API calls on rapid typing
- **Skeleton loaders** for tables and card grids during data fetching
- **Empty state UI** when search/filter returns zero results
- **Error boundaries** (`error.tsx`) for graceful error recovery
- **Unit tests** with Vitest + React Testing Library
- **Dark mode** toggle via MUI theme switching
- **Pagination via URL search params** for bookmarkable page state
- **Token refresh** logic using DummyJSON's `refreshToken`

---

## Repository

GitHub: [XperienceInWebRakshaSoni22to26/nextjs-admin-dashboard](https://github.com/XperienceInWebRakshaSoni22to26/nextjs-admin-dashboard)
