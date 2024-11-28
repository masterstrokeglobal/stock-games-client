import api from "./instance";

export const agentAPI = {
    // Create a new agent
    createAgent: async (agentData: any) => {
        return api.post("/agent", agentData);
    },

    // Get all agents with optional filters
    getAllAgents: async (filter?: SearchFilters) => {
        return api.get("/agent", {
            params: filter
        });
    },

    // Get agent by ID
    getAgentById: async (agentId: string) => {
        return api.get(`/agent/${agentId}`);
    },

    // Get referrals for a specific agent
    getMyReferrals: async (filter: any) => {
        return api.get(`/agent/my-referrals/${filter.agentId}`, {
            params: filter
        });
    },

    // Update agent information
    updateAgent: async (agentId: string, updateData: any) => {
        return api.patch(`/agent/${agentId}`, updateData);
    },
    profitLoss: async (agentId: string) => {
        return api.get(`/agent/profit-loss/${agentId}`);
    }

};