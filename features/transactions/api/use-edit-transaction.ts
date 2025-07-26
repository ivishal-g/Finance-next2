import { client } from "@/lib/hono";
import { InferResponseType ,InferRequestType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"




type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];



export const useEditTransaction = (id?:string) => {
    const queryClient = useQueryClient();
    const mutaiton = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            if (!id) {
                throw new Error("Transaction id is required");
            }
            const response = await client.api.transactions[":id"]["$patch"]({ 
                param:{ id },
                json,
             });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("transaction updated");
            queryClient.invalidateQueries({ queryKey: ["transaction", {id}] });
            queryClient.invalidateQueries({ queryKey: ["transactions"]})
            // TODO: Invalidate summary 
            
        },
        onError: () => {
            toast.error("Failed to edit transaction")
        },  
    })

    return mutaiton
}