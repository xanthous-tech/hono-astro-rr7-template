# Hono + Astro + React Router v7 Boilerplate

This is a boilerplate for building web applications with [Remix](https://remix.run), [Astro](https://astro.build) and [Hono](https://hono.dev).

## Overview

- 100% TypeScript
- Server side tech stack:
  - [x] Hono (for server)
    - [ ] Hono OpenAPI generator
  - [x] Postgres
  - [x] DrizzleORM (to operate Postgres)
  - [x] Redis
  - [x] BullMQ (via Redis)
    - [x] Dashboard (via bull-board)
  - [x] Minio
  - [x] Auth (using Lucia's Best Practices)
  - [x] Stripe
    - [x] Server-side Webhooks
    - [x] Stripe Checkout + Billing Portal
  - [ ] Emails (via Resend / Nodemailer)
    - [x] Magic Link / OTP
    - [x] Welcome Email after Subscription
- Client side tech stack:
  - [x] TailwindCSS v4
  - [x] shadcn/ui
  - [x] react-router v7
  - [x] @tanstack/react-query (data fetching)
  - [x] react-hook-form (form handling)
  - [x] Jotai (state management)
  - [x] Astro v5 (for static content)
    - [x] Landing Page
      - [x] Hero
      - [x] Features
      - [x] Pricing
      - [x] FAQ
    - [x] Blog
    - [x] Docs (via Starlight)
    - [ ] SEO features
      - [x] Sitemap
      - [ ] RSS
      - [ ] OpenGraph
  - [x] internationalization (i18n) (via i18next on both React and Astro)
- Build system
  - [x] Vite
  - [x] BiomeJS (for linting and formatting)
  - [x] tsup (for server code bundling)

### Repository Structure

I do not opt for using any monorepo setup because it is very complicated to run and deploy. All code resides in the same repository, with the following structure:

- `/app` - App code (React Router)
- `/content` - Static content (blog, docs)
- `/migrations` - DrizzleORM migrations
- `/public` - Public assets
- `/server` - Hono server code
- `/site` - Astro code (with minimal amount of simple react components that are used strictly by Astro and not by the webapp)

### Why Hono?

Hono has a lot of modern features that make it better than plain express (which I used to use) for building backend for any application (web, native app, API SaaS):

- Runtime agnostic
- Zod validator middleware
- Hono client (no need for tRPC)
- Request Streaming
- OpenAPI documentation generation


### What is BullMQ?

BullMQ is a Redis-backed task queue and it provides a lot of important functionalities for building a scalable application at the start. At the age of AI, it is increasingly common to run long-running tasks in the background (LLM request chains), handle rate-limiting, running I/O intensive tasks in JS via horizontal scaling, and even interop with Python code. BullMQ unlocks all the possibilities.

### Why Astro + React-router v7?

React Router v7 is used for the web-app, alongside of Astro for static content (landing page, blog, docs). At the time of writing, React-router v7 provides framework mode (aka Remix) and also provides server-side rendering and static prerendering. However, the static content generation is barebones and requires a lot of thought to bring up to speed with Astro. Astro SSR is turned on only for dynamic paths (`/app/*`) that is taken over by React Router on the client side. Astro and Hono is not served and integrated in the same project yet, and currently Astro is configured to be deployed on Cloudflare.

After over 1 year of maintenance with production grade apps, I found that if the webapp is complex, it is best to keep the app client-side only because this can ensure that the page transitions are fast after the initial load. SSR is nice only when the server-side logic is complex and the rendering is simple. Most of the web applications I work with do not fall into this category anymore.

By doing code split like this, I can also look into re-using the React Router frontend for native mobile apps via Capacitor JS. This is a future plan.

### Authentication

Authentication is done with Lucia's best practices (Lucia is no longer a library) using server-side sessions served via Cookies. Cookie is used and shared across domains between the site and the API server. So it is best to host the server under a subdomain and the site under the main domain.
