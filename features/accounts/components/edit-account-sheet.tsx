import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/lib/schemas/account";
import z from "zod";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";


 

const formSchema = insertAccountSchema.pick({
    name:true,
})


type FormValues = z.input<typeof formSchema>;


export const EditAccountSheet = () => {
    const {isOpen, onClose, id} = useOpenAccount();

    const [confirmDialag, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction"
    )
    const accountQuery = useGetAccount(id);
    const editMutation = useEditAccount(id);
    const deleteMutation = useDeleteAccount(id);


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