// lib/routes/transactions.ts

import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { insertTransactionSchema } from "@/lib/schemas/transactions";
import { z } from "zod";
import { parse, subDays } from "date-fns";

const app = new Hono()
// GET: List transactions with optional filters
  .get(
      "/",
      clerkMiddleware(),
      zValidator(
        "query",
        z.object({
          from: z.string().optional(),
          to: z.string().optional(),
          accountId: z.string().optional(),
        })
      ),
      async (c) => {
        const auth = getAuth(c);
        const { from, to, accountId } = c.req.valid("query");


        if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);

        const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

        const data = await prisma.transaction.findMany({
          where: {
            account: {
              userId: auth.userId,
              ...(accountId && { id: accountId }),
            },
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          orderBy: { date: "desc" },
          include: {
            account: { select: { name: true } },
            category: { select: { name: true } },
          },
        });


        return c.json({ data });
      }
    )

  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", insertTransactionSchema.partial()),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const data = await prisma.transaction.update({
        where: {
          id,
          account: { userId: auth.userId },
        },
        data: values,
        include: {
          account: { select: { name: true } },
          category: { select: { name: true } },
        },
      }).catch(() => null);

      if (!data) return c.json({ error: "Transaction not found or unauthorized" }, 404);

      return c.json({ data });
    }
  )

  // DELETE: Delete transaction by id
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const existing = await prisma.transaction.findFirst({
        where: {
          id,
          account: { userId: auth.userId },
        },
      });

      if (!existing) return c.json({ error: "Transaction not found or unauthorized" }, 404);

      const data = await prisma.transaction.delete({ where: { id } });

      return c.json({ data });
    }
  )

  // GET: Get transaction by id
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const data = await prisma.transaction.findFirst({
        where: {
          id,
          account: { userId: auth.userId },
        },
        include: {
          account: { select: { name: true } },
          category: { select: { name: true } },
        },
      });

      if (!data) return c.json({ error: "Transaction not found" }, 404);

      return c.json({ data });
    }
  )

  // POST: Create a transaction
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const account = await prisma.account.findFirst({
        where: {
          id: values.accountId,
          userId: auth.userId,
        },
      });

      if (!account) return c.json({ error: "Invalid account access" }, 403);

      const data = await prisma.transaction.create({
        data: {
          ...values,
          id: crypto.randomUUID(),
        },
      });

      return c.json({ data });
    }
  )

  // POST: Bulk delete transactions
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);
      const { ids } = c.req.valid("json");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const data = await prisma.transaction.deleteMany({
        where: {
          id: { in: ids },
          account: { userId: auth.userId },
        },
      });

      return c.json({ data });
    }
  )

export default app;
