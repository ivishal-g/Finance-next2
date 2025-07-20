import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { insertCategorySchema } from "@/lib/schemas/categories";
import z from "zod";
import { useNewCategory } from "../hooks/use-new-category";
import { useCreateCategory } from "../api/use-create-category";
import { CategoryForm } from "./category-form";



 

const formSchema = insertCategorySchema.pick({
    name:true,
})


type FormValues = z.input<typeof formSchema>;


export const NewCategorySheet = () => {
    const {isOpen, onClose} = useNewCategory();

    const mutation = useCreateCategory();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });

    }
    
    return(
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetTitle>
                    New Catogory
                </SheetTitle>
                <SheetDescription>
                    create a new category to track your finances
                </SheetDescription>
                    <CategoryForm 
                        onSubmit={onSubmit} 
                        disabled={mutation.isPending}
                        defaultValues={{
                            name:"",
                        }}
                    />
            </SheetContent>
        </Sheet>
    )
}