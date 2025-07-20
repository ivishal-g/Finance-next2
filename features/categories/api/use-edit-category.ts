import { client } from "@/lib/hono";
import { InferResponseType ,InferRequestType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"




type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];



export const useEditCategory = (id?:string) => {
    const queryClient = useQueryClient();
    const mutaiton = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({ 
                param:{ id },
                json,
             });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category updated");
            queryClient.invalidateQueries({ queryKey: ["category", {id}] });
            queryClient.invalidateQueries({ queryKey: ["categories"]})

            
        },
        onError: () => {
            toast.error("Failed to edit category")
        },  
    })

    return mutaiton
}