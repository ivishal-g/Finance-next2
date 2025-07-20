import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CategoryForm } from "./category-form";
import z from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategory } from "../api/use-get-category";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useOpenCategory } from "../hooks/use-open-category";
import { insertCategorySchema } from "@/lib/schemas/categories";



const formSchema = insertCategorySchema.pick({
    name:true,
})


type FormValues = z.input<typeof formSchema>;


export const EditCategorySheet = () => {
    const {isOpen, onClose, id} = useOpenCategory();

    const [ConfirmDialag, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this category."
    );

    const categoryQuery = useGetCategory(id);
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
    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
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
                        Edit Category
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing category
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