import { operatorAPI } from "@/lib/axios/operator-API";
import Operator from "@/models/operator";
import { Transaction } from "@/models/transaction";
import User from "@/models/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Get all operators with filters
export const useGetAllOperators = (filter: any) => {
    return useQuery({
        queryKey: ["operators", filter],
        queryFn: async () => {
            const response = await operatorAPI.getAllOperators(filter);
            return response.data;
        },
    });
};

// Create new operator
export const useCreateOperator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.createOperator,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "operators";
                },
            });
            toast.success("Operator created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating operator");
        },
    });
};

// Deposit operator wallet
export const useDepositOperatorWallet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.depositOperatorWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "operators";
                },
            });
            toast.success("Operator wallet deposit successful");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error depositing to operator wallet");
        },
    });
};

// Create user (by operator agent)
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "users";
                },
            });
            toast.success("User created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating user");
        },
    });
};

// Update operator
export const useUpdateOperator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.updateOperator,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "operators";
                },
            });
            toast.success("Operator updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating operator");
        },
    });
};

// Get operator by id
export const useGetOperatorById = (id: number) => {
    return useQuery({
        queryKey: ["operators", id],
        queryFn: async () => {
            const operator = await operatorAPI.getOperatorById(id);
            return new Operator (operator.data);
        },
    });
};


export const useGetCurrentOperator = () => {
    return useQuery({
        queryKey: ["current-operator"],
        queryFn: async () => {
            const operator = await operatorAPI.getCurrentOperator();
            return new Operator(operator.data);
        },
    });
};

// Get below operators
export const useGetBelowOperators = (filter?: { operatorId: number, page: number, limit: number }, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["operators", filter],
        queryFn: async () => {
            const response = await operatorAPI.getBelowOperators(filter);
            const operator = response.data.data;
            return {
                data: operator,
                count: response.data.count
            }
        },
        enabled: options?.enabled ?? true,
    });
};

// Get operator users
export const useGetOperatorUsers = (filter: { operatorId: number, page: number, limit: number,search?: string }) => {
    return useQuery({
        queryKey: ["operator-users", filter],
        queryFn: async () => {
            const response = await operatorAPI.getOperatorUsers(filter);
            return {
                data: response.data.data.map((item: any) => new User(item)),
                count: response.data.count
            }
        },
    });
};



// Settle transaction
export const useSettleTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.settleTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "operators" || query.queryKey[0] === "operator-transactions";
                },
            });
            toast.success("Transaction settled successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error settling transaction");
        },
    });
};


// Update betting status
export const useUpdateBettingStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.updateBettingStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "operators";
                },
            });
            toast.success("Betting status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating betting status");
        },
    });
};



// Update transfer status
export const useUpdateTransferStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.updateTransferStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "operators";
                },
            });
            toast.success("Transfer status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating transfer status");
        },
    });
};

// Get operator transactions
export const useGetOperatorTransactions = (filter:any) => {
    return useQuery({
        queryKey: ["operator-transactions", filter],
        queryFn: async () => {
            const response = await operatorAPI.getOperatorTransactions(filter);
            return {
                data: response.data.data.map((item: any) => new Transaction(item)), 
                count: response.data.count
            }
        },
    });
};
