import { Hono } from "hono";
import { prisma } from "@/lib/prisma"; 
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { insertAccountSchema } from "@/lib/schemas/account";

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



export default app;
