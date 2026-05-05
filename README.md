## Venture Frontend Technical Assessment

This project implements the requested assessment using:

- Next.js (App Router + TypeScript)
- Material UI (MUI) for all interface components
- Zustand for app state and async actions
- NextAuth credentials flow for authentication
- DummyJSON public REST APIs

## Features Completed

- Admin login page with NextAuth + DummyJSON auth endpoint
- Protected routes (`/dashboard`, `/users`, `/products`) via middleware
- Users list with:
  - API-side pagination (`limit`/`skip`)
  - Search support
  - Single user details page
- Products list with:
  - API-side pagination
  - Search support
  - Category filter
  - Single product details page with image switching UI
- Zustand stores for:
  - Authentication state
  - Users state
  - Products state
- Client-side caching inside Zustand stores for list endpoints (5 minute TTL)
- Responsive MUI layouts on all pages

## Why Zustand?

Zustand was chosen because it has a very small API and footprint, works well for small/medium apps, and supports async actions directly in the store without Redux boilerplate. This keeps code readable and implementation time fast in an assessment setting.

## Caching Strategy

Caching is implemented in both `usersStore` and `productsStore`:

- Keyed by query + pagination params
- Stores API responses in-memory inside Zustand store
- TTL of 5 minutes
- Reuses cached data to avoid repeated list API calls

This improves perceived performance and reduces unnecessary network usage.

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Set `NEXTAUTH_SECRET` in `.env.local` to a secure random value.

4. Start dev server:

```bash
npm run dev
```

5. Visit:

`http://localhost:3000`

## Demo Credentials

DummyJSON sample credentials:

- Username: `emilys`
- Password: `emilyspass`

## Pending Items

- Repository link is pending because this depends on creating a public GitHub repository and pushing this local project.
