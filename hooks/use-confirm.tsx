



import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import { JSX } from "react/jsx-runtime";




export const useConfirm = (
    title: string,
    message:string,
) : [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise ] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    })

    const handleclose = () => {
        promise?.resolve(true);
        setPromise(null); 
    }

    const handlecancel = () => {
        promise?.resolve(false);
    }

    const confirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button
                        onClick={handlecancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleclose}
                        className="ml-2"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )    
    return [confirmationDialog, confirm];
}