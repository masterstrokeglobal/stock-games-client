import { operatorAPI } from "@/lib/axios/operator-API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Get all operators with filters
export const useGetAllOperators = (filter: any) => {
    return useQuery({
        queryKey: ["operators", filter],
        queryFn: async () => {
            const operators = await operatorAPI.getAllOperators(filter);
            return operators.data;
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