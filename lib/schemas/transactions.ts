import { z } from "zod";

export const insertTransactionSchema = z.object({
  id: z.string(),
  amount: z.number().int(),
  payee: z.string(),
  notes: z.string().optional(),
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().optional(),
});

export const createTransactionSchema = insertTransactionSchema.omit({
  id: true,
});
