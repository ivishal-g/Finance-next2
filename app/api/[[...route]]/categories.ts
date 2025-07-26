import { Hono } from "hono";
import  { prisma }  from "@/lib/prisma"; 
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { insertCategorySchema } from "@/lib/schemas/categories";
import z from "zod";

const app = new Hono()
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertCategorySchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await prisma.categories.update({
        where: {
          id,
          userId: auth.userId,
        },
        data: values,
      });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )

 .delete(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({
      id: z.string().optional(),
    }),
  ),
  zValidator(
    "json",
    insertCategorySchema.pick({
      name: true,
    }).partial(),
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    const values = c.req.valid("json");
 
    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const category = await prisma.categories.findFirst({
  where: {
    id,
    userId: auth.userId,
    name: values.name,
  },
});

if (!category) {
  return c.json({ error: "Not found" }, 404);
}

const data = await prisma.categories.delete({
  where: {
    id,
  },
});

return c.json({ data });

  }
)


  .get(
    "/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await prisma.categories.findMany({
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

    const data = await prisma.categories.findFirst({
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
      return c.json({ error: "categories not found" }, 404);
    }

    return c.json({ data });
  }
)


 .post(
  "/",
  clerkMiddleware(),
  zValidator(
    "json",
    insertCategorySchema.pick({
      name: true,
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await prisma.categories.create({
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

    const data = await prisma.categories.deleteMany({
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
