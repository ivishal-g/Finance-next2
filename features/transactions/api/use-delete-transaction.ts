import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

          console.log("Deleting transaction with ID:", id);

  const mutation = useMutation<ResponseType, Error>({
      mutationFn: async () => {
        if (!id) {
          throw new Error("Transaction id is required");
        }
        const response = await client.api.transactions[":id"]["$delete"]({
          param: { id },
        });

        return await response.json();
      },
    onSuccess: () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  return mutation;
};
