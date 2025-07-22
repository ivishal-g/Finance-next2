import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"




type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>



export const useDeleteCategory = (id?:string) => {
    const queryClient = useQueryClient();
    const mutaiton = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({ 
                param: { id },
                json: {},
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category updated");
            queryClient.invalidateQueries({ queryKey: ["category", {id}] });
            queryClient.invalidateQueries({ queryKey: ["categories"]})
            queryClient.invalidateQueries({ queryKey: ["transactions"]})


            
        },
        onError: () => {
            toast.error("Failed to edit category")
        },  
    })

    return mutaiton
}