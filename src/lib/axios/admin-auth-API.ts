import api from "./instance"; // Adjust the path according to your project structure

export const adminAuthAPI = {
    adminLogin: async (payload: { email: string; password: string }) => {
        return api.post("/auth/admin-login", payload);
    },
    logout: async () => {
        return api.post("/auth/logout");
    },
};
