import api from "./instance";

export const withdrawDetailsAPI = {
    // Create a new withdrawal detail
    createWithdrawDetail: async (data: any) => {
        return api.post("/withdraw-details/", data);
    },

    // Get a specific withdrawal detail by ID
    getWithdrawDetailById: async (withdrawDetailId: string) => {
        return api.get(`/withdraw-details/${withdrawDetailId}`);
    },

    // Get all withdrawal details
    getWithdrawDetails: async (filter: any) => {
        return api.get("/withdraw-details", {
            params: filter,
        });
    },

    // Update a specific withdrawal detail by ID
    updateWithdrawDetailById: async ({ data, withdrawDetailId }: { withdrawDetailId: string, data: any }) => {
        return api.patch(`/withdraw-details/${withdrawDetailId}`, data);
    },

    // Delete a specific withdrawal detail by ID
    deleteWithdrawDetailById: async (withdrawDetailId: string) => {
        return api.delete(`/withdraw-details/${withdrawDetailId}`);
    },
};
