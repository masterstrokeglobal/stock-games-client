import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentAPI } from "@/lib/axios/payment-API"; // Adjust the path as needed

// Create Deposit Request
export const useCreateDepositRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentAPI.createDepositRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Deposit request created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error creating deposit request");
        },
    });
};

// Create Withdrawal Request
export const useCreateWithdrawalRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentAPI.createWithdrawalRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Withdrawal request created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error creating withdrawal request");
        },
    });
};

// Get All Transactions
export const useGetTransactions = (filter: any) => {
    return useQuery({
        queryKey: ["transactions", filter],
        queryFn: () => paymentAPI.getTransactions(filter),
        // Ensuring fresh data after mutation, which will invalidate this query
    });
};

// Get Transaction by ID
export const useGetTransactionById = (transactionId: string) => {
    return useQuery({
        queryKey: ["transaction", transactionId],
        queryFn: () => paymentAPI.getTransactionById(transactionId),
    });
};

// Update Transaction by ID
export const useUpdateTransactionById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentAPI.updateTransactionById,
        onSuccess: (data, variables) => {
            // Invalidate the specific transaction data so it gets refetched
            queryClient.invalidateQueries({ queryKey: ["transaction", variables.transactionId] });
            // Optionally invalidate the transactions list if necessary
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Transaction updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error updating transaction");
        },
    });
};

// Confirm Withdrawal
export const useConfirmWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentAPI.confirmWithdrawal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Withdrawal confirmed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error confirming withdrawal");
        },
    });
};
