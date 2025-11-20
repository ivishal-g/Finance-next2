This is a personal finance dashboard built with [Next.js](https://nextjs.org) (App Router) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It uses Prisma + PostgreSQL for persistence and Clerk for authentication.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root based on `.env.example`.

Required variables:

- `DATABASE_URL` – PostgreSQL connection string used by Prisma.
- `NEXT_PUBLIC_API_URL` – Base URL for the internal Hono API client (usually `http://localhost:3000/api`).

Authentication (Clerk) related variables (names depend on your Clerk setup; example):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

> Do **not** commit the real `.env` file. Only `.env.example` should be tracked.

### 3. Database & Prisma

Run Prisma migrations and generate the client:

```bash
npx prisma migrate dev
npx prisma generate
```

Optionally seed the database (uses `scripts/seed.ts`):

```bash
npx ts-node --project tsconfig.json scripts/seed.ts
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` – Start the Next.js dev server.
- `npm run build` – Run `prisma generate` and build the Next.js app.
- `npm run start` – Start the production server.
- `npm run lint` – Run ESLint.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Finance-next2
