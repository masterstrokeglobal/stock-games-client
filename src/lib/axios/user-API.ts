import api from "./instance";

export const userAPI = {


    getAllUsers: async (filter: SearchFilters) => {
        return api.get("/user", {
            params: filter
        });
    },

    getUserById: async (userId: string) => {
        return api.get(`/user/${userId}`);
    },

    deleteUserById: async (userId: string) => {
        return api.delete(`/user/${userId}`);
    },
};
