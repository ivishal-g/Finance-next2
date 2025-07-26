import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { parse, subDays } from "date-fns";
import { createTransactionSchema } from "@/lib/schemas/transactions";
import { nanoid } from "nanoid"; 






const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      try {
        const transactions = await prisma.transaction.findMany({
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
            accountId: accountId || undefined,
            account: {
              userId: auth.userId,
            },
          },
          orderBy: {
            date: "desc",
          },
          select: {
            id: true,
            amount: true,
            payee: true,
            notes: true,
            date: true,
            accountId: true,
            account: {
              select: {
                name: true,
              },
            },
            categoryId: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        });

        

        const formatted = transactions.map((t) => ({
          id: t.id,
          amount: t.amount,
          payee: t.payee,
          notes: t.notes,
          date: t.date,
          accountId: t.accountId,
          account: t.account.name,
          categoryId: t.categoryId,
          category: t.category?.name || null,
        }));

        return c.json(formatted);
      } catch (err) {
        console.error("❌ Prisma error:", err);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  .get(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const transaction = await prisma.transaction.findFirst({
        where: {
          id,
          account: {
            userId: auth.userId,
          },
        },
        select: {
          id: true,
          date: true,
          categoryId: true,
          payee: true,
          amount: true,
          notes: true,
          accountId: true,
        },
      });

      if (!transaction) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data: transaction });
    } catch (error) {
      console.error("❌ Prisma error:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
  )

  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      createTransactionSchema
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const data = await prisma.transaction.create({
          data: {
            amount: values.amount,
            payee: values.payee,
            notes: values.notes,
            date: values.date,
            accountId: values.accountId, 
            categoryId: values.categoryId,
          },
        });
        return c.json({ data });
      } catch (err) {
        console.error("❌ Error creating transaction:", err);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(createTransactionSchema)
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const payload = values.map((value) => ({
          id: nanoid(), // or use any custom ID logic
          ...value,
        }));

        await prisma.transaction.createMany({
          data: payload,
          skipDuplicates: true, // optional
        });

        // Optionally return the generated IDs
        return c.json({ data: payload.map((t) => t.id) });
      } catch (err) {
        console.error("❌ Bulk create error:", err);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  .post(
  "/bulk-delete",
  clerkMiddleware(),
  zValidator(
    "json",
    z.object({
      ids: z.array(z.string()),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { ids } = c.req.valid("json");
console.log("🧾 ids received:", ids);




    console.log(ids);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log(auth.userId)

    try {
      // Step 1: Verify ownership and get valid transaction IDs
      const ownedTransactions = await prisma.transaction.findMany({
        where: {
          id: { in: ids },
          account: {
            userId: auth.userId,
          },
        },
        select: {
          id: true,
        },
      });

      const ownedIds = ownedTransactions.map((t) => t.id);

      // Step 2: Delete those transactions
      const deleted = await prisma.transaction.deleteMany({
        where: {
          id: { in: ownedIds },
        },
      });

      return c.json({ data: ownedIds });
    } catch (error) {
      console.error("❌ Bulk delete error:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
  )

  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      createTransactionSchema
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        // Step 1: Check if the transaction belongs to the user
        const existing = await prisma.transaction.findFirst({
          where: {
            id,
            account: {
              userId: auth.userId,
            },
          },
        });

        if (!existing) {
          return c.json({ error: "Not found or unauthorized" }, 404);
        }

        // Step 2: Update the transaction
        const updated = await prisma.transaction.update({
          where: { id },
          data: values,
        });

        return c.json({ data: updated });
      } catch (error) {
        console.error("❌ Error updating transaction:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  .delete(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Step 1: Verify transaction belongs to the user
      const transaction = await prisma.transaction.findFirst({
        where: {
          id,
          account: {
            userId: auth.userId,
          },
        },
        select: { id: true },
      });

      if (!transaction) {
        return c.json({ error: "Not found or unauthorized" }, 404);
      }

      // Step 2: Delete transaction
      await prisma.transaction.delete({
        where: { id },
      });

      return c.json({ data: { id } });
    } catch (error) {
      console.error("❌ Delete error:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
)





export default app;
