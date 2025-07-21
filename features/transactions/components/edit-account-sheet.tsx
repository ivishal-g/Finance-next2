import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { insertAccountSchema } from "@/lib/schemas/account";
import z from "zod";
import { Loader2 } from "lucide-react";


import { useConfirm } from "@/hooks/use-confirm";
import { useGetTransaction } from "../api/use-get-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { AccountForm } from "./transaction-form";




const formSchema = insertAccountSchema.pick({
    name:true,
})


type FormValues = z.input<typeof formSchema>;


export const EditAccountSheet = () => {
    const {isOpen, onClose, id} = useOpenTransaction();

    const [ConfirmDialag, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this account."
    )
    const accountQuery = useGetTransaction(id);
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
    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: "",
    };


    
    return(
        <>
        <ConfirmDialag/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        Edit Account
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing account
                    </SheetDescription>
                </SheetHeader>
                {isPending ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                    </div>
                    ) : (
                    <AccountForm  
                            id={id}
                            onSubmit={onSubmit} 
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />)
                    }
            </SheetContent> 
        </Sheet>
    </>
    )
}