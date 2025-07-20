import { client } from "@/lib/hono";
import { InferResponseType ,InferRequestType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"




type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>



export const useDeleteAccount = (id?:string) => {
    const queryClient = useQueryClient();
    const mutaiton = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({ 
                param:{ id },
             });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account updated");
            queryClient.invalidateQueries({ queryKey: ["account", {id}] });
            queryClient.invalidateQueries({ queryKey: ["accounts"]})

            
        },
        onError: () => {
            toast.error("Failed to edit account")
        },  
    })

    return mutaiton
}