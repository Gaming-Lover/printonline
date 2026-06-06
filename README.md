# PrintHub

PrintHub is a production-ready SaaS print-ordering application built with Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma, Supabase PostgreSQL/Storage, Razorpay, Zod, React Hook Form, and TanStack Query.

## Features

- Email/password registration and login with bcrypt-hashed passwords and signed HTTP-only sessions.
- Protected customer and role-based admin routes via Next.js middleware.
- PDF/JPG/PNG uploads up to 50 MB into a private Supabase Storage `documents` bucket.
- PDF page counting with `pdf-parse`; images count as one page.
- Admin-configurable BW and color pricing.
- Razorpay order creation, Checkout integration, frontend signature verification endpoint, and verified webhook handling.
- Customer dashboard, order history, checkout, receipts, and status tracking.
- Admin dashboard, revenue cards, order management, pricing management, and print queue.
- Validation with Zod, rate limiting, secure headers, webhook verification, and file validation.

## Environment

Copy `.env.example` to `.env` and fill:

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
```

Optional seed admin:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

## Local development

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. Use the PostgreSQL connection string as `DATABASE_URL`.
3. Run `supabase-setup.sql` in the Supabase SQL editor to create the private `documents` bucket and storage policy.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it to the browser.

## Razorpay setup

1. Create Razorpay API keys and set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
2. Configure a webhook pointing to `/api/webhooks/razorpay`.
3. Add `payment.captured` as an event.
4. Store the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.

## Deployment on Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add all environment variables in Vercel Project Settings.
4. Set the build command to `npm run build`.
5. Run `npm run db:deploy` against production before first traffic, or configure a release job.
6. Set `NEXTAUTH_URL` to your Vercel production URL.

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
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
