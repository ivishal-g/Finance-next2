
import { client } from "@/lib/hono";
import { InferResponseType ,InferRequestType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"




type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"];



export const useBulkCreateTransactions = () => {
    const queryClient = useQueryClient();

    const mutaiton = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-create"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction deleted");
            queryClient.invalidateQueries({
                queryKey: ["transactions"] 
            })
        },
        onError: () => {
            toast.error("Failed to crete transactions")
        },  
    })

    return mutaiton
}