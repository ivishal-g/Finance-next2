// lib/schemas/account.ts
import { z } from "zod";

export const insertAccountSchema = z.object({
  id: z.string(),
  plaidId: z.string().optional(),
  name: z.string(),
  userId: z.string(),
});

export type InsertAccountInput = z.infer<typeof insertAccountSchema>;
