import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { useNewAccount } from "../hooks/use-new-account"
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/lib/schemas/account";
import z from "zod";
import { useCreateAccount } from "../api/use-create-account";


 

const formSchema = insertAccountSchema.pick({
    name:true,
})


type FormValues = z.input<typeof formSchema>;


export const NewAccountSheet = () => {
    const {isOpen, onClose} = useNewAccount();

    const mutation = useCreateAccount();

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
                    New Account
                </SheetTitle>
                <SheetDescription>
                    create a new account to track your finances
                </SheetDescription>
                    <AccountForm 
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