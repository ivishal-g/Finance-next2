import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { subDays, parse, differenceInDays } from "date-fns";
import { Hono } from "hono";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

const app = new Hono()
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

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;

    const endDate = to
      ? parse(to, "yyyy-MM-dd", new Date())
      : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    // 💰 Totals
    async function fetchFinancialData(userId: string, start: Date, end: Date) {
      const allTransactions = await prisma.transaction.findMany({
        where: {
          date: { gte: start, lte: end },
          account: {
            userId,
            ...(accountId && { id: accountId }),
          },
        },
        select: { amount: true },
      });

      const income = allTransactions
        .filter((t) => t.amount >= 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = allTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = allTransactions.reduce((sum, t) => sum + t.amount, 0);

      return { income, expenses, remaining };
    }

    const currentPeriod = await fetchFinancialData(
      auth.userId,
      startDate,
      endDate
    );

    const lastPeriod = await fetchFinancialData(
      auth.userId,
      lastPeriodStart,
      lastPeriodEnd
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income
    );
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    // 📊 Categories
    const categorizedTransactions = await prisma.transaction.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        amount: { lt: 0 },
        categoryId: { not: null },
        account: {
          userId: auth.userId,
          ...(accountId && { id: accountId }),
        },
      },
      select: {
        amount: true,
        categoryId: true,
        category: {
          select: { name: true },
        },
      },
    });

    const categoryMap = new Map<string, { name: string; value: number }>();
    for (const tx of categorizedTransactions) {
      if (!tx.categoryId || !tx.category?.name) continue;

      const existing = categoryMap.get(tx.categoryId) ?? {
        name: tx.category.name,
        value: 0,
      };

      existing.value += Math.abs(tx.amount);
      categoryMap.set(tx.categoryId, existing);
    }

    const allCategories = Array.from(categoryMap.values()).sort(
      (a, b) => b.value - a.value
    );
    const topCategories = allCategories.slice(0, 3);
    const otherCategories = allCategories.slice(3);
    const otherSum = otherCategories.reduce((sum, c) => sum + c.value, 0);

    const finalCategories = [...topCategories];
    if (otherCategories.length > 0) {
      finalCategories.push({ name: "Other", value: otherSum });
    }

    // 📆 activeDays breakdown using Prisma groupBy
    const activeDays = await prisma.transaction.groupBy({
      by: ["date"],
      where: {
        date: { gte: startDate, lte: endDate },
        account: {
          userId: auth.userId,
          ...(accountId && { id: accountId }),
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Split into income and expenses per day
    const allTransactions = await prisma.transaction.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        account: {
          userId: auth.userId,
          ...(accountId && { id: accountId }),
        },
      },
      select: {
        date: true,
        amount: true,
      },
    });

    const dailyMap = new Map<string, { date: string; income: number; expenses: number }>();
    for (const tx of allTransactions) {
      const key = tx.date.toISOString().split("T")[0];
      const current = dailyMap.get(key) ?? { date: key, income: 0, expenses: 0 };
      if (tx.amount >= 0) current.income += tx.amount;
      else current.expenses += tx.amount;
      dailyMap.set(key, current);
    }

    const finalActiveDays = Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );


    const days = fillMissingDays(
      activeDays,
      startDate,
      endDate
    )

    return c.json({
      data:{
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount:currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        days,
      },
    });
  }
);

export default app;
