import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import z from "zod";
import { Loader2 } from "lucide-react";


import { useConfirm } from "@/hooks/use-confirm";
import { useGetTransaction } from "../api/use-get-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { insertTransactionSchema } from "@/lib/schemas/transactions";
import { TransactionForm } from "./transaction-form";





const formSchema = insertTransactionSchema.omit({
    id: true,
})


type FormValues = z.input<typeof formSchema>;


export const EditTransactionSheet = () => {
    const {isOpen, onClose, id} = useOpenTransaction();

    const [ConfirmDialag, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction."
    )
    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);


    const isPending = editMutation.isPending || deleteMutation.isPending;


    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    }

    const onDelete = async () => {
        const ok = await confirm();

        if(ok){
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            })
        }
    }
    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date 
            ? new Date(transactionQuery.data.date)
            : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: "",
        payee: "",
        notes: "",
    };


     
    return(
        <>
        <ConfirmDialag/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing transaction
                    </SheetDescription>
                </SheetHeader>
                {isPending ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                     </div>
                    ) : (
                    <TransactionForm  
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            onDelete={onDelete}
                            defaultValues={defaultValues}
                            accountOptions={[]} // TODO: Replace with actual account options
                            categoryOptions={[]} // TODO: Replace with actual category options
                            onCreateAccount={() => {}} // TODO: Replace with actual handler
                            onCreateCategory={() => {}} // TODO: Replace with actual handler
                        />)
                    }
            </SheetContent> 
        </Sheet>
    </>
    )
}