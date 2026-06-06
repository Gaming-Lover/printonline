# PrintHub

PrintHub is a production-ready SaaS print-ordering application built with Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma, Supabase PostgreSQL/Storage, Razorpay, Zod, React Hook Form, and TanStack Query.

## Features

- Customer registration/login with bcrypt-hashed passwords and signed HTTP-only sessions.
- Dedicated admin login at `/admin/login` using the default ID/password `admin` / `admin123` or values from `DEFAULT_ADMIN_ID` and `DEFAULT_ADMIN_PASSWORD`.
- Protected customer and role-based admin routes via Next.js middleware.
- PDF/JPG/PNG uploads up to 50 MB into a private Supabase Storage `documents` bucket.
- PDF page counting with `pdf-parse`; images count as one page.
- Admin-configurable BW and color pricing.
- Admin settings page at `/admin/settings` for print prices, Razorpay key ID, Razorpay key secret, and webhook secret.
- Razorpay order creation, Checkout integration, frontend signature verification endpoint, and verified webhook handling.
- Customer dashboard, order history, checkout, receipts, and status tracking.
- Admin dashboard, revenue cards, order management, pricing management, and print queue.
- Validation with Zod, rate limiting, secure headers, webhook verification, and file validation.

## Environment variables

Copy `.env.example` to `.env` for local development, or add the same variables in Vercel.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXTAUTH_SECRET=generate-a-32-character-minimum-secret
NEXTAUTH_URL=http://localhost:3000
DEFAULT_ADMIN_ID=admin
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_EMAIL=admin@printhub.local
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` can also be entered later from `/admin/settings`. Secrets saved from the admin page are encrypted before being stored in PostgreSQL using `NEXTAUTH_SECRET` as key material.

> Production note: change `DEFAULT_ADMIN_PASSWORD` before deploying publicly. The requested `admin/admin123` login is enabled for first-run setup only and should not remain unchanged for production traffic.

## Local development

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open:

- Customer site: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin/login>
- In-app hosting guide: <http://localhost:3000/readme>

## Supabase setup

1. Create a Supabase project.
2. Go to **Project Settings → Database → Connection string** and copy the pooled or direct PostgreSQL URL into `DATABASE_URL`.
3. Run Prisma migrations with `npm run db:migrate` locally or `npm run db:deploy` in deployment.
4. Open **SQL Editor** in Supabase.
5. Paste and run `supabase-setup.sql` to create the private `documents` bucket with PDF/JPEG/PNG restrictions.
6. Copy `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` into your environment.
7. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code.

## Razorpay setup

1. Create or open your Razorpay account.
2. Go to **Account & Settings → API Keys** and generate a key pair.
3. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env` or enter them from `/admin/settings` after logging in.
4. Go to **Webhooks** and create a webhook URL:
   `https://your-vercel-domain.vercel.app/api/webhooks/razorpay`
5. Select the `payment.captured` event.
6. Generate a webhook secret and set `RAZORPAY_WEBHOOK_SECRET` or save it in `/admin/settings`.
7. Test one payment in Razorpay test mode before switching to live mode.

## Complete Vercel hosting process

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Create the Supabase project and run the setup in the section above.
3. Create Razorpay test credentials and webhook secret.
4. Go to <https://vercel.com/new> and import the repository.
5. Select the Next.js framework preset.
6. Add all variables from `.env.example` in **Project Settings → Environment Variables**.
7. Use these commands:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: leave empty for Next.js
8. Deploy the project.
9. Run `npm run db:deploy` against the production `DATABASE_URL` from a trusted terminal or CI job.
10. Open `https://your-vercel-domain.vercel.app/admin/login`.
11. Login with ID `admin` and password `admin123` unless you changed `DEFAULT_ADMIN_ID` and `DEFAULT_ADMIN_PASSWORD`.
12. Open **Admin → Settings** and enter BW price, color price, Razorpay Key ID, Razorpay Key Secret, and Razorpay Webhook Secret.
13. Open Razorpay webhook settings and make sure the endpoint uses your final Vercel production domain.
14. Place a test customer order and confirm it appears in **Admin → Print queue** after payment verification.
15. Change the default admin password environment variable before going live.

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/admin/login`
- `POST /api/upload`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/[id]`
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `POST /api/webhooks/razorpay`
- `GET /api/admin/orders`
- `PATCH /api/admin/pricing`
- `GET /api/admin/revenue`
- `PATCH /api/admin/order-status`

## Admin workflow

1. Visit `/admin/login`.
2. Login with `admin/admin123` for first-run setup.
3. Open `/admin/settings` to update prices and payment API details.
4. Use `/admin/orders` to download files and mark orders as printing or printed.
5. Use `/admin/queue` to track waiting, printing, and printed jobs.

## Fixing npm install / 403 registry errors

This repository includes a project `.npmrc` that pins npm to the public npm registry and disables non-essential audit/funding calls during install.

Before installing dependencies, run:

```bash
npm run npm:doctor
```

If the doctor prints `HTTP 403`, the machine or container is blocked from reaching the npm registry by a proxy or network policy. That is not caused by `@hookform/resolvers` or any specific dependency in this project. To fix it:

1. Allow outbound HTTPS traffic to `https://registry.npmjs.org/`.
2. Remove or correct blocking proxy environment variables such as `npm_config_http_proxy`, `npm_config_https_proxy`, `HTTP_PROXY`, and `HTTPS_PROXY`.
3. If your company requires a private npm mirror, set it explicitly:

```bash
npm config set registry https://your-approved-npm-mirror.example.com/
npm install
```

For first-time setup on a machine with working npm access, run:

```bash
npm run setup
```
