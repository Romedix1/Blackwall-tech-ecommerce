# Blackwall Tech — High-Performance E-Commerce & PC Builder

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript%205.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma%207-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-6772E5?style=for-the-badge&logo=stripe&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js_v5-black?style=for-the-badge&logo=auth0&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

<p align="center">
  A cutting-edge, cyberpunk-themed e-commerce platform and custom PC-rig configurator engineered for high-performance hardware enthusiasts.
</p>

### [**Live Site**](https://blackwall-tech-ecommerce.vercel.app/)

[Explore Features](#features) • [Tech Stack](#tech-stack) • [How to Run](#quick-start--how-to-run) • [Configure .env](#how-to-write-env) • [Architecture](#project-structure) • [Testing](#testing)

</div>

---

## Overview

**Blackwall Tech** is a full-stack Next.js application delivering a premium shopping and workstation customization experience. Inspired by futuristic, high-tech aesthetics, it features custom glitch animations, a terminal-inspired dark interface, an interactive component-by-component PC builder with live compatibility and pricing, Stripe checkout, automated transaction emails, comprehensive session management, and a dedicated admin command center.

---

## Features

### Storefront & Hardware Catalog
- **Cyberpunk UI & Visual Polish**: Custom animations, terminal effects, CRT scanline aesthetics, and emerald-neon glow themes.
- **Categorized Hardware**: Browse GPUs, CPUs, Memory, Motherboards, Power Supplies, Storage, and Peripherals.
- **Deep Technical Specifications**: Comprehensive breakdown of hardware specs, badge highlights, and benchmark/performance metrics.
- **Instant Search & Filtering**: Live search query handling with debouncing, multi-criteria filtering, and pagination.

### Custom PC Builder
- **Step-by-Step Rig Assembly**: Interactive builder guiding users through choosing compatible components.
- **Dynamic Price & Specs Calculation**: Real-time totals and budget monitoring powered by client state persistence.
- **Save & Share Builds**: Authenticated users can save custom rigs to their profile or publish them to create unique, shareable permalinks (`/shared-build/[id]`).

### Cart & Seamless Stripe Checkout
- **Slide-out Cart Overlay**: High-speed, responsive cart drawer with quantity adjustment and instant total recalculations.
- **Secure Stripe Integration**: Powered by Stripe Checkout and webhook listeners for reliable payment lifecycle handling.
- **Order Tracking & Notifications**: Generates unique order verification tokens and sends order confirmations with Nodemailer.

### Next-Gen Authentication & Session Security
- **NextAuth v5 (Beta)**: Credentials authentication (Bcrypt hashing) alongside Google and GitHub OAuth providers.
- **Email Verification & Password Reset**: Tokenized, secure email verification and password reset flows.
- **Active Connection Tracker**: Real-time session monitoring displaying client IP address, browser version, operating system, and geolocation (via UAParser).
- **Instant Session Revocation**: Token versioning architecture enabling users to invalidate remote sessions across all devices simultaneously.
- **Upstash Redis Rate Limiting**: Distributed rate limiting protecting critical authentication routes from brute-force attempts.

### Command Center & Dashboards
- **User Dashboard**: Manage order history ("Directives"), saved PC rigs ("Builds"), shipping addresses, account credentials, and active device sessions.
- **Admin Command Center**:
  - **Metrics & Analytics**: Interactive revenue and order volume charts powered by Recharts.
  - **Operatives Management**: User administration, role management (`user`, `admin`, `demoAdmin`).
  - **Directives Control**: Order fulfillment lifecycle management (`pending`, `paid`, `shipped`, `complete`, `failed`).
  - **Inventory Control**: Live stock management and product catalog maintenance.
  - **System Audit Logs**: Real-time logging of administrative and security events.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Route Handlers) |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) (with persistent client storage) |
| **Data Visualizations** | [Recharts](https://recharts.org/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) (Neon / Supabase), [Prisma ORM 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) |
| **Payments** | [Stripe](https://stripe.com/) (`stripe`, `@stripe/stripe-js`) |
| **Security & Rate Limiting** | [Upstash Redis](https://upstash.com/) (`@upstash/ratelimit`, `@upstash/redis`), [UA-Parser-JS](https://faisalman.github.io/ua-parser-js/) |
| **Mailing** | [Nodemailer](https://nodemailer.com/) (Gmail SMTP / Custom Transporter) |
| **Testing** | [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/), [Playwright](https://playwright.dev/) |
| **Tooling & Quality** | [TypeScript](https://www.typescriptlang.org/), [ESLint 9](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/), [lint-staged](https://github.com/lint-staged/lint-staged) |

---

## Project Structure

```text
blackwall-tech-ecommerce/
├── prisma/
│   ├── data/                 # Seed data (categories, products, mock specs)
│   ├── migrations/           # Database migration files
│   ├── schema.prisma         # Prisma schema definition (User, Product, Order, Build, etc.)
│   └── seed.ts               # Database seeding script
├── public/                   # Static assets, product imagery, icons
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication routes (login, register, forgot-password, reset)
│   │   ├── (home)/           # Public storefront (catalog, categories, product details, pc-builder, policies)
│   │   ├── api/              # API Route Handlers (auth, orders, stripe webhook, e2e-reset, verify)
│   │   ├── checkout/         # Checkout experience and post-purchase confirmation
│   │   ├── dashboard/        # User and Admin Command Center
│   │   ├── shared-build/     # Publicly accessible shared PC build pages
│   │   ├── globals.css       # Tailwind CSS v4 design tokens, theme variables, animations
│   │   └── layout.tsx        # Root application layout and providers
│   ├── components/
│   │   ├── layout/           # Global Navbar, Mobile Navigation, Footer, Cart Drawer
│   │   ├── shared/           # Reusable domain components (product cards, modals, buttons)
│   │   └── ui/               # Base UI primitives
│   ├── hooks/                # Custom hooks (useCart, useBuilder, useDebounce, etc.)
│   ├── lib/
│   │   ├── actions/          # Next.js Server Actions (auth, cart, build, checkout, admin, search)
│   │   ├── mail/             # Email templates and delivery handlers
│   │   ├── prisma/           # Prisma client singleton configuration
│   │   ├── zod/              # Schema validations
│   │   ├── logger.ts         # System and audit logging utilities
│   │   └── stripe.ts         # Stripe SDK initialization
│   ├── types/                # TypeScript type definitions
│   └── auth.ts               # NextAuth v5 configuration and callbacks
├── tests/                    # Vitest unit & component test suite and mocks
├── testsE2E/                 # Playwright end-to-end test scenarios
├── playwright.config.ts      # Playwright E2E configuration
├── vitest.config.ts          # Vitest configuration
└── package.json              # Project dependencies and npm scripts
```

---

## Quick Start & How to Run

Follow these steps to set up Blackwall Tech locally on your machine.

### Prerequisites
- **Node.js**: `v20.x` or higher ([Download Node.js](https://nodejs.org/))
- **Package Manager**: `npm` (bundled with Node.js), `pnpm`, or `bun`
- **PostgreSQL Database**: Free cloud database via [Neon](https://neon.tech) / [Supabase](https://supabase.com) or a local PostgreSQL instance
- **Stripe Account**: Free developer account on [Stripe](https://stripe.com) for checkout integration
- **Upstash Account**: Free serverless Redis on [Upstash](https://upstash.com) for API rate limiting
- **SMTP Provider**: Gmail Account (with an [App Password](https://myaccount.google.com/apppasswords)) for transactional emails

---

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Romedix1/Blackwall-tech-ecommerce.git
cd Blackwall-tech-ecommerce
```

#### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```
> [!NOTE]
> Running `npm install` automatically triggers `prisma generate` via the `postinstall` script to build the local Prisma client inside `./generated/prisma`.

#### 3. Create and Populate `.env`
Create your `.env` file in the project root by copying the template:
```bash
cp .env.example .env
```
Open `.env` in your editor and fill in your credentials. (See the detailed [How to Write `.env`](#-how-to-write-env) guide below for exact formats).

#### 4. Run Database Migrations & Seed Data
Apply Prisma schema migrations to your PostgreSQL database and populate the hardware catalog with initial categories and products:
```bash
# Push database migrations
npx prisma migrate dev

# Seed categories and products into the database
npx tsx prisma/seed.ts
```

#### 5. (Optional) Run Stripe Webhook Listener
If you wish to test complete checkout flows and automated order confirmation emails locally, install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and forward events:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```
*Copy the printed `whsec_...` webhook signing secret into your `.env` as `STRIPE_WEBHOOK_SECRET`.*

#### 6. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start exploring the storefront, PC builder, and dashboard.

---

## How to Write `.env`

Create a file named `.env` in the root of your project. Below is a complete template ready to copy and fill:

```env
# ==============================================================================
# DATABASE (PostgreSQL / Neon / Supabase)
# ==============================================================================
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/[YOUR-DB]?sslmode=require"

# ==============================================================================
# APPLICATION
# ==============================================================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==============================================================================
# NEXTAUTH / AUTH.JS v5
# ==============================================================================
# Generate with: openssl rand -base64 32  OR  npx auth secret
AUTH_SECRET="your-generated-32-byte-secret"
AUTH_TRUST_HOST=true

# GitHub OAuth Provider (https://github.com/settings/developers)
# Callback URL: http://localhost:3000/api/auth/callback/github
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"

# Google OAuth Provider (https://console.cloud.google.com/apis/credentials)
# Callback URL: http://localhost:3000/api/auth/callback/google
AUTH_GOOGLE_ID="your_google_client_id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your_google_client_secret"

# ==============================================================================
# EMAIL SERVICE (Nodemailer / Gmail SMTP)
# ==============================================================================
GMAIL_USER="your-email@gmail.com"
# 16-character Google App Password (not your normal Gmail password)
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"

# ==============================================================================
# STRIPE PAYMENTS
# ==============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51..."
STRIPE_SECRET_KEY="sk_test_51..."
# From Stripe Dashboard Webhook settings or Stripe CLI (stripe listen)
STRIPE_WEBHOOK_SECRET="whsec_..."

# ==============================================================================
# UPSTASH REDIS (Rate Limiting)
# ==============================================================================
UPSTASH_REDIS_REST_URL="https://[YOUR-ENDPOINT].upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token"

# ==============================================================================
# OPTIONAL / TESTING
# ==============================================================================
# SUPABASE_PROJECT_REF="your-supabase-ref"
# TEST_USER_ID="test-user-id"
```

---

### Detailed Variable Instructions

#### 1. Database (`DATABASE_URL`)
- **Neon**: Create a project at [neon.tech](https://neon.tech). Copy the `Pooled` or `Direct` connection string with `?sslmode=require`.
- **Supabase**: Create a project at [supabase.com](https://supabase.com). Go to **Project Settings > Database > Connection Strings > URI** (use port `5432` or pooled `6543`).
- **Local PostgreSQL**: `postgresql://postgres:password@localhost:5432/blackwall_db`

#### 2. Auth Secret (`AUTH_SECRET` & `AUTH_TRUST_HOST`)
- Run either command in your terminal to generate a cryptographically secure key:
  ```bash
  openssl rand -base64 32
  # or
  npx auth secret
  ```
- Keep `AUTH_TRUST_HOST=true` during local development or when hosting behind reverse proxies (e.g. Vercel / Docker / Nginx).

#### 3. GitHub OAuth (`AUTH_GITHUB_ID` & `AUTH_GITHUB_SECRET`)
1. Go to [GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Set **Homepage URL** to `http://localhost:3000`.
4. Set **Authorization callback URL** to:
   ```text
   http://localhost:3000/api/auth/callback/github
   ```
5. Click **Register Application**, then generate a **Client Secret**.

#### 4. Google OAuth (`AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`)
1. Go to the [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials > OAuth client ID**.
3. Select Application type: **Web application**.
4. Add **Authorized redirect URIs**:
   ```text
   http://localhost:3000/api/auth/callback/google
   ```
5. Copy the generated **Client ID** and **Client Secret**.

#### 5. Gmail SMTP (`GMAIL_USER` & `GMAIL_APP_PASSWORD`)
Used for sending email verification tokens and order confirmations:
1. Log into your Google Account and ensure **2-Step Verification** is enabled.
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords).
3. Create a new App Password (e.g., named "Blackwall Tech").
4. Copy the generated 16-character string into `GMAIL_APP_PASSWORD`.

#### 6. Stripe (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`)
1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) in **Test Mode**.
2. Copy your **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`).
3. For local webhooks: run `stripe listen --forward-to localhost:3000/api/webhook` and copy the signing secret (`whsec_...`).

#### 7. Upstash Redis (`UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`)
Used for distributed rate limiting on auth and sensitive routes:
1. Log into [Upstash Console](https://console.upstash.com/).
2. Create a free **Redis Database**.
3. In the database **Details** tab, scroll to the **REST API** section.
4. Select **.env** and copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Builds the production bundle |
| `npm run start` | Runs the production build server |
| `npm run lint` | Runs ESLint to check for code quality and errors |
| `npm test` | Runs the unit and component test suite via **Vitest** |
| `npx playwright test` | Executes End-to-End browser tests across Chromium |
| `npx playwright show-report` | Opens the HTML test report for the latest Playwright run |
| `npx prisma studio` | Opens Prisma Studio GUI to inspect and manipulate database records |

---

## Testing

### Unit & Component Tests (Vitest)
Unit and component tests verify actions, utility functions, state management, and UI behavior:
```bash
npm test
```

### End-to-End Tests (Playwright)
E2E tests simulate complete user journeys including:
- User registration and authentication flow
- Custom PC assembly and compatibility verification
- Product catalog browsing and search
- Cart management and Stripe checkout pipeline
- User dashboard settings, address management, and session controls

Run the full E2E suite:
```bash
npx playwright test
```

---

## Security Architecture

1. **Role-Based Access Control (RBAC)**:
   - `user`: Standard customer access to storefront, cart, orders, and personal PC builds.
   - `admin`: Full administrative control over inventory, orders, operatives, and system audit logs.
   - `demoAdmin`: Sandboxed administrative overview with write protections to safeguard production state.
2. **Session Verification & Invalidation**:
   - `tokenVersion` increments on critical account actions (such as password changes), instantly revoking existing JWTs across all active sessions.
   - `ActiveConnection` model logs unique device fingerprints (IP, browser, OS, city/country) with remote session kill switches.
3. **Brute Force Protection**:
   - Upstash Redis rate limiting applied on authentication and password reset endpoints.

---

## Asset Credits & Acknowledgments

Hardware images, technical product specifications, and media assets are credited in [CREDITS.md](./CREDITS.md), including assets from:
- NVIDIA Media Center (GeForce RTX 5070, 4070 SUPER, 4090)
- AMD Media Resources (Radeon RX 7900 Series, Ryzen 9 7950X, Ryzen 9 PRO 7945)
- Intel Newsroom (Intel Core Ultra 9 285K, Core i9-13900K)
- G.Skill & TeamGroup (Trident Z5, Flare X5, T-Force XTREEM, DELTA RGB)
- ASUS ROG & SteelSeries (ROG Strix Keyboards, Raikiri Controllers, Aerox Mice)

---

## License

This project is licensed under the MIT License — feel free to explore, customize, and build upon it.
