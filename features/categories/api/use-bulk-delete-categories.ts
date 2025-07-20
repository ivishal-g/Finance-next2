import { client } from "@/lib/hono";
import { InferResponseType ,InferRequestType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"




type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];



export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();

    const mutaiton = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({
                queryKey: ["categories"] 
            })
        },
        onError: () => {
            toast.error("Failed to delete categories")
        },  
    })

    return mutaiton
}