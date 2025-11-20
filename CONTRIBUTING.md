# Contributing

Thank you for your interest in contributing to this project!

## Local Development Setup

1. **Fork & clone** the repository.
2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create your `.env` file** based on `.env.example` in the project root.

   At minimum you will need:
   - `DATABASE_URL` – PostgreSQL URL used by Prisma.
   - `NEXT_PUBLIC_API_URL` – Base URL for the app API (e.g. `http://localhost:3000/api`).
   - Clerk-related keys (see `.env.example`).

4. **Setup the database**:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. (Optional) **Seed the database** for demo data:

   ```bash
   npx ts-node --project tsconfig.json scripts/seed.ts
   ```

6. **Run the dev server**:

   ```bash
   npm run dev
   ```

## Development Guidelines

- Use existing patterns and file structure when adding new features.
- Keep secrets out of the repo – only update `.env.example` when new variables are required.
- Run `npm run lint` before submitting a PR.

## Pull Requests

- Create a feature branch off of `main`.
- Make sure the app builds and runs locally.
- Include a clear description of the change and any new environment variables.

## Reporting Issues

If you find a bug or have a feature request, please open an issue with as much detail as possible (steps to reproduce, screenshots, etc.).
