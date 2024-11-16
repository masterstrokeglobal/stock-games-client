import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { transactionAPI } from "@/lib/axios/transactions-API"; // Adjust the path as needed

export const useCreateTransaction = () => {
    return useMutation({
        mutationFn: transactionAPI.createTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error creating transaction");
        },
    });
};

export const useGetAllTransactions = (filter?: Record<string, any>) => {
    return useQuery({
        queryKey: ["transactions", filter],
        queryFn: () => transactionAPI.getAllTransactions(filter),
    });
};

export const useGetTransactionById = (transactionId: string) => {
    return useQuery({
        queryKey: ["transaction", transactionId],
        queryFn: () => transactionAPI.getTransactionById(transactionId),
    });
};


export const useUpdateTransactionById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transactionAPI.updateTransactionById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "transactions";
                },
            });
            toast.success("Transaction updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error updating transaction");
        },
    });
};


export const useDeleteTransactionById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transactionAPI.deleteTransactionById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "transactions";
                },
            });
            toast.success("Transaction deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error deleting transaction");
        },
    });
};
