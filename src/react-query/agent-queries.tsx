import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { agentAPI } from "@/lib/axios/agent-API"; // Adjust the path as needed
import { AxiosError } from "axios";
import AgentWallet from "@/models/agent-wallet";

// Get all agents with filters
export const useGetAllAgents = (filter: SearchFilters) => {
    return useQuery({
        queryKey: ["agents", filter],
        queryFn: () => agentAPI.getAllAgents(filter),
    });
};

// Get agent by ID
export const useGetAgentById = (agentId: string) => {
    return useQuery({
        queryKey: ["agents", agentId],
        queryFn: () => agentAPI.getAgentById(agentId),
    });
};

// Get agent's referrals
export const useGetAgentReferrals = (filter: any) => {
    return useQuery({
        queryKey: ["agents", filter, "referrals"],
        queryFn: () => agentAPI.getMyReferrals(filter),
    });
};

// Create new agent
export const useCreateAgent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: agentAPI.createAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "agents";
                },
            });
            toast.success("Agent created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating agent");
        },
    });
};

// Update agent
export const useUpdateAgent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ agentId, updateData }: { agentId: string; updateData: any }) =>
            agentAPI.updateAgent(agentId, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "agents";
                },
            });
            toast.success("Agent updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating agent");
        },
    });
};

// Get agent profit and loss
export const useGetAgentProfitLoss = (filter: {
    agentId?: string,
    startDate?: Date,
    endDate?: Date,
}) => {
    return useQuery({
        queryKey: ["agents", "profit-loss", filter],
        queryFn: () => agentAPI.profitLoss(filter),
        enabled: !!filter.agentId,
    });
};

// Update agent password
export const useUpdateAgentPassword = () => {
    return useMutation({
        mutationFn: ({ agentId, password }: { agentId: string; password: string }) =>
            agentAPI.updateAgentPassword(agentId, password),
        onSuccess: () => {
            toast.success("Agent password updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating password");
        },
    });
};

// Update agent chips deposit
export const useUpdateAgentChipsDeposit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: agentAPI.updateAgentChipsDeposit,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "agents";
                },
            });
            toast.success("Agent chips deposit updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating agent chips deposit");
        },
    });
};


// Update agent chips withdrawal
export const useUpdateAgentChipsWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: agentAPI.updateAgentChipsWithdrawal,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "agents";
                },
            });
            toast.success("Agent chips withdrawal updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating agent chips withdrawal");
        },
    });
};

// Create agent chips deposit request
export const useCreateAgentChipsDepositRequest = () => {
    return useMutation({
        mutationFn: agentAPI.createAgentChipsDepositRequest,
        onSuccess: () => {
            toast.success("Agent chips deposit request created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating agent chips deposit request");
        },
    });
};

// Create agent chips withdrawal request
export const useCreateAgentChipsWithdrawRequest = () => {
    return useMutation({
        mutationFn: agentAPI.createAgentChipsWithdrawRequest,
        onSuccess: () => {
            toast.success("Agent chips withdrawal request created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating agent chips withdrawal request");
        },
    });
};

// get Agent wallet details
export const useGetAgentWallet = (agentId: string) => {
    return useQuery<AgentWallet, AxiosError>({
        queryKey: ["agents", "wallet", agentId],
        queryFn: async () => {
            const agent = await agentAPI.getAgentWallet(agentId);
            return new AgentWallet(agent.data);
        }
    });
};

// get Agent Transactions 
export const useGetAgentTransactions = (filter: any) => {
    return useQuery({
        queryKey: ["agents", "transactions", filter],
        queryFn: () => agentAPI.getTransactions(filter),
    });
};


// update user  deposit request status
export const useUpdateDepositRequestStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: agentAPI.updateUserDepositRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "agents";
                },
            });
            toast.success("Deposit request status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating deposit request status");
        },
    });
};

// update user  withdraw request status
export const useUpdateWithdrawRequestStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: agentAPI.updateUserWihtdrawRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "agents";
                },
            });
            toast.success("Withdraw request status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating withdraw request status");
        },
    });
};