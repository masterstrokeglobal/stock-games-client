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
            toast.error(error.response?.data?.message ?? "Error creating deposit request");
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
            toast.error(error.response?.data?.message ?? "Error creating withdrawal request");
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

export const useGetUserTransactions = (filter: any) => {
    return useQuery({
        queryKey: ["transactions", "user", filter],
        queryFn: () => paymentAPI.getUserTransactions(filter),
    });
}

// Get Transaction by ID
export const useGetTransactionById = (transactionId: string) => {
    return useQuery({
        queryKey: ["transaction", transactionId],
        queryFn: () => paymentAPI.getTransactionById(transactionId),
    });
};

export const useCreateCompanyDepositRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: paymentAPI.createCompanyDepositRequest,
        onSuccess: () => {
            toast.success("Deposit request created successfully");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "company" });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating deposit request");
        },
    })
};

export const useDepositCoinsToCompanyWallet = () => {
    return useMutation({
        mutationFn: paymentAPI.depositCoinsToCompanyWallet,
        onSuccess: () => {
            toast.success("Coins deposited successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error depositing coins");
        },
    });
}

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
            toast.error(error.response?.data?.message ?? "Error updating transaction");
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
            toast.success("Withdrawal updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error confirming withdrawal");
        },
    });
};

export const useGetWallet = () => {
    return useQuery({
        queryKey: ["user", "wallet"],
        queryFn: paymentAPI.getUserWallet,
    })
}

export const useGetCompanyProfitLoss = (companyId: string) => {
    return useQuery({
        queryKey: ["company", "profit-loss", companyId],
        queryFn: () => paymentAPI.getProfitLoss(companyId),
    });
};

export const useGetUserProfitLoss = (userId: string) => {
    return useQuery({
        queryKey: ["user", "profit-loss", userId],
        queryFn: () => paymentAPI.getUserProfitLoss(userId),
    });
}

export const useGetCompanyWalletTransactions = (filter: any) => {
    return useQuery({
        queryKey: ["company", "wallet", "transactions", filter],
        queryFn: () => paymentAPI.companyWalletTransactions(filter),
    });
}

export const useVerifyCompanyDeposit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: paymentAPI.verifyCompanyDeposit,
        onSuccess: () => {
            toast.success("Deposit verified successfully");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "company" });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error verifying deposit");
        },
    });
}
