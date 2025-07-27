import { Suspense } from "react";
import { TransactionsClient } from "./client-page";

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionsClient />
    </Suspense>
  );
}
