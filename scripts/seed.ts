import { config } from "dotenv";
import { subDays, eachDayOfInterval, format } from "date-fns";
import  {prisma}  from "@/lib/prisma";
import { convertAmountToMiliunits } from "@/lib/utils";

config({ path: ".env" });

const SEED_USER_ID = "user_303vsgpORs0UJT30gjItKEwijFf";

const SEED_CATEGORIES = [
  { id: "category_1", name: "Food", userId: SEED_USER_ID, plaidId: null },
  { id: "category_2", name: "Rent", userId: SEED_USER_ID, plaidId: null },
  { id: "category_3", name: "Utitlities", userId: SEED_USER_ID, plaidId: null },
  { id: "category_7", name: "Clothing", userId: SEED_USER_ID, plaidId: null },
];

const SEED_ACCOUNTS = [
  { id: "account_1", name: "Checking", userId: SEED_USER_ID, plaidId: null },
  { id: "account_2", name: "Savings", userId: SEED_USER_ID, plaidId: null },
];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

type SeedTransaction = {
  id: string;
  accountId: string;
  categoryId: string;
  date: Date;
  amount: number;
  payee: string;
  notes: string;
};

const SEED_TRANSACTIONS: SeedTransaction[] = [];

const generateRandomAmount = (category: (typeof SEED_CATEGORIES)[0]) => {
  switch (category.name) {
    case "Rent":
      return Math.random() * 400 + 90;
    case "Utitlities":
      return Math.random() * 200 + 50;
    case "Food":
      return Math.random() * 30 + 10;
    case "Transportation":
    case "Health":
      return Math.random() * 50 + 15;
    case "Entertainment":
      return Math.random() * 100 + 20;
    case "Clothing":
    case "Miscellaneous":
      return Math.random() * 100 + 20;
    default:
      return Math.random() * 50 + 10;
  }
};

const generateTransactionForDay = (day: Date) => {
  const numTransactions = Math.floor(Math.random() * 4) + 1;

  for (let i = 0; i < numTransactions; i++) {
    const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
    const isExpense = Math.random() > 0.6;
    const amount = generateRandomAmount(category);
    const formattedAmount = convertAmountToMiliunits(isExpense ? -amount : amount);

    SEED_TRANSACTIONS.push({
      id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
      accountId: SEED_ACCOUNTS[0].id,
      categoryId: category.id,
      date: day,
      amount: formattedAmount,
      payee: "Merchant",
      notes: "Random transaction",
    });
  }
};

const generateTransactions = () => {
  const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
  days.forEach((day) => generateTransactionForDay(day));
};

generateTransactions();

const main = async () => {
  try {
    // Delete existing data
    await prisma.transaction.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.categories.deleteMany({});

    // Insert new data
    await prisma.categories.createMany({ data: SEED_CATEGORIES });
    await prisma.account.createMany({ data: SEED_ACCOUNTS });
    await prisma.transaction.createMany({ data: SEED_TRANSACTIONS });

    console.log("🌱 Database seeding completed.");
  } catch (error) {
    console.error("❌ Error during seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
