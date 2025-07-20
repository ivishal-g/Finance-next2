// lib/schemas/account.ts
import { z } from "zod";

export const insertCategorySchema = z.object({
  id: z.string(),
  plaidId: z.string().optional(),
  name: z.string(),
  userId: z.string(),
});

export type InsertCategorychema = z.infer<typeof insertCategorySchema>;
