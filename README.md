# Fridge to Fork

Fridge to Fork is an interactive cooking web app built around a playful mise en place experience: choose what is in your kitchen, generate recipe ideas, and watch the cooking process unfold on an animated stage.

Tagline: **Everything in its place. Everything in its time.**

## Stack

- Next.js App Router, TypeScript strict mode, Tailwind CSS v4
- Framer Motion for interface animation
- GSAP and ScrollTrigger for scroll and stage motion
- Lenis for smooth scrolling
- Zustand for kitchen and cooking-stage state
- Supabase for auth and data
- React Hook Form and Zod for forms

## Phase Status

Production URL: https://fridgetofork-omega.vercel.app

Completed phases:

- Project scaffolded with Next.js, TypeScript, Tailwind v4, ESLint, and pnpm
- Brand tokens, typography, and global app styling added
- Supabase browser and server clients wired with typed schema contracts
- Zustand `useKitchenStore` created for ingredient and cooking-stage state
- Lenis and GSAP ScrollTrigger registered globally
- Custom animated cursor added
- Branded animated app shell replacing starter boilerplate
- Animated ingredient grid, cooking stage, recipe generation, playback system, Supabase data layer, auth, saved recipes, explore/detail pages, polish, and production deployment added

## Local Development

```bash
corepack pnpm install
corepack pnpm dev
```

Create `.env.local` from `.env.example` and fill the required Supabase and AI keys before using data or recipe-generation features.
