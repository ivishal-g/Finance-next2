import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"





export const NewAccountSheet = () => {
    
    return(
        <Sheet open>
            <SheetContent>
                <SheetTitle>
                    New Account
                </SheetTitle>
                <SheetDescription>
                    create a new account to track your finances
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}