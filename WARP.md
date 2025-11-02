# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 16 (canary) application for browsing developer events (hackathons, meetups, conferences). The project uses:
- **Next.js App Router** with React 19
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling
- **MongoDB** with Mongoose for data persistence
- **shadcn/ui** components (New York style)
- **PostHog** analytics with custom proxy routes
- **React Compiler** experimental features enabled

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build
# (Outputs to the .next directory used by Vercel for deployment)

# Run linter
npm run lint

# Deploy to Vercel (recommended)
vercel --prod


## Architecture

### Route Organization

The app uses Next.js App Router with route groups for organization:

- **`app/(root)/`** - Public-facing pages (home, about, service)
- **`app/(dashboard)/dashboard/`** - Protected dashboard routes (analytics, users)
  - Nested dynamic routes: `/dashboard/users/[id]`
- **Root routes** - `app/page.tsx` (home), `app/error.tsx`, `app/loading.tsx`

Route groups (folders in parentheses) don't affect URL structure but organize code logically.

### Component Structure

- **`components/`** - Shared React components
  - `EventCard.tsx` - Displays event information with image, location, date/time
  - `LightRays.tsx` - WebGL-based background animation using OGL library
  - `Navbar.tsx` - Site navigation
  - `loader.tsx` - Loading states
  - **`components/ui/`** - shadcn/ui components (path alias configured)

- **`lib/`** - Utility functions and configs
  - `mongodb.ts` - MongoDB connection with caching for serverless
  - `constants.ts` - Static event data
  - `utils.ts` - `cn()` helper for Tailwind class merging

- **`utils/`** - Additional utilities (e.g., `ExploreBtn`)

### Path Aliases

TypeScript and shadcn/ui are configured with `@/*` mapping to root:
```typescript
import { cn } from "@/lib/utils"
import EventCard from "@/components/EventCard"
```

### Database Connection

MongoDB connection uses a singleton pattern with global caching to prevent connection exhaustion in serverless environments. The `connectDB()` function in `lib/mongodb.ts` handles reconnection logic.

**Environment variable required**: `MONGODB_URI` in `.env` or `.env.local`

### Analytics Integration

PostHog is integrated with custom proxy routes (configured in `next.config.ts`) to avoid ad-blockers:
- `/ingest/static/:path*` → PostHog static assets
- `/ingest/:path*` → PostHog API

**Environment variables required**:
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

### Styling Approach

- **Tailwind CSS v4** with custom theme extensions (brand colors, custom breakpoints)
- **Custom fonts**: Schibsted Grotesk (body), Martian Mono (monospace)
- **Color system**: Brand (indigo), accent (amber), neutral grayscale
- **Animation**: Uses `framer-motion`, `tailwindcss-animate`, and custom WebGL shaders

## Key Patterns

### Event Data Structure
Events are defined in `lib/constants.ts` with this shape:
```typescript
{
  slug: string       // URL-safe identifier
  title: string
  image: string      // Path to /public
  location: string
  date: string
  time: string
}
```

### Image Handling
Use Next.js `<Image>` component with explicit width/height. Event images and icons are in `/public`.

### Type Safety
The project uses strict TypeScript. Component props are explicitly typed (see `EventCard` for example).

## Code Quality

### Linting
- ESLint configured with `eslint-config-next` (core-web-vitals + TypeScript)
- Run `npm run lint` before committing
- Ignored directories: `.next/`, `out/`, `build/`

### Formatting
Prettier is installed with `prettier-plugin-tailwindcss` for class sorting.

## Experimental Features

- **React Compiler**: Enabled via `babel-plugin-react-compiler`
- **Turbopack**: File system cache enabled for builds
- **React 19**: Canary features may be in use

## Notes for Development

- This project exports static HTML (`next export`), so features requiring Node.js runtime (ISR, server actions) may not work
- The MongoDB connection is set up but verify if static export is the intended deployment method
- Route group `(root)` has a test layout with "fanf" text - likely needs cleanup
- PostHog proxy prevents tracking blockers; do not remove `/ingest` routes without updating PostHog config
