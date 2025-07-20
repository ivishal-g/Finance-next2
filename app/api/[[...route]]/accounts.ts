import { Hono } from "hono";
import { prisma } from "@/lib/prisma"; 
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { insertAccountSchema } from "@/lib/schemas/account";
import z from "zod";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await prisma.account.findMany({
        where: {
          userId: auth.userId, 
        },
        select: {
          id: true,
          name: true,
        },
      });

      return c.json({ data });
    }
  )

  .get(
  "/:id",
  zValidator("param", z.object({
    id: z.string().optional(),
  })),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await prisma.account.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!data) {
      return c.json({ error: "Account not found" }, 404);
    }

    return c.json({ data });
  }
)


 .post(
  "/",
  clerkMiddleware(),
  zValidator(
    "json",
    insertAccountSchema.pick({
      name: true,
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await prisma.account.create({
      data: {
        id: crypto.randomUUID(), 
        name: values.name,
        userId: auth.userId,
      },
    });

    return c.json({ data });
  }
)

  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await prisma.account.deleteMany({
      where: {
        id: {
          in: values.ids,
        },
        userId: auth.userId, 
      },
    });

    return c.json({ data });
  }
);



export default app;
