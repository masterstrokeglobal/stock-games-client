import { operatorAPI, OperatorIndividualReportFilter } from "@/lib/axios/operator-API";
import { userAPI } from "@/lib/axios/user-API";
import { OperatorRole } from "@/models/operator";
// duplicate import removed
import { useAuthStore } from "@/context/auth-context";
import Operator from "@/models/operator";
import { Transaction } from "@/models/transaction";
import User from "@/models/user";
import { OperatorGroupedReport, OperatorGroupedReportFilter } from "@/types/operator-report";
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

// Deposit to a user's wallet by operator (Agent/Master and above)
export const useAgentDepositToUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.agentDepositToUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "operator-users" || query.queryKey[0] === "user-wallet" || query.queryKey[0] === "operator-wallet-transactions",
            });
            toast.success("Recharge successful");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message ?? "Error processing recharge";
            toast.error(message);
        },
    });
};

export const useMasterDepositToUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.masterDepositToUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "operator-users" || query.queryKey[0] === "user-wallet" || query.queryKey[0] === "operator-wallet-transactions",
            });
            toast.success("Recharge successful");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message ?? "Error processing recharge";
            toast.error(message);
        },
    });
};

// Redeem (withdraw) from a user's wallet by operator
export const useRedeemFromUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: operatorAPI.redeemFromUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "operator-users" || query.queryKey[0] === "user-wallet" || query.queryKey[0] === "operator-wallet-transactions",
            });
            toast.success("Withdrawal successful");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message ?? "Error processing withdrawal";
            toast.error(message);
        },
    });
};

// Create user (by operator) - uses standard /user endpoint like platform
export const useCreateUser = () => {
    const queryClient = useQueryClient();
    const { userDetails } = useAuthStore();

    return useMutation({
        mutationFn: async (formData: any) => {
            const baseUser = new User({
                firstname: formData.firstname,
                lastname: formData.lastname,
                username: formData.username,
                password: formData.password,
                externalUser: false,
                depositBonusPercentage: 0,
                placementNotAllowed: [],
                demoUser: false,
            });

            // Determine if current operator is agent vs higher role
            const currentRole = (userDetails as any)?.role as string | undefined;
            const isAgent = currentRole === OperatorRole.AGENT;

            // Include operatorId only for non-agent roles when provided
            const payload: any = {
                ...baseUser,
            };

            if (!isAgent && formData.operatorId) {
                payload.operatorId = Number(formData.operatorId);
            }

            const response = await userAPI.createUser(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "operator-users" || query.queryKey[0] === "users",
            });
            toast.success("User created successfully");
        },
        onError: (error: any) => {
            const status = error?.response?.status;
            const backendMsg = error?.response?.data?.message;
            const message = (status === 401 || status === 403)
                ? "Selected operator is not in your downline"
                : (backendMsg || "Error creating user");
            toast.error(message);
            console.error('Error creating user:', error);
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

// Get hierarchical user transactions (Master sees Agent's user transactions)
export const useGetHierarchicalTransactions = (filter: { operatorId: number, page: number, limit: number, search?: string, type?: string, status?: string }) => {
    return useQuery({
        queryKey: ["hierarchical-transactions", filter],
        queryFn: async () => {
            const response = await operatorAPI.getHierarchicalTransactions(filter);
            return {
                data: response.data.data ? response.data.data.map((item: any) => new Transaction(item)) : [],
                count: response.data.count || 0
            }
        },
        refetchInterval: 1000 * 5,
        staleTime : 0,
        enabled: !!filter.operatorId,
    });
};

// Get operator grouped report
export const useGetOperatorGroupedReport = (filter?: OperatorGroupedReportFilter) => {
    return useQuery({
        queryKey: ["operator-grouped-report", filter],
        queryFn: async (): Promise<OperatorGroupedReport> => {
            const response = await operatorAPI.getOperatorGroupedReport(filter);
            return response.data;
        },
        enabled: true,
    });
};

// Get operator individual report
export const useGetOperatorIndividualReport = (filter?: OperatorIndividualReportFilter) => {
    return useQuery({
        queryKey: ["operator-individual-report", filter],
        queryFn: async (): Promise<any> => {
            const response = await operatorAPI.getOperatorIndividualReport(filter);
            return response.data;
        },
        enabled: !!filter?.childId,
    });
};

// Get operator wallet transactions
export const useGetOperatorWalletTransactions = (filter: { operatorId: number, page?: number, limit?: number }) => {
    return useQuery({
        queryKey: ["operator-wallet-transactions", filter],
        queryFn: async () => {
            const response = await operatorAPI.getOperatorWalletTransactions(filter);
            return {
                data: response.data.data || response.data, // Handle different response structures
                count: response.data.count || 0
            }
        },
        enabled: !!filter.operatorId,
    });
};

// Get operator wallet balance
export const useGetOperatorWalletBalance = (operatorId: number) => {
    return useQuery({
        queryKey: ["operator-wallet-balance", operatorId],
        queryFn: async () => {
            const response = await operatorAPI.getOperatorWalletBalance(operatorId);
            return response.data;
        },
        enabled: !!operatorId,
    });
};

// Get operator profit & loss stats
export const useGetOperatorProfitLossStats = (filter: { operatorId: number, startDate?: Date, endDate?: Date }) => {
    return useQuery({
        queryKey: ["operator-profit-loss-stats", filter],
        queryFn: async () => {
            const response = await operatorAPI.getOperatorProfitLossStats(filter);
            return response.data;
        },
        enabled: !!filter.operatorId,
    });
};

// Get company profit distribution (Admin only)
export const useGetCompanyProfitDistribution = (filter: { startDate?: Date, endDate?: Date }, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["company-profit-distribution", filter],
        queryFn: async () => {
            const response = await operatorAPI.getCompanyProfitDistribution(filter);
            return response.data;
        },
        enabled: options?.enabled ?? true,
    });
};

// Pool P/L hooks
export const useGetUserPoolPL = (filter: { userId: number, startDate?: Date, endDate?: Date }) => {
    return useQuery({
        queryKey: ["user-pool-pl", filter],
        queryFn: async () => {
            const response = await operatorAPI.getUserPoolPL(filter);
            return response.data;
        },
        enabled: !!filter.userId,
    });
};

export const useGetOperatorHierarchyPoolPL = (filter: { companyId: number, startDate?: Date, endDate?: Date, operatorId?: number, includeBreakdown?: boolean }, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["operator-hierarchy-pool-pl", filter],
        queryFn: async () => {
            const response = await operatorAPI.getOperatorHierarchyPoolPL(filter);
            return response.data;
        },
        enabled: options?.enabled ?? true,
    });
};

// Validate operator percentage allocation
export const useValidateOperatorPercentage = () => {
    return useMutation({
        mutationFn: operatorAPI.validateOperatorPercentage,
        onError: (error: any) => {
            console.error("Percentage validation error:", error.response?.data?.message);
        },
    });
};

// Get settlements data
export const useGetSettlements = (filter?: { startDate?: Date, endDate?: Date, agentId?: number, aggregate?: boolean }) => {
    return useQuery({
        queryKey: ["settlements", filter],
        queryFn: async () => {
            const response = await operatorAPI.getSettlements(filter);
            return response.data;
        },
        enabled: true,
    });
};
