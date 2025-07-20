import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CategoryForm } from "./category-form";
import { insertAccountSchema } from "@/lib/schemas/account";
import z from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategory } from "../api/use-get-category";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useOpenCategory } from "../hooks/use-open-category";



 

const formSchema = insertAccountSchema.pick({
    name:true,
})


type FormValues = z.input<typeof formSchema>;


export const EditAccountSheet = () => {
    const {isOpen, onClose, id} = useOpenCategory();

    const [confirmDialag, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction"
    )
    const accountQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);


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
                    <CategoryForm  
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