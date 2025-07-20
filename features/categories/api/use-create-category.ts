import { client } from "@/lib/hono";
import { InferResponseType ,InferRequestType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"




type ResponseType = InferResponseType<typeof client.api.categories.$post>
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];



export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    const mutaiton = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category created");
            queryClient.invalidateQueries({
                queryKey: ["categories"] 
            })
        },
        onError: () => {
            toast.error("Failed to create Category")
        },  
    })

    return mutaiton
}