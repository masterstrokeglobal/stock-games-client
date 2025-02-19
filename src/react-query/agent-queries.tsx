import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { agentAPI } from "@/lib/axios/agent-API"; // Adjust the path as needed

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