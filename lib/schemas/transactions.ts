import { z } from "zod";

export const insertTransactionSchema = z.object({
  id: z.string(),
  amount: z.number().int(),
  payee: z.string(),
  notes: z.string().optional(),
  date: z.coerce.date(), // or z.string() if you're receiving ISO string
  accountId: z.string(),
  categoryId: z.string().optional(),
});

export type InsertTransactionSchema = z.infer<typeof insertTransactionSchema>;
