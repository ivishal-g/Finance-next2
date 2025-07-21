import { client } from "@/lib/hono";
import { InferResponseType ,InferRequestType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"




type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];



export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();

    const mutaiton = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account deleted");
            queryClient.invalidateQueries({
                queryKey: ["accounts"] 
            })
        },
        onError: () => {
            toast.error("Failed to delete accounts")
        },  
    })

    return mutaiton
}